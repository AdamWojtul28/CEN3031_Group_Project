# Sprint 2

#### Detail work you've completed in Sprint 2

- Successfully connected frontend and backend using a combination of the professor's described technique and what our group came up with in Sprint 1
- Created several wireframes for designs of the webpage
-
- Frontend was able to create a login page that checks username and password contents before sending to backend
- Backend was able to incorporate functionality for both the signin and login pages
  - For the signin page, when a new user is made, out group checks to ensure no idenitcal username exists
  - For the login page, our group was able to implement behavior based on submitted username+password and send response back to frontend
    - Correct username, password returns 202 response
    - Correct username, wrong password yields 401 response
    - No instance of username yields 404 response
  - PUT AND DELETE instances also have behavior for whether user exists or not
- Backend wrote 11 test cases for Postman to ensure the aforementioned behavior yields the appropriate response

## Videos

Back End:
NEED TO FILM

Front End:
NEED TO FILM

## List unit tests and Cypress tests for frontend

-

## List unit tests for backend

- To test backend functionality, Postman was used to mock requests; the effectiveness of the tests was considered based on whether they generated the desired outcome.
- The following requests were used for each of the following API calls (which are documented below):
  - POST Create User: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
  - POST Create Identical User (non-unique username): HAVE TO ADD
  - POST Proper Username, Password Login: Ensures that the incoming response has a body and that the outgoing response is a 202 response (Accepted), indicating a username, password match
  - POST Proper Username, Bad Password Login:Ensures that the incoming response has a body and that the outgoing response is a 401 response (Unauthorized), indicating a username match but incorrect password
  - POST User Does Not Exist Login: Ensures that the incoming response has a body and that the outgoing response is a 404 response, indicating that no such username exists in the DB
  - GET Get All Users: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
  - GET Get User By ID - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
  - GET Get User By ID - Unsuccessful: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)
  - PUT Update User Info - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
  - PUT Update User Info - User Not Found: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)
  - DELETE Delete User - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
  - DELETE Delete User - User Not Found: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)

## Add documentation for Backend API

#### User Sign Up:

- POST http://{{host}}/api/users
  The above API call requires the input of a user's email, username, and password, relying on the CreateUser(w http.ResponseWriter, r \*http.Request) to achieve this purpose. The way that the CreateUser function operates is that it first establishes the content type of the input as a json and creates a User structure, which is stored in the entities/user.go file. Once the following two operations are completed, the body of the http request is decoded and stored in the newly created user struct. Before it is encoded as part of the database, the CheckIfUserNameExists(userName string) function is called, which performs a query using the GORM .Where function to ensure that the newly created username is not a duplicate. If the username is a duplicate, a 409 (Conflict) HTTP response status code is sent, along with a message "Username is Taken!" to indicate to the user that a change in usrename is necessary to submit create a profile. If the username is unique, a 202 (Accepted) HTTP response status code is sent and a new user is created, with the 3 pieces of information originally in the body to begin.

#### User Sign In:

POST http://{{host}}/api/signin

-

#### Get Single User:

GET http://{{host}}/api/users/3

-

#### Get All Users:

GET http://{{host}}/api/users

-

#### Update User Variation 1:

PUT http://{{host}}/api/users/6

-

#### Update User Variation 2:

PUT http://{{host}}/api/users/6

-

#### Remove Single User:

DELETE http://{{host}}/api/users/6

-
