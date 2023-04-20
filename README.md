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
"connection_string": "root:2003Lopera@tcp(127.0.0.1:3306)/newschema"
```
  - Replace <password> with your local password, and <newschema> with the schema you created 
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

General Overview: Development of a social media/service that would be targeted towards university students traveling outside of the country, such as through foreign exchange or simply those who would like a place to stay on a vacation away from home.

Detailed Project Description: After you register/login, you would build your profile, including the city you live and information about you, including what you like to do, what you study, and similar content. Once your profile is set up, on the application, on the application’s calendar, you would mark certain time periods that you would like a place to stay; let’s say you would like to spend a week in Krakow, Poland the week of March 7th, 2023, so you would post that on your profile. In return, you provide a list of dates that you can house someone at your place. Once you post the dates that you can house someone, our software would provide a list of people who live in the place you would like to visit, and you can match with these people to open a chat (matchmaking would bear some resemblance to Tinder). After you match with people, you chat with them to see whether you think you would want to live with them and vice versa for the allocated time slot. Once you agree details, you fill out a form that would detail the parties, dates involved, and the addresses of the housing in each instance; these forms would ensure that both parties follow through with their plans. After the experience is over, you rate the person once for how they were as a host and how they were as a guest.

Project Features:
  •	Registration/Login
  •	Database of all of the students registered for this service (this would not be visible to all users, only to administrators)
  •	A profile page
    o	Includes reviews
  •	Calendar of when you can house someone and when you would like to be housed, including at what city
  •	Map/Globe (if time permits)
  •	Chat
  •	Contract Form

Team members:
  - Nico Lopera
  - Darrion Ramos
  - Alexander Vargas
  - Adam Wojtulewski

*** Important Details ***

Timeline of Project for Back-end:
  1) Determine how to implement Database
  2) Implement Database
  3) Create profile
  4) Implement registration/login
  

Timeline of Project for Front-end:
  1) Research possibilities for map and calendar
  2) Outline visuals/UI using Balsamic

*** Sprint 1 ***

For Sprint 1, these are the tenative roles and responsibilities of each group member:
Watch the following video: 
  https://www.youtube.com/watch?v=k5E2AVpwsko
  - Nico Lopera (Front-end Engineer)
    - Research map implementation
    - Outline UI
  - Darrion Ramos (Back-end Engineer)
    - learn basics of Go
    - Research basic databases and libraries that we can use
    - implement database
  - Alexander Vargas (Front-end Engineer)
    - Find map API for angular
    - Wireframe UI design
- Adam Wojtulewski (Back-end Engineer)
    - Learn Go Basics
    - Research basic databases and libraries that we can use 
    
This is the schedule of team meetings for Sprint 1:
- Thursday 3:30PM 2-3 hours: all 4 members

What each group member has accomplished during this sprint:
  - Nico Lopera
  - Darrion Ramos
  - Alexander Vargas
    - Decided on Angular Google Maps (AGM) for map components on 1/17/2023
  - Adam Wojtulewski
    - Created outline/project description on 1/11/2023
    - Set up the Github Repository and organized README Document on 1/15/2023
    - Wrote and sent email to Alexander Webber asking for project feedback on 1/12/2023
