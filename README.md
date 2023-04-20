*** Sprint 0 ***

Project Name:
# Worldlier Application

## How to run application:
Before running the project, you will need to have the following installed on your machine:

- Node.js (https://nodejs.org/en/download/)
- Angular CLI (https://angular.io/guide/setup-local)
- golang(https://go.dev/doc/install)
- Download and open MySQL workbench (This must be open to run the backend)
  - Import the SQL file (in the clone repo under backend/SQL_Files/worldlier_data_users.sql) into a new schema
  - Manually add the admins into your admin table

Installation:
- Clone the repository to your local machine.
- Open your terminal or command prompt and navigate to the application directory (frontend/new-webapp).
- Run the following command to install the frontend dependencies:
```
npm install
```
Running the project:
- Navigate to the config.json in the backend folder and edit the following line
```
"connection_string": "root:YOUR_PASSWORD@tcp(127.0.0.1:3306)/YOUR_SCHEMA"
```
  - Replace YOUR_PASSWORD with your password for your local instance, and YOUR_SCHEMA with the name of the schema you created 
- Open your terminal or command prompt and navigate to the backend folder

- Start the backend server by running the following command:

```
go build
go run . 
```
- Open a new terminal and navigate to the application in the frontend folder (frontend/new-webapp)
- Start the frontend server by running the following command
```
ng serve
```
- The server should now be running
- Open your web browser and go to http://localhost:5000 to view the application.

General Overview: The initial goal was to develop a social media/service that would be targeted towards university students traveling outside of the country, such as through foreign exchange or simply those who would like a place to stay on a vacation away from home. During the production of the application, we ran into ethical and privacy concerns and decided to change the aim of our application. We chose to stick with our original theme of global connectivity and continued with a web application that would allow users to chat with people from locations around the world. 
