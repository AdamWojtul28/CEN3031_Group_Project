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

## Add documentation for your backend API
