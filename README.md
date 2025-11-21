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
