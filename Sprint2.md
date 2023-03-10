# Sprint 2

#### Detail work you've completed in Sprint 2

- Successfully connected frontend and backend using a combination of the professor's described technique and what our group came up with in Sprint 1
- Created several wireframes for designs of the webpage
- Unit testing for front end components
- Frontend was able to create a login page that checks username and password contents before sending to backend
- Backend was able to incorporate functionality for both the signin and login pages
  - For the signin page, when a new user is made, our group checks to ensure no idenitcal username exists
  - For the login page, our group was able to implement behavior based on submitted username+password and send response back to frontend
    - Correct username, password returns 202 response
    - Correct username, wrong password yields 401 response
    - No instance of username yields 404 response
  - PUT AND DELETE instances also have behavior for whether user exists or not
- Backend wrote 11 test cases for Postman to ensure the aforementioned behavior yields the appropriate response
- Expanded the user table in the MySQL database. The user table now has more information other than the basic username and password, which will be used in sprint 2 to update user profile data

## Videos

Video Playlist: https://youtube.com/playlist?list=PLM13o7WkU3n-Ov_DN9FCeHqabErb8Sbqp

## List unit tests and Cypress tests for frontend

UNIT TESTS  
AppComponent
  ```
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  ```
```
  it(`should have as title 'worldlier-webapp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('worldlier-webapp');
  });
  ```
  HomeComponent/AboutComponent/BookingComponent/LoginComponent/SignupComponent/ProfileComponent/FooterComponent/NavbarComponent (One test for each)
  ```
  it('should create', () => {
    expect(component).toBeTruthy();
  });
```

CYPRESS TESTS
```
describe('Create User / Login Test', () => {
  it('Does not allow sign up with existing username', () => {
    cy.visit('http://localhost:5000/')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    cy.contains('Sign Up').click()
    cy.url().should('include', '/signup')

    cy.get("[data-cy='email']").type('example@email.com')
    cy.get("[data-cy='username']").type('user123')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='signup-btn']").click()
    cy.get("[data-cy='err-msg']").should(($span) => {
      expect($span).to.have.text(' Username is Taken! OK')
    })
  })

  it('Navigates to profile page after logging in', () => {
    cy.visit('http://localhost:5000/login')
    cy.get("[data-cy='username']").type('user123')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='login-btn']").click()
    cy.url().should('include', '/users/user123')
    cy.get("[data-cy='username']").should(($p) => {
      expect($p).to.have.text('Username: user123')
    })
  })
})
```

## List unit tests for backend

- To test backend functionality, Postman was used to mock requests; the effectiveness of the tests was considered based on whether they generated the desired outcome.
- The following requests were used for each of the following API calls (which are documented below):
  - POST Create User: Ensures that the incoming response has a body and that the outgoing response is accepted (202 response)
```
pm.test("must have body and send 202 (Accepted) Response when unique username", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(202);
});
```
  - POST Create Identical User (non-unique username): Ensures that the incoming response has a body and that the outgoing response is a 409 response (Conflict), indicating a username duplicate exists
```
pm.test("must have body, send 409 (Conflict) Response for duplicate username", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(409);
});
```
  - POST Proper Username, Password Login: Ensures that the incoming response has a body and that the outgoing response is a 202 response (Accepted), indicating a username, password match
```
pm.test("must have body and send 202 (Accepted) Response for good username, password combo", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(202);
});
```
  - POST Proper Username, Bad Password Login:Ensures that the incoming response has a body and that the outgoing response is a 401 response (Unauthorized), indicating a username match but incorrect password
```
pm.test("must have body, send 401 (Unauthorized) Response for good username, bad password", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(401);
});
```
  - POST User Does Not Exist Login: Ensures that the incoming response has a body and that the outgoing response is a 404 response, indicating that no such username exists in the DB
```
pm.test("must have body, send 404 (Not Found) Response for non-existing users", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(404);
});
```
  - GET Get All Users: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
```
pm.test("successfully retreive all users", function () {
     pm.response.to.be.ok;
});
```
  - GET Get User By ID - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
```
pm.test("successfully retreive user by ID", function () {
     pm.response.to.be.ok;
});
```
  - GET Get User By ID - Unsuccessful: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)
```
pm.test("retreive user by ID failed, user does not exist", function () {
     pm.response.to.have.status(404);
});
```
  - PUT Update User Info - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
```
pm.test("must have body, update user by ID", function () {
     pm.response.to.be.ok;
     pm.response.to.be.withBody;
});
```
  - PUT Update User Info - User Not Found: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)
```
pm.test("must have body, update user by ID failed, user does not exist", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(404);
});
```
  - DELETE Delete User - Successful: Ensures that the incoming response has a body and that the outgoing response is successful (200 response)
```
pm.test("successfully deletes user by ID", function () {
     pm.response.to.be.ok;
});
```
  - DELETE Delete User - User Not Found: Ensures that the incoming response has a body and that the outgoing response conveys that the user was not found (404 response)
```
pm.test("delete user by ID failed, user does not exist", function () {
     pm.response.to.have.status(404);
});
```

## Add documentation for Backend API

#### User Sign Up:

- POST http://localhost:5000/api/users
  The above API call requires the input of a user's email, username, and password, relying on the CreateUser(w http.ResponseWriter, r \*http.Request) to achieve this purpose. The way that the CreateUser function operates is that it first establishes the content type of the input as a json and creates a User structure, which is stored in the entities/user.go file. Once the following two operations are completed, the body of the http request is decoded and stored in the newly created user struct. Before it is encoded as part of the database, the CheckIfUserNameExists(userName string) function is called, which performs a query using the GORM .Where function to ensure that the newly created username is not a duplicate. If the username is a duplicate, a 409 (Conflict) HTTP response status code is sent, along with a message "Username is Taken!" to indicate to the user that a change in usrename is necessary to submit create a profile. If the username is unique, a 202 (Accepted) HTTP response status code is sent and a new user is created.

#### User Sign In:

- POST http://localhost:5000/api/signin
  The above API call requires the input of a user's username and password for the purposes of logging into the page; this route relies on the UserLoginAttempt(w http.ResponseWriter, r \*http.Request) function to achieve this purpose. The way that the UserLoginAttempt function operates is that it first establishes the content type of the input as a json and creates a User structure, which is stored in the entities/user.go file. Once the following two operations are completed, the body of the http request is decoded and stored in the newly created user struct. Once this is completed, the CheckIfExactUserExists(userName string) function is called, a variation of the CheckIfUserNameExists which checks if a username and password combination exists in the database, using the GORM .Where function with 2 parameters. If the username does not exist in the database, a 404 (Not found) HTTP response status code is sent, along with a message "No such username exists!". If the username does exists in the database, but the provided password does not match up with the value stored in the DB, a 401 (Unauthorized) HTTP response status code is sent, along with a message "Incorrect password!". If the username password combination is correct, a 202 (Accepted) HTTP response status code is sent and the message "Proceed to page!" is sent.

#### Get Single User:

GET http://localhost:5000/api/users/{id}

- The above API call takes the id parameter in the URL and uses it to find a user with the corresponding id, which is the primary key used in the application; this call uses the GetUserById(w http.ResponseWriter, r \*http.Request) function to achieve this purpose. Firstly, the parameter in the URL is taken and stored in a mux variable. Then, before retreiving this user and encoding information to send back to user, the CheckIfUserIdExists function is employed, which takes the recently created ID of the user and queries for this id in the database. If the ID turns out to be zero (which is not possible since the first value in the database will be 1), this indicates that the user does not exist in the database, returning a false boolean. Otherwise, the instance of that user is stored and this user's information is encoded as a json and sent back to the frontend.

#### Get All Users:

GET http://localhost:5000/api/users

- This function takes in no parameters and calls the GetUsers function. The GetUsers function takes all instances of users and encodes it into a json file and sends this json file to the front end.

#### Update User Variation 1:

PUT http://localhost:5000/api/users/{id}

- The above API call takes the id parameter in the URL and uses it to find (and later update) a user with the corresponding id, which is the primary key used in the application; this call uses the UpdateUser(w http.ResponseWriter, r \*http.Request) function to achieve this purpose. Firstly, the parameter in the URL is taken and stored in a mux variable. Then, before retreiving this user and encoding information to send back to user, the CheckIfUserIdExists function is employed, which takes the recently created ID of the user and queries for this id in the database. If the ID turns out to be zero (which is not possible since the first value in the database will be 1), this indicates that the user does not exist in the database, returning a false boolean. Otherwise, the instance of that user is decoded, saved, and later updated by encoding the json body provided.

#### Update User Variation 2:

PUT http://localhost:5000/api/users/{id}

- This API call behaves the same as the first update user variation, the only difference being that this updates detailed user information. Such as addresses, country, and other details.

#### Remove Single User:

DELETE http://localhost:5000/api/users/{id}

- The above API call takes the id parameter in the URL and uses it to find (and later update) a user with the corresponding id, which is the primary key used in the application; this call uses the DeleteUser(w http.ResponseWriter, r \*http.Request) function to achieve this purpose. Firstly, the parameter in the URL is taken and stored in a mux variable. Then, before retreiving this user and encoding information to send back to user, the CheckIfUserIdExists function is employed, which takes the recently created ID of the user and queries for this id in the database. If the ID turns out to be zero (which is not possible since the first value in the database will be 1), this indicates that the user does not exist in the database, returning a false boolean. Otherwise, the instance of that user is deleted and the encoded message "User Deleted Successfully!" is sent to the frontend.
