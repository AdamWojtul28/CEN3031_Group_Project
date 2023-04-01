# Sprint 3

## Detail work you've completed in Sprint 3

The primary work that was completed by our group during this sprint dealt with making user sessions much more secure and to provide funtionality related to the interaction between users on our app. For the former, we implemented cookies and sessions in our application, which are currently set to 2 minutes. For the latter, what we mean by this is functionality related to the searching of different properties/people (search functionality) as well beginning to add functionality for users of different roles, like user and administrator (authorization).

#### Work Completed by Frontend During this Sprint

- Admin Page:
  - An admin can view all users on the website and has the ability to delete a user (ex. for misbehavior)
  - Need to implement authentication for admin page
- Session token:
  - Backend sends session token and expiry, user remains logged in while session has not expired
- Profile page functionality:
  - Previously, users were only able to view their own profile. Now they can view the profile of any user by going to /users/username
  - Users can edit their profile information
  - User can now logout through their profile page
- Search Listings
  - Users can search listings within a chosen radius of a city
  - Does not yet show results of listings, only sends request to backend

#### Work Completed by Backend During this Sprint

- Sessions and Cookies
  - Now, our program supports functionality where once a user logs in, they are given a cookie that is active for 2 minutes; this cookie refreshes whenever the user changes pages or interacts with the page.
- Search for User
  - A user is now able to look for users that are within a certain distance from a certain address that is provided by the user (currently only textual, but by implementing a map into the frontend, we will be able to use latitude and longitude points as well); this functionality was completed thanks to the "github.com/codingsince1985/geo-golang" library to generate a latitude and longitude for each address, which can then be used with the "github.com/umahmood/haversine" library to calculate distances between any two places on the global. While the endpoint relied on the use of a POST protocol at first, we shifted towards using querying within the URL, as this provided much more flexibility and functionality for our group, allowing us to incorporate the range from a certain point in the search.
- Adding a listing
  - A user is now able to post a listing (when they are able to be a host), along with the number of people they are able to host in that time period. The software currently developed also performs autochecks to ensure that the user does not create multiple listings for the same time period; currently the maximum people that can be hosted are 4 per listing, as we do not see it being necessary to accomodate more at the time.
- User Connections
  - users can now send other users friend requests, accept friend requests, and remove friends. These user connections are stored in a table as sender, reciever, and status. This will allow the front end to know if the friendship is active (accepted) or if someone needs to accept an invitation (pending). Additionally, knowing which username is the sender of the request and which is the reciever will allow for proper information displayed to the respective user.

## List unit tests and Cypress tests for frontend

#### Currently only includes tests from Sprint 2 below

UNIT TESTS  
Login Component

```
it('should have form invalid when both fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form invalid when username is empty', () => {
    component.loginForm.controls['password'].setValue('12345');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form invalid when password is empty', () => {
    component.loginForm.controls['username'].setValue('testuser');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form valid when both fields are filled in', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('12345');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call onSubmitLogin() method on form submission', () => {
    spyOn(component, 'onSubmitLogin');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.onSubmitLogin).toHaveBeenCalled();
  });
```

Signup Component

```
it('should have an email input field', () => {
    const emailInput = fixture.debugElement.query(By.css('[data-cy=email]'));
    expect(emailInput).toBeTruthy();
  });
  it('should have a username input field', () => {
    const usernameInput = fixture.debugElement.query(By.css('[data-cy=username]'));
    expect(usernameInput).toBeTruthy();
  });
  it('should have a password input field', () => {
    const passwordInput = fixture.debugElement.query(By.css('[data-cy=password]'));
    expect(passwordInput).toBeTruthy();
  });
  it('should submit the form when the submit button is clicked', () => {
    spyOn(component, 'onSubmitCreateUser');
  
    const emailInput = fixture.debugElement.query(By.css('[data-cy=email]')).nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('[data-cy=username]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('[data-cy=password]')).nativeElement;
    const submitButton = fixture.debugElement.query(By.css('[data-cy=signup-btn]')).nativeElement;
  
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'testpassword';
    passwordInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    submitButton.click();
  
    expect(component.onSubmitCreateUser).toHaveBeenCalled();
  });
```

CYPRESS TESTS

Sprint 3 only cypress tests listed:
```
describe ('Test Admin / Logout / Listing Search', () => {
  it('Signs up and logs out', () => {
    cy.visit('http://localhost:5000/signup')
    cy.get("[data-cy='email']").type('example@email.com')
    cy.get("[data-cy='username']").type('testuser')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='signup-btn']").click()
    cy.url().should('include', '/users/testuser')
    cy.get("[data-cy='logout-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/')
  })

  it('Deletes new user on admin page', () => {
    cy.visit('http://localhost:5000/admin')
    cy.contains('testuser').should('exist')
    cy.contains('testuser').click().parent().parent().children('.col-6').children('.btn').click()
    cy.contains('testuser').should('not.exist')
  })

  it('Sends a listing search get request', ()=> {
    cy.visit('http://localhost:5000/booking')
    cy.get("[data-cy='location-input']").type('Oxford, England')
    cy.get("[data-cy='distance-input']").type('1000')
    cy.get("[data-cy='unit-input']").select('mi')
    cy.get("[data-cy='search-btn']").click()
    cy.get("[data-cy='http-sent']").should('contain', "Search was sent!")
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

### Sprint 3 Tests

 - GET - Get User By Username (Query)
 - Endpoint: http://localhost:5000/api/users?username=FredSmith
 - Test ensures that the incoming response returns a 200 response when a valid username is searched for in the database
```
pm.test("successfully retreive user by username", function () {
     pm.response.to.be.ok;
});
```

- GET - Fail Get User By Username (Query)
 - Endpoint: http://localhost:5000/api/users?username=PeytonManning
 - Test ensures that the incoming response returns a 204 (No Content), when username is not in the database
```
pm.test("retreive user by username failed, user does not exist", function () {
     pm.response.to.have.status(204);
});
```

- POST - Send Friend Request - Successful
 - Endpoint: http://localhost:5000/api/sendFriendRequest
 - Test ensures that the incoming response returns a 202 (Accepted), when no existing friendship exists and no prior friend request was sent
```
pm.test("must have body and send 202 (Accepted) Response when unique username", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(202);
});
```

- POST - Send Friend Request - Successful
 - Endpoint: http://localhost:5000/api/sendFriendRequest
 - Test ensures that the incoming response returns a 409 (Conflict response)
```
pm.test("must send 'Connection already exists' and code 409", function () {
     pm.response.to.have.status(409);
});
```

- POST - Accept Friend Request - Successful
 - Endpoint: http://localhost:5000/api/acceptFriendRequest
 - Test ensures that the incoming response returns a 202 (Accepted) response when status turns from pending to accepted (for valid connection)
```
pm.test("must have body and send 202 (Accepted) Response when unique username", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(202);
});
```

- POST - Accept Friend Request - Unsuccessful
 - Endpoint: http://localhost:5000/api/acceptFriendRequest
 - Test ensures that the incoming response returns a 404 for an invalid connection
```
pm.test("must send code 404", function () {
     pm.response.to.have.status(404);
});
```

- POST - Remove Friend - Successful
 - Endpoint: http://localhost:5000/api/removeFriend
 - Test ensures that the incoming response returns a 200 response for when a user exists and is removed
```
pm.test("must send code 200", function () {
     pm.response.to.have.status(200);
});
```

- POST - Remove Friend - Unsuccessful
 - Endpoint: http://localhost:5000/api/removeFriend
 - Test ensures that the incoming response returns a 404 response for when a user does not exist
```
pm.test("must send code 404", function () {
     pm.response.to.have.status(404);
});
```

- GET - Search - Users Near Oxford, England
 - Endpoint: http://localhost:5000/api/search?location=Oxford%2C%20England&maxDistance=1000&unit=mi
 - Test ensures that the incoming response returns a 200 response for when users exist near desired location, testUser1 comes first then Jack Daniels
```
pm.test("users near desired destination exist", function () {
     pm.response.to.be.ok;
});
```

- GET - Search - Users Near Krakow, Poland
 - Endpoint: http://localhost:5000/api/search?location=Krakow%2C%20Poland&maxDistance=1500&unit=mi
 - Test ensures that the incoming response returns a 200 response for when users exist near desired location; here Jack Daneils comes first then testUser1
```
pm.test("users near desired destination exist", function () {
     pm.response.to.be.ok;
});
```

- GET - Search - Users Near Krakow, Poland
 - Endpoint: http://localhost:5000/api/search?location=Krakow%2C%20Poland&maxDistance=1500&unit=mi
 - Test ensures that the incoming response returns a 200 response for when users exist near desired location; here Jack Daneils comes first then testUser1
```
pm.test("users near desired destination exist", function () {
     pm.response.to.be.ok;
});
```


- GET - Search - No Users Near Auckland, New Zealand
 - Endpoint: http://localhost:5000/api/search?location=Auckland%2C%20New%20Zealand&maxDistance=300&unit=km
 - Test ensures that the incoming response returns a 204 response for when no users exist near desired location, yet valid URL
```
pm.test("no users near desired destination exist", function () {
     pm.response.to.have.status(204);
});
```

- POST - Welcome page - Successful
 - Endpoint: http://localhost:5000/api/welcome
 - Tests that an authorized user can access the welcome page
```
pm.test("must have body and send 200", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(200);
});
```

- POST - Welcome page - Unsuccessful
 - Endpoint: http://localhost:5000/api/welcome
 - tests that an unauthorized user cannot access the webpage
```
pm.test("must send unauthorized response", function () {
     pm.response.to.have.status(401);
});
```

- POST - Refresh Page - Successful
 - Endpoint: http://localhost:5000/api/refresh
 - Tests to make sure that a users token is refreshed
```
pm.test("must have body and send 200 Response", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(200);
});
```

- POST - Refresh Page - Unsuccessful
 - Endpoint: http://localhost:5000/api/refresh
 - Tests to ensure unauthorized users cannot refresh their token
```
pm.test("must send unauthorized response", function () {
     pm.response.to.have.status(401);
});
```

- POST - Logout Page - Successful
 - Endpoint: http://localhost:5000/api/logout
 - Tests that logged in users that exist can log out successfully
```
pm.test("must have body and send 202 (Accepted) Response when unique username", function () {
     pm.response.to.have.status(202);
});
```

- POST - Logout Page - Unsuccessful
 - Endpoint: http://localhost:5000/api/logout
 - Tests that unauthorized users cannot log out
```
pm.test("must send unauthorized response", function () {
     pm.response.to.have.status(401);
});
```

## Add documentation for Backend API

### Exclusively Sprint 2 Documentation: 
  
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


### New documentation for Backend API

#### User Sign Up:

POST http://localhost:5000/api/users

- The above API call requires the input of a user's email, username, and password, relying on the CreateUser(w http.ResponseWriter, r \*http.Request) to achieve this purpose. The way that the CreateUser function operates is that it first establishes the content type of the input as a json and creates a User structure, which is stored in the entities/user.go file. Once the following two operations are completed, the body of the http request is decoded and stored in the newly created user struct. Before it is encoded as part of the database, the CheckIfUserNameExists(userName string) function is called, which performs a query using the GORM. Where function to ensure that the newly created username is not a duplicate. If the username is a duplicate, a 409 (Conflict) HTTP response status code is sent, along with a message "Username is Taken!" to indicate to the user that a change in usrename is necessary to submit create a profile. If the username is unique, a 202 (Accepted) HTTP response status code is sent and a new user is created.
  - Sprint 3: The passwords are now hashed and stored in the database using bycrpt. Creating a new user will also log them in with a token for two minutes as described in login route.

#### User Sign In:

POST http://localhost:5000/api/signin

- The above API call requires the input of a user's username and password for the purposes of logging into the page; this route relies on the UserLoginAttempt(w http.ResponseWriter, r \*http.Request) function to achieve this purpose. The way that the UserLoginAttempt function operates is that it first establishes the content type of the input as a json and creates a User structure, which is stored in the entities/user.go file. Once the following two operations are completed, the body of the http request is decoded and stored in the newly created user struct. Once this is completed, the CheckIfExactUserExists(userName string) function is called, a variation of the CheckIfUserNameExists which checks if a username and password combination exists in the database, using the GORM .Where function with 2 parameters. If the username does not exist in the database, a 404 (Not found) HTTP response status code is sent, along with a message "No such username exists!". If the username does exists in the database, but the provided password does not match up with the value stored in the DB, a 401 (Unauthorized) HTTP response status code is sent, along with a message "Incorrect password!". If the username password combination is correct, a 202 (Accepted) HTTP response status code is sent and the message "Proceed to page!" is sent.
  -Sprint 3: The user sign in now also creates a user cookie and database token using UUID, this is used to verify and authenticate user sessions. This user is now also assigned an expiry date for the token (currently 2 minutes). If the token is expired the user cannot use it to log in. These tokens will be changed and expiry renewed after every page refresh or moving to a new page. 

#### User Welcome Page:

POST http://localhost:5000/api/welcome

- This API call will be used to bring the user to the welcome/homepage of the website. The user must be logged in to access this site. As long as the user has a valid token that matches the database token, a code 200 is sent and a welcome message to the user.

#### Refresh Page:

POST http://localhost:5000/api/refresh

- This API call will be used to bring the user to refresh the user's cookie and the database token (making a new one entirely and distributing it) while also restarting the two minute expiry timer. This route should be called whenever the token should be renewed.
 
#### Logout Route:

POST http://localhost:5000/api/logout

- This API call will be used to bring the user to logout the user from their current session. This means that the users cookie and the token in the database will be removed and the expiry time will be changed to the current time.

#### Get Single User by Username:

GET http://localhost:5000/api/users?username=exampleUserName

- This route will return a user struct that matches the entered username if one exists (search for user via username).

#### Send Friend Request:

POST http://localhost:5000/api/sendFriendRequest

- This creates a new user connection in the connections table. This table is simply the username of the sender of the friend request, the username of the reciever, and the status of the request. The status will always be pending when sending a request. The frontend can use the sender/reciever information to display the proper information to each user.

#### Accept Friend Request:

POST http://localhost:5000/api/acceptFriendRequest

- Simply updates the entry in the connections table that corresponds to the user clicking accept, by changing the status of the connection to accepted. This checks first if there is a valid connection to modify.
  
#### Remove Friend:

POST http://localhost:5000/api/removeFriend

- Deletes a valid entry in the connectinons table. Checks for either combination of sender/reciever since either can cancel the friendship.

#### Add Listing:

POST http://localhost:5000/api/listings

 - The above API call requires the frontend to send a Listing Object, which contains information about the listing, including start date, end date, status, capacity, and information about the host and guests. If a listing conflicts with another listing, the host will not be able to post the listing, as a host can only put up one listing at a time as it currently stands.

#### Searching Test:

GET http://localhost:5000/api/search

- The above API call, when provided with URL query parameters, retreives other users platform who are close the desired location of the user, sent as a JSON Object to the frontend in sorted fashion, where users closest to the desired location are retreived first and furthest users from the desired location, but still within the radius of search (represented by the maxDistance parameter) are retreived last. Currently, this endpoint only works when all 3 parameters are provided.
  - In the case of the following endpoint: http://localhost:5000/api/search?location=Oxford%2C%20England&maxDistance=1000&unit=mi, all users who are within 1000 miles of Oxford, England are retreived.
