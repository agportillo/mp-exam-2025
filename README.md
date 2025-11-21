## EXPLICACIÓN DE LA ARQUITECTURA
  Como se puede apreciar en la siguiente imagen, la misma estuvo conformada por un entorno local el cual cuenta con el siguiente stack de tecnologías: VS Code, React, Git. Desde visual studio code se establece la comunicación con los repositorios: mp-backend y mp-frontend en Azure DevOps. Estos mismos repositorios, cada uno, cuenta con dos ramas: web-mp-dev y web-mp-prod, los cuales son los equivalentes a los namespaces construídos en ambiente de Openshift. Sin embargo, se posee un servidor intermedio dentro del cual se ejecuta un agente auto hospedado de Azure DevOps, el cual tiene la comunicación directa con Openshift, así mismo tiene instalados los siguientes: Harbor, Docker, Podman Registry, Helm, YQ, skopeo, etc. En Openshift se crea un namespace mp-argo-cd para la orquestación de los cambios entre los dos namespaces restantes.
  
<img width="1050" height="467" alt="image" src="https://github.com/user-attachments/assets/4ecde893-c77e-4030-9d17-5220e95552e6" />

## AMBIENTE LOCAL<br/>
  En la siguiente captura se puede apreciar el conjunto de directorios que conforman el proyecto en VS Code:
<img width="397" height="1018" alt="image" src="https://github.com/user-attachments/assets/86f0d89e-199e-4eb7-9274-2609779e8462" />
## AZURE DEVOPS<br/>
  En Azure se establece la conexión con el servidor de la imagen, la cual está instalada en Pop-OS:
<img width="1532" height="235" alt="image" src="https://github.com/user-attachments/assets/924a1899-3f79-4c92-a1cc-af5ddc3708b6" />
  A continuación, el estado del agente de Azure en Pop-OS:
<img width="1040" height="227" alt="image" src="https://github.com/user-attachments/assets/27a593d1-7e54-4d41-99f9-a54cf5a9138d" />
  En Azure DevOps se utiliza el proyecto: boards project y a continuación se muestra el conjunto de repositorios
<img width="691" height="391" alt="image" src="https://github.com/user-attachments/assets/3426ec6a-e9e1-4ca4-9a61-70468c93265b" />
  <br/>Así como también se construye 1 pipeline para cada repositorio:
<img width="1710" height="427" alt="image" src="https://github.com/user-attachments/assets/d637ef6c-9ed2-4430-a771-7b8a89c23e60" />
  Evaluando la arquitectura en Openshift, se puede apreciar la creación de los dos namespaces utilizados para el ejercicio:
- <img width="656" height="55" alt="image" src="https://github.com/user-attachments/assets/1064036c-dc7e-49ce-831d-22b5ace83297" />
- <img width="1472" height="152" alt="image" src="https://github.com/user-attachments/assets/f090b0cd-dc12-4a92-9e89-f8b5958a5eae" />
  Igualmente se utiliza el namespace mp-argo-cd para la instalación de los componentes de ArgoCD:
- <img width="1461" height="412" alt="image" src="https://github.com/user-attachments/assets/118b2ca6-05c2-4a0d-9c67-8dcccafd11f9" />
- <img width="1167" height="692" alt="image" src="https://github.com/user-attachments/assets/d2a214a4-fda5-4ce1-8fb2-72d9f02af7c2" />
- <img width="797" height="197" alt="image" src="https://github.com/user-attachments/assets/db3c1b88-8d09-4a69-85a7-6cf147321854" />
## DETALLE DEL CÓDIGO Y SCRIPTS UTILIZADOS
- El pipeline en Azure DevOps se encuentra nombrado como azure-pipelines.yml el cual contiene lo siguiente:
- Tarea en Docker para la construcción de la imagen, en dicha tarea se especifica el Dockerfile a utilizar, el nombre y tag que se le pondrá a la imagen.
  ```
  - task: Docker@2
      displayName: Build Docker Image With PopOS
      inputs:
        command: build
        repository: $(imageName)
        dockerfile: $(dockerfilePath)
        tags: $(latestTag)
        script: |
          tree $(System.DefaultWorkingDirectory)
  ```
  <img width="1396" height="855" alt="image" src="https://github.com/user-attachments/assets/c2386adb-e055-46dd-b15f-2a97f653ac57" />

- Tarea tipo Bash donde se guarda de forma inicial la imagen en el repositorio donde se ejecuta la tarea de Azure DevOps, acá la imagen se almacena de forma temporal como .tar
  ```
  - task: Bash@3
      displayName: Save Docker Image to Local File
      inputs:
        targetType: 'inline'
        script: |
          docker save -o $(System.DefaultWorkingDirectory)/$(imageName).tar $(imageName):$(latestTag)
          tree $(System.DefaultWorkingDirectory)
  ```
  <img width="1172" height="661" alt="image" src="https://github.com/user-attachments/assets/1910fb6d-a4ca-4a9c-9c2d-876336de5390" />

- Luego se ejecuta una siguiente tarea tipo Bash, en donde se evalúa si la imagen construída ya existe en Openshift, de lo contrario, se ejecutan las sentencias skopeo para tomar el .tar y enviarlo al Podman Registry. Seguidamente, se realiza el proceso de logueo en Harbor y se ejecuta otra sentencia skopeo para tomar la imagen del Podman Registry y nuevamente enviarla a Harbor. También se toma la imagen del Podman Registry para luego enviarla con skopeo a Openshift, para finalmente eliminar el .tar
  ```
  - task: Bash@3
      displayName: Send Docker Image to Different Registries
      inputs:
        targetType: 'inline'
        script: |
          tree $(System.DefaultWorkingDirectory)
          set -x

          string=$(oc describe istag/$(imageName):$(latestTag) -n openshift);
          EXIT_STATUS=$?

          if [ "$EXIT_STATUS" -eq "0" ]; then
            echo "$string";
          else
            # Se envía la imagen de .tar hacía PODMAN REGISTRY LOCAL
            echo "Enviando la imagen de .tar hacía PODMAN REGISTRY"
            skopeo copy --dest-no-creds --dest-tls-verify=false docker-archive:$(System.DefaultWorkingDirectory)/$(imageName).tar docker://localhost:4000/common-services/$(imageName):$(latestTag)
            
            # Se logea skopea para luego enviar la imagen del podman registry hacía HARBOR
            echo "Enviando la imagen de PODMAN REGISTRY hacía HARBOR"
            echo $(pass_root) | sudo -S skopeo login aportillo.local.com -u admin -p $(pass_harbor)
            echo $(pass_root) | sudo -S skopeo copy --src-no-creds --src-tls-verify=false docker://localhost:4000/common-services/$(imageName):$(latestTag) docker://aportillo.local.com/common-services/$(imageName):$(latestTag)

            # Se envía la imagen de podman registry hacía OPENSHIFT
            echo "Enviando la imagen de PODMAN REGISTRY hacía OPENSHIFT"
            skopeo copy --src-no-creds --src-tls-verify=false --dest-tls-verify=false --dest-creds=developer:$(oc whoami -t) docker://localhost:4000/common-services/$(imageName):$(latestTag) docker://default-route-openshift-image-registry.apps-crc.testing/openshift/$(imageName):$(latestTag)
          fi

          # Se elimina el .tar
          echo "Eliminando .tar"
          rm $(System.DefaultWorkingDirectory)/$(imageName).tar
  ```
- <img width="1493" height="830" alt="image" src="https://github.com/user-attachments/assets/34e7d4d3-aa60-4a2e-8620-86a2c4fb19ae" />
- <img width="1707" height="497" alt="image" src="https://github.com/user-attachments/assets/9da70fb3-2f35-46bb-8c3b-c98fca739250" />
- <img width="1083" height="287" alt="image" src="https://github.com/user-attachments/assets/8a06bbbe-90df-44d7-bc5d-f80c1bd30d3c" />
- <img width="1605" height="126" alt="image" src="https://github.com/user-attachments/assets/61b580aa-63cb-4c25-ad52-43354e0ef591" />

<br/> 
- Para finalizar, a travez de la última tarea del pipeline, se ejecutan las instrucciones para realizar la instalación de los componentes en Openshift: Configmap, route, svc, deployment. Los cuales se encuentran detallados dentro del archivo openshift-objects.yml
```
- task: Bash@3
      displayName: Apply Deployment
      inputs:
        targetType: 'inline'
        script: |
          set -x
          tree $(System.DefaultWorkingDirectory)
          oc apply -f $(System.DefaultWorkingDirectory)/openshift-objects.yml -n web-mp-dev

          oc rollout restart deployment/$(imageName) -n web-mp-dev
```
- <img width="1493" height="830" alt="image" src="https://github.com/user-attachments/assets/1d0ac014-8492-4f59-a659-f46aedd45222" />

```
trigger:
- web-mp-dev

pool:
  name: Pop!OS-Agent

variables:
  imageName: 'mp-backend'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  latestTag: '1.0.0'

stages:
- stage: Build
  displayName: Build Docker Image
  jobs:  
  - job: Build
    displayName: Build
    steps:
    - task: Docker@2
      displayName: Build Docker Image With PopOS
      inputs:
        command: build
        repository: $(imageName)
        dockerfile: $(dockerfilePath)
        tags: $(latestTag)
        script: |
          tree $(System.DefaultWorkingDirectory)
    - task: Bash@3
      displayName: Save Docker Image to Local File
      inputs:
        targetType: 'inline'
        script: |
          docker save -o $(System.DefaultWorkingDirectory)/$(imageName).tar $(imageName):$(latestTag)
          tree $(System.DefaultWorkingDirectory)
    - task: Bash@3
      displayName: Send Docker Image to Different Registries
      inputs:
        targetType: 'inline'
        script: |
          tree $(System.DefaultWorkingDirectory)
          set -x

          string=$(oc describe istag/$(imageName):$(latestTag) -n openshift);
          EXIT_STATUS=$?

          if [ "$EXIT_STATUS" -eq "0" ]; then
            echo "$string";
          else
            # Se envía la imagen de .tar hacía PODMAN REGISTRY LOCAL
            echo "Enviando la imagen de .tar hacía PODMAN REGISTRY"
            skopeo copy --dest-no-creds --dest-tls-verify=false docker-archive:$(System.DefaultWorkingDirectory)/$(imageName).tar docker://localhost:4000/common-services/$(imageName):$(latestTag)
            
            # Se logea skopea para luego enviar la imagen del podman registry hacía HARBOR
            echo "Enviando la imagen de PODMAN REGISTRY hacía HARBOR"
            echo $(pass_root) | sudo -S skopeo login aportillo.local.com -u admin -p $(pass_harbor)
            echo $(pass_root) | sudo -S skopeo copy --src-no-creds --src-tls-verify=false docker://localhost:4000/common-services/$(imageName):$(latestTag) docker://aportillo.local.com/common-services/$(imageName):$(latestTag)

            # Se envía la imagen de podman registry hacía OPENSHIFT
            echo "Enviando la imagen de PODMAN REGISTRY hacía OPENSHIFT"
            skopeo copy --src-no-creds --src-tls-verify=false --dest-tls-verify=false --dest-creds=developer:$(oc whoami -t) docker://localhost:4000/common-services/$(imageName):$(latestTag) docker://default-route-openshift-image-registry.apps-crc.testing/openshift/$(imageName):$(latestTag)
          fi

          # Se elimina el .tar
          echo "Eliminando .tar"
          rm $(System.DefaultWorkingDirectory)/$(imageName).tar
    - task: Bash@3
      displayName: Apply Deployment
      inputs:
        targetType: 'inline'
        script: |
          set -x
          tree $(System.DefaultWorkingDirectory)
          oc apply -f $(System.DefaultWorkingDirectory)/openshift-objects.yml -n web-mp-dev

          oc rollout restart deployment/$(imageName) -n web-mp-dev
```
