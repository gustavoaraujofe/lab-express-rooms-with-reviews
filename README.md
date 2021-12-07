![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Rooms App with Reviews - final practice for project #3


Link to your frontend repository here: [Link](https://github.com/gustavoaraujofe/lab-express-rooms-with-reviews-front-end)


## Introduction

In this lab, we will create a fullstack application from scratch over the span of multiple iterations.

## Instructions

The app needs to have users (signup, login, logout functionality) and full CRUD on at least one of the models, but that one model can't be just users (you can have CRUD on users as well, but that can't be the only one). So let's summarize the requirements:

- **Models**: user, room, reviews
- **Routes**: auth, rooms, reviews, users (optional, in case you want to add CRUD on users as well)
- **Views**: all the necessary pages so the users can auth themselves and do the CRUD. For easier navigation through your files and consistent naming please organize all the pages into folders (ex. _auth-views_, _room-views_, _comment-views_, ...)

### Iteration #0 | Create the project

First of all, we need to separate our Frontend from our Backend. Let's create two separate repositories to keep things better organized. On the top of this file you will find these parts:

"Link to your backend repository here:

Link to your frontend repository here:""

Just paste the link (A Markdown link, just research how to create links inside Markdown) to your backend and frontend repositories in front of the correct phrase.

Now, let's go to our server repository and initialize an empty Express app there:

```bash
$ npm init -y
$ touch app.js
$ npm install express mongoose dotenv
```

## Iteration #1 | The "Plumbing"

Configure your app.js file with all necessary parts for the Express server to run: dotenv and environment variables, configurations for receiving JSON requests, importing routers and setting the database up, and lastly, initializing the server to listen for HTTP requests.

Remember that everything that you need is in our class examples, let's exercise that research muscle!

## Iteration #2 | API Authentication

Right now, everyone can create, view, edit or delete everyone else's rooms and reviews. That's because there's no way we can know who's using our app if we don't include some kind of authentication. Using the JWT strategy, Passport and the React Context API, create the Login, Signup and Logout functionalities for our app:

💡 Make sure you install all the packages: _bcryptjs_, _jsonwebtoken_ and _express-jwt_.

- Create a Signup endpoint in the backend (don't forget to hash the user's password before writing to the database!);
- Wire up all the necessary JWT configurations and middlewares for issuing, signing and validating JWTs;
- Create a Login route, that returns a valid access token to the client;
- Protect every CRUD route in the backend so only logged in users can access them (only accept requests containing a valid access token in the Authorization header) using our custom middlewares;

## Iteration #3 | The CRUD on `room` model

Great, we have the boilerplate so let's start adding some more functionality to our app.
Our rooms will have following schema:

```js
const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  reviews: [], // we will update this field a bit later when we create review model
});
```

When the app is ready, our users should be able to:

- create new rooms
- edit and delete the rooms
- see the list of the rooms

Please proceed to creating all the routes and files necessary for the Room CRUD to work

## Iteration #3.1 | The `review` model and (optional) CRUD on it

Great, you already have fully functioning CRUD in the backend for the rooms, but we will go one more step: let's create _reviews section_ for each room.

The review schema can look like this:

```js
const reviewSchema = new Schema({
  comment: { type: String, maxlength: 200 },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
});
```

Now we can go ahead and update `reviews` property in the _roomSchema_:

```js
...
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' } ]
...
```

Our users should be able to:

- Make reviews for all the rooms but the ones they created
- Edit and/or delete their comments (optional)
- See the rooms and all the comments

## Iteration #4 | Back to the frontend

You should have a fully functioning REST API by now, so let's give a face to our app.

Create all the React components necessary for the following functionalities:

- A homepage, displaying all the rooms that are available for renting;
- A navigation menu, with links to every page in the app;
- A room creation form, so users can create new rooms;
- (BONUS) A room update form, so users can modify an existing room that they had previously created;
- (BONUS) A room deletion button, that deletes the clicked room from the database.

_Hint: Remember that we don't have authentication yet, so it's ok if everyone can edit or delete everyone else's rooms. We're gonna fix that in the next iteration_

## Iteration #4.1 | Frontend for reviews

Now that our main pages are done, it's time to give a little attention to the reviews.

- Create a room details page, using the specified id from the URL to display all the room information;
- In the room details, display all the reviews that the specified room has attached to it;
- In the room details, create a "Review" button that opens a little form for users to comment on that room;
- [BONUS] In the room details, while displaying the room reviews, add an edit button and a delete button in each review, so users can edit or delete their comments

## Iteration 5# | React Authentication

That does it for our server. Back in the client, we need to:

- Wire up a Context in React to store and retrieve the access token from `localStorage`
- Setup an Axios instance to automatically insert the access token in every request _(Tip: maybe take a look at Axios interceptors)_
- [BONUS] Avoid weird usability issues by redirecting unauthorized users away from protected routes

If you did everything correctly, you can now configure our pages to:

- Only allow logged in users to create rooms;
- Only show rooms that were **not** created by the logged in user in the homepage;
- Only allow users to edit and delete their own rooms;
- Only allow logged in users to review existing rooms;
- Only allow users to edit or delete their own reviews

If you made this far, congratulations! You built a fullstack application from scratch! Your app is ready for production. Go ahead and ask for instructions from your instructor or TA on how to deploy your app.

## [SUPER BONUS] Iteration #6 | File Upload

If a complete fullstack app is not enough for you, go ahead and add file upload functionality to the app!

- Setup a free Cloudinary account, and write down your API keys;
- Using the `cloudinary`, `multer` and `multer-storage-cloudinary` NPM packages, setup a file upload route in your backend;
- Before inserting your room in the database, fire a HTTP request from React containing an image file that the user chose. Upload this image file to Cloudinary. Maybe the `multer` package may be useful here?
- Grab the image URL returned from your upload route, that is now stored in Cloudinary, and save it to your database in your normal submit flow

:party::party::party: You did it! Now your fullstack app is even more complete and you're more than ready for your final project.

Happy coding! :heart:
