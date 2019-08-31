# cafu-tech
 Designed a solution to decrease the contact rate in case of pilot-related incidents and delays the customer deliveries.
 ### Architecture & Functionality
 * **For high level ARCHITECTURE DIAGRAM refer** **[Link](https://www.lucidchart.com/documents/view/130204e7-8c54-4aca-8527-aaffc2eb1384/0_0?raw=true)**
  ![](https://www.lucidchart.com/publicSegments/view/cbd0e62c-6b1c-482e-8f39-24ba62cacfe1/image.png)
* **_PILOT_** **_USER_**:
    - first we'll create the pilot user with PILOT role that consists of CREATE and READ permission module of AUDIO MESSAGE.
    - Then pilot user will login and then create the message and he'll be able to create the message due to CREATE permission of AUDIO MESSAGE module.
    - Message was created and dumped into the database with assignedTo field which is pilot driver id and name.
* **_CUSTOMER_** **_USER_**: 
    - first we'll create the customer user with CUSTOMER role that consists of READ permission only for module of AUDIO MESSAGE.
    - Then customer user will login with JWT and then on order we have driver assigned so we'll have the id or name and then lookup the message with read permission from message service. He/she can fetch message as many times as they can.
    - Customer will not be able to create the message because it doesnot have CREATE permission for AUDIO MESSSAGE module.
    
### Tech and Modules Used
| Nodejs, MongoDB, Joi, Swagger, Docker, AWS, JWT, Npm |
| ------ |

### Pre-requisites
* Node.js > 10.x -  Install node with nvm if not installed
* npm -  Install all the modules with `npm i`
* Kill any process running on port 3012

### Starting App
* running app on the local environment
* Run `npm run start-local`
* On prod we'll be using docker
# Folder Structure!

* [config] - contains the config for different environments!.
* [db] -  contains the json for users, roles, message, modules etc...
* [private] -  all the common utils, server creation, common handler, error handler, logger are added in this which can later on moved to different repository
* [src] - contains different folder and each folder can be convereted into microservice.
        ```
        $ cd src/service-name
        ```
  - [controllers] - api methods and Joi validations required for an api (req, res, next)
  - [dbQueryBuilder] - interacting with the database include common search, creation,updates
  - [handlers] - all the business logic
  - [helpers] - common methods used throught the service
  - [models] -  database schema designing
  - [service] - contains the mapper objects
  -  [vars] - variables declarations
* [babe-start.sh]- neccessary commans for deployment on server
