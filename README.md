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

