
# Proctor Vision Chrome Extension BackEnd - README

A Backend for Proctor Vision Chrome Extension

## API Reference

#### Get All Users Data

```http
  GET /retrieve-data
```
- Get a list of all users.
```
Example Request:
GET /set_interval?interval=5

Example Response:
{
  success: true
}

```

#### SET New Interval

```http
  GET /set_interval?interval=value
```

- This route is used to set the interval for sending images to the server during an online assessment.
- The route accepts a single query parameter:

- `interval`: The time interval, in minutes, between image uploads. This parameter is required.

- Provide an example of how to use the route, including the expected response. For example:
```
Example Request:
GET /set_interval?interval=5

Example Response:
{
  success: true
}

```

#### POST New User

```http
  POST /createUser
```
- This route is used to create a new user for an online assessment.
- Next, describe the request payload for the route, which includes the firstName, lastName, email, and testInvitation fields. For example:
```
The route accepts a JSON payload with the following fields:

- `firstName`: The first name of the user. This field is required and must be a string.
- `lastName`: The last name of the user. This field is required and must be a string.
- `email`: The email address of the user. This field is required and must be a valid email address.
- `testInvitation`: The invitation code for the assessment. This field is required and must be a string.
```
- Provide an example of how to use the route, including the expected response. For example:

```
Example Request:
POST /createUser
Content-Type: application/json

{
  "firstName" : "om",
  "lastName" :"mapari",
  "email" : "ommap@gmai.com",
  "testInvitation" : "12345"
}

Example Response:
{
  "userid": "lf1xo3ai"
}
```
- In response you will get unique userid of user

#### Get item



#### POST Upload Image of User
```http
  POST /upload-image
```
