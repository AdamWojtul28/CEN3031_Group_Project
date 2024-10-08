# Sprint 4

Video Link: https://youtu.be/BrdFxvaGe9c

## Detail work you've completed in Sprint 4


#### Work Completed by Frontend During this Sprint
- Implemented live chat system
    - Connect user to websockets after loggin in
    - Receive and send messages to and from a specific user
    - Display chat with messages and time stamps
- Added admin functionality
    - Accept / Deny / Ban / Unban
    - Users must now be accepted before they can access site
- Improved user home page
    - Friends list with profile images of each friend
    - Ability to add friends and accept friend requests
    - Click on chat button to chat with a friend
    - Interactive map implemented with angular google maps
- Implemented a global map
    - Users that are logged in have access to a map on the home page
    - Location search by city moves the map
    - Marker to display the user location
- Landing page
    - For users who are not signed in
    - Contains animated text and call to create account
- User Interests
    - User can check all of their personal interests
- Route Authentication
    - Users must be logged in to access most pages
    - User must be an admin to access admin page



#### Work Completed by Backend During this Sprint
- Finished friend connection functionality so that now all of a users friends can be sent to the front end.
- Completed current admin functionality goals:
    - Admins can be manually added via SQL commands into admin table
    - To access sensitive admin only sites, users will be checked. Their current session will be grabbed and compared to the information in the admin table to verify         they are one of the admins.
    - Admins must now accept or deny new users. New users will not be able to access the site until they are approved
    - Admins can also ban users from the site 
- Added websocket functionality so that users can chat with each other:
    - There is a direct connection between users; therefore, users can have personal messages without another person knowing thanks to server of clients 
    - User can navigate between different pages on the website and the Websocket connection will remain alive
       -- Only issue is that does not work during refresh route
- Users can include tags in their profile which include their interests
    - Tags can be added, deleted, or a combination of the two, depending on the endpoint selected    
    - Endpoint returned that demonstrates the number of shared tags someone has with everyone in the database 
- The search functionality from Sprint 3 has expanded and changed from searching for listings (like AirBNB) to searching for users close to a certain point picked on the map, displaying the following info
    - Information about the users
    - Their proximity from the point selected on the map
    - Number of shared tags the searching user has with everyone from that area
    - A list of the exact tags that each of the users share
- Added the ability to store images as blobs of data so that users can have profile pictures
- Changed the SQL table values to be specific character lengths to save space

## List unit tests and Cypress tests for frontend

#### Currently only includes tests from Sprint 2 below

UNIT TESTS  (New)
Navbar Component

```
it('should initialize isAuthenticated to false', () => {
    expect(component.isAuthenticated).toBeFalse();
  });
```

Admin Component

```
it('should call onFetchUsers on init', () => {
    spyOn(component, 'onFetchUsers');
    component.ngOnInit();
    expect(component.onFetchUsers).toHaveBeenCalled();
  });
  it('should call denyUser on onDenyUser', () => {
    spyOn(usersHttpService, 'denyUser').and.returnValue(of(null));
    component.onDenyUser('user1');
    expect(usersHttpService.denyUser).toHaveBeenCalledWith('user1');
  });

  it('should call acceptUser on onAcceptUser', () => {
    spyOn(usersHttpService, 'acceptUser').and.returnValue(of(null));
    component.onAcceptUser('user1');
    expect(usersHttpService.acceptUser).toHaveBeenCalledWith('user1');
  });

  it('should call banUser on onBanUser', () => {
    spyOn(usersHttpService, 'banUser').and.returnValue(of(null));
    component.onBanUser('user1');
    expect(usersHttpService.banUser).toHaveBeenCalledWith('user1');
  });
```

Home Component
```
it('should have a title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Worldlier');
  });

  it('should have a subtitle', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.auto-type')).toBeTruthy();
  });

  it('should have a link to create an account', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Create Account');
    expect(compiled.querySelector('a').getAttribute('routerLink')).toEqual('booking');
  });
```
  
 Profile Component
```
 it('should display the username in the title', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain('test-user\'s Profile');
  });

  it('should call fetchUserByUsername with the correct parameter', () => {
    expect(usersServiceSpy.fetchUserByUsername).toHaveBeenCalledWith('test-user');
  });

  it('should call logoutUser when the logout button is clicked', () => {
    const logoutButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-cy="logout-btn"]');
    logoutButton.click();
    expect(usersServiceSpy.logoutUser).toHaveBeenCalled();
  });

  it('should toggle the password visibility when the eye icon is clicked', () => {
    const eyeIcon: HTMLElement = fixture.nativeElement.querySelector('.fa-eye-slash');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('[data-cy="password"]');
    expect(passwordInput.type).toEqual('password');
    eyeIcon.click();
    expect(passwordInput.type).toEqual('text');
    eyeIcon.click();
    expect(passwordInput.type).toEqual('password');
  });
```

ChatUser, MapDisplay, UserHome, Chat, Details, Interests, ProfileEdit Components
```
it('should create', () => {
    expect(component).toBeTruthy();
  });
```

CYPRESS TESTS
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

```
describe ('Test Friend Requests / Update Profile', () => {
  it('Creates a friendship and then destroys it', () => {
    cy.visit('http://localhost:5000')
    cy.get("[data-cy='login-header']").click()
    cy.get("[data-cy='username']").type('testuser1')
    cy.get("[data-cy='password']").type('password')
    cy.get("[data-cy='login-btn']").click()
    cy.get("[data-cy='home-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/home')
    cy.get("[data-cy='add-friend-text']").type('testuser2')
    cy.get("[data-cy='add-friend-btn']").click()
    cy.get("[data-cy='add-friend-pending']").should('contain.text','testuser2')
    cy.get("[data-cy='profile-nav']").click()
    cy.get("[data-cy='logout-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/')

    cy.visit('http://localhost:5000')
    cy.get("[data-cy='login-header']").click()
    cy.get("[data-cy='username']").type('testuser2')
    cy.get("[data-cy='password']").type('password')
    cy.get("[data-cy='login-btn']").click()
    cy.get("[data-cy='home-btn']").click()
    cy.get("[data-cy='incoming-request']").should('contain.text', 'testuser1')
    cy.get("[data-cy='accept-request-btn']").click()
    cy.get("[data-cy='incoming-request']").should('not.exist')
    cy.get("[data-cy='friend-item']").should('contain.text', 'testuser1')
    cy.get("[data-cy='delete-friend-btn']").click()
    cy.get("[data-cy='no-friends']").should('contain.text', 'You have no friends')
    
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
### Sprint 4 Tests

- POST - Retrieve Friends - Successful
- Endpoint: http://localhost:5000/api/retrieveFriends
- Tests that a list of connections where a user is present can be returned
```
pm.test("must send code 200", function () {
     pm.response.to.have.status(200);
});
```

- POST - Retrieve Friends - Unsuccessful
- Endpoint: http://localhost:5000/api/retrieveFriends
- Tests that when a user has no friends, returns a not found error
```
pm.test("must send code 404", function () {
     pm.response.to.have.status(404);
});
```

- POST - Valid Admin Check - Successful
- Endpoint: http://localhost:5000/api/validAdmin
- Tests that if the current logged in user is an admin, it returns authorized code
```
pm.test("must send code 202", function () {
     pm.response.to.have.status(202);
});
```

- POST - Accept User - Successful
- Endpoint: http://localhost:5000/api/acceptUser
- Tests that a logged in admin can alter the status of a user to accepted
```
pm.test("must send code 200", function () {
     pm.response.to.have.status(200);
});
```

- POST - Accept User - Unsuccessful
- Endpoint: http://localhost:5000/api/acceptUser
- Tests that if the user the admin tries to change does not exist, returns a 404 status
```
pm.test("must send code 404", function () {
     pm.response.to.have.status(404);
});
```

- POST - Deny User - Successful
- Endpoint: http://localhost:5000/api/denyUser
- Tests that a logged in admin can alter the status of a user to denied
```
pm.test("must send code 200", function () {
     pm.response.to.have.status(200);
});
```

- POST - Deny User - Unsuccessful
- Endpoint: http://localhost:5000/api/denyUser
- Tests that if the user the admin tries to change does not exist, returns a 404 status
```
pm.test("must send code 404", function () {
     pm.response.to.have.status(404);
});
```

- POST - Ban User - Successful
- Endpoint: http://localhost:5000/api/banUser
- Tests that a logged in admin can alter the status of a user to banned
```
pm.test("must send code 200", function () {
     pm.response.to.have.status(200);
});
```

- POST - Ban User - Unsuccessful
- Endpoint: http://localhost:5000/api/banUser
- Tests that if an admin is not logged in, a user's status can not be changed to banned
```
pm.test("must send code 401", function () {
     pm.response.to.have.status(401);
});
```

- POST - Valid Admin Check - Unsuccessful
- Endpoint: http://localhost:5000/api/validAdmin
- Tests that if the user logged in is not an admin, returns unauthorized status
```
pm.test("must send code 401", function () {
     pm.response.to.have.status(401);
});
```

- POST - Add Tags to User Success
- Endpoint: http://localhost:5000/api/tags?username=Ally
- Tests if user adds new tags to the database that were not previously selected
```
pm.test("must have body and send 202", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(202);
});
```

- POST - Add Tags to User Fail
- Endpoint: http://localhost:5000/api/tags?username=Ally
- Tests if user tries to add tags that they had previously added to the DB
```
pm.test("must have body and send 400", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(400);
});
```

- DELETE - Delete Tags from User Success
- Endpoint: http://localhost:5000/api/tags?username=Ally
- Tests if user tries to delete tags that currently exist in the DB
```
pm.test("must have body and send 202", function () {
     pm.response.to.have.status(202);
});
```

- DELETE - Add Tags from User Fail
- Endpoint: http://localhost:5000/api/tags?username=Ally
- Tests if user tries to delete tags that do not exist in the DB
```
pm.test("must have body and send 400", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(400);
});
```

- PUT - Update User Tags - No Changes
- Endpoint: http://localhost:5000/api/tags?username=Jimmy123
- Tests if user does not make any changes to tags in the DB
```
pm.test("must have body and send 400", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(400);
});
```

- PUT - Update Tags to User Success
- Endpoint: http://localhost:5000/api/tags?username=Jimmy123
- Tests if user does not make any changes to tags in the DB
```
pm.test("must have body and send 200", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(200);
});
```

- GET - Same Tags Retreival
- Endpoint: http://localhost:5000/api/tagging?username=Jack%20Daniels
- Successfully retreives all shared tags between user in Query Parameter with every user in DB that has tags
```
pm.test("must have body and send 200", function () {
     pm.response.to.be.withBody;
     pm.response.to.have.status(200);
});
```

- GET - Users with Shared Interests Near Oxford, England
- Endpoint: http://localhost:5000/api/search?username=John&location=Oxford%2C%20England&maxDistance=1000&unit=mi
- Successfully retreives all users 1000 miles from Oxford, England, along with the number of shared tags they have with user and the full list of those tags
```
pm.test("users near desired destination exist", function () {
     pm.response.to.be.ok;
});
```

- GET - Users with Shared Interests Near Krakow, Poland
- Endpoint: http://localhost:5000/api/search?username=John&location=Krakow%2C%20Poland&maxDistance=1000&unit=mi
- Successfully retreives all users 1000 miles from Oxford, England, along with the number of shared tags they have with user and the full list of those tags
```
pm.test("users near desired destination exist", function () {
     pm.response.to.be.ok;
});
```

- GET - Users with Shared Interests Near Auckland, New Zealand
- Endpoint: http://localhost:5000/api/search?username=John&location=Krakow%2C%20Poland&maxDistance=1000&unit=mi
- Retreives no users, as no user is within 1000 miles Auckland, New Zealand
```
pm.test("no users near desired destination exist", function () {
     pm.response.to.have.status(204);
});
```
## Documentation for Backend API

### Basic User Routes: 
  
#### Get Single User:

GET http://localhost:5000/api/users/{id}

- Returns a full user object as a json. Request the user to be returned by sending the route with the respective user's ID number.
    - If ID is invalid returns 404

#### Get Single User by Username:

GET http://localhost:5000/api/users?username=exampleUserName

- This route will return a user struct that matches the entered username if one exists (search for user via username).
    - If no username is given, returns error code 204 no content

#### Get All Users:

GET http://localhost:5000/api/users

- This function takes in no parameters and calls the GetUsers function. The GetUsers function takes all instances of users and encodes it into a json file and sends this json file to the front end.

#### Update User:

PUT http://localhost:5000/api/users/{id}

- Updates the user's information connected with the ID sent in the route. Send any user elements to be updated as a json object.
    - If ID is invalid returns 404

#### Remove Single User:

DELETE http://localhost:5000/api/users/{id}

- Simply removes the entire user from the backend database. The user to be deleted is the one with the corresponding ID sent in the route.
    - If ID is invalid returns 404

### Basic Page Routes
#### User Sign Up:

POST http://localhost:5000/api/users

- The above API call requires the input of a user's email, username, and password. The username must not be a duplicate entry. If the username is a duplicate, a 409 (Conflict) HTTP response status code is sent. If the username is unique, the password is hashed and all entered infromation is stored in the database along with a status tag of pending (202 Accepted code is sent). Users who have just been created should not be able to access the site, until an admin has manually accepted them and their "status" is "Accepted".

#### User Sign In:

POST http://localhost:5000/api/signin

- The above API call requires the input of a user's username and password for the purposes of logging into the page. If the username does not exist in the database, a 404 (Not found) HTTP response status code is sent, along with a message "No such username exists!". If the username does exists in the database, but the provided password does not match up with the value stored in the DB, a 401 (Unauthorized) HTTP response status code is sent, along with a message "Incorrect password!". If the username password combination is correct, a 202 (Accepted) HTTP response status code is sent and the message "Proceed to page!" is sent.
  -Sprint 3: The user sign in now also creates a user cookie and database token using UUID, this is used to verify and authenticate user sessions. This user is now also assigned an expiry date for the token (currently 2 minutes). If the token is expired the user cannot use it to log in. These tokens will be changed and expiry renewed after every page refresh or moving to a new page. 

#### User Welcome Page:

POST http://localhost:5000/api/welcome

- This API call will be used to bring the user to the welcome/homepage of the website. The user must be logged in to access this site. As long as the user has a valid token that matches the database token, a code 200 is sent and a welcome message to the user.
    - If session is expired, or there is no matching token returns a 401 error code. Any other error when checking session will return 400

#### Refresh Page:

POST http://localhost:5000/api/refresh

- This API call will be used to bring the user to refresh the user's cookie and the database token (making a new one entirely and distributing it) while also restarting the two minute expiry timer. This route should be called whenever the token should be renewed.
    - If session is expired, or there is no matching token returns a 401 error code. Any other error when checking session will return 400
 
#### Logout Route:

POST http://localhost:5000/api/logout

- This API call will be used to bring the user to logout the user from their current session. This means that the users cookie and the token in the database will be removed and the expiry time will be changed to the current time.
    - If session is expired, or there is no matching token returns a 401 error code. Any other error when checking session will return 400

### Friend Routes
#### Send Friend Request:

POST http://localhost:5000/api/sendFriendRequest

- This creates a new user connection in the connections table. This table is simply the username of the sender of the friend request, the username of the reciever, and the status of the request. The status will always be pending when sending a request. The frontend can use the sender/reciever information to display the proper information to each user. (requires a sender and reciever json object to be sent)
    - If connection already exists, returns code 409

#### Accept Friend Request:

POST http://localhost:5000/api/acceptFriendRequest

- Simply updates the entry in the connections table that corresponds to the user clicking accept, by changing the status of the connection to accepted. This checks first if there is a valid connection to modify. (requires a sender and reciever json object to be sent)
    - If connection is not found in database, will return 404
  
#### Remove Friend:

POST http://localhost:5000/api/removeFriend

- Recieves a sender and reciever json object. Deletes this pair if it is a valid entry in the connectinons table. Checks for either combination of sender/reciever since either can cancel the friendship.
    - If connection is not found in database, will return 404

#### Retrieve Friends:

POST http://localhost:5000/api/retrieveFriends

- Retrieves a username as a json, and sends a json object of all connections where the username is present, regardless of status or reciever/sender.
    - If the user has no friends, returns 404

### Admin Routes
#### Authenticate Admin:

POST http://localhost:5000/api/validAdmin

- No frontend data needs to be sent. This route will check the current user's session and cross check the logged in username and password with an admin SQL table. This table will have no routes that can edit it, so that admins can only be added manually to the table. Will return an unauthorized status if not found in the admin table and authorized if found.
    - If session is expired, or there is no matching token returns a 401 error code. If Any other error when checking session will return 400

#### Accept a User:

POST http://localhost:5000/api/acceptUser

- Recieves a json object of the username of the user to be accepted. If this username is not in the users table this will return a status not found error. If found, the function will double check that the current session is still an admin session and then will change the status of the user to "Accepted" and will return a 200 status. (Can also be used to unban a user by resetting their status to accepted)
    - If session is expired, or there is no matching token returns a 401 error code. Any other error when checking session will return 400

#### Deny a User:

POST http://localhost:5000/api/denyUser

- Operates the same as Accept user, but modifies the status so that it reads "Denied".

#### Ban a User:

POST http://localhost:5000/api/banUser

- Operates the same as Accept user, but modifies the status so that it reads "Banned".

### Tagging Routes

#### Add List of Tags:

POST http://localhost:5000/api/tags

- Receives a JSON object that contains a string of comma separated tags. The tags are first separated and then stored in a splice. After this is complete it is determine whether these are unique tags for the user in the query parameter (whether they exist in the DB or not). If they do not yet exist they are added. 
    - If no new tags are added to the DB, will return 400

#### Delete List of Tags:

DELETE http://localhost:5000/api/tags

- Receives a JSON object that contains a string of comma separated tags. The tags are first separated and then stored in a splice. After this is complete it is determine whether these are unique tags for the user in the query parameter (whether they exist in the DB or not). If they exist, they are deleted.  
    - If no tags in the JSON object are in the DB, will return 400

#### Update All Tags:
PUT http://localhost:5000/api/tags
- Receives a JSON object that contains a 2 strings of comma separated tags, one of all tags selected and one of all tags not selected. The tags for each are first separated and then stored in splices. After this is complete it is determine whether these are unique tags for the user in the query parameter (whether they exist in the DB or not). If new tags are to be added that are not in the DB, they are added. If there are tags to be deleted that exist in the DB, they are deleted. All other values are ignored. 
    - If no changes are made, will return 400

#### Get All Shared Tags with Other Users:
GET http://localhost:5000/api/tagging
- Receives a query parameter of the current user. Then this endpoint will generate how many tags this user shares with other users along with what those tags are.

### Chat Functionality
GET http://localhost:5000/api/tagging
- Receives a query parameter of the current user and a JSON object that is sent through the newly established connection containing a JSON with the name of the receiver and the message for that receives. For successful connections, direct messages are sent to users. 

### User Search Functionality
GET http://localhost:5000/api/search
- Receives 4 query parameters: 1) the username of the current user, 2) the location of users to search for, 3) distance from the location, and 4) distance unit. Then users who fall within the radius of that point are returned along with the number of shared tags and the full list of those shared tags.
