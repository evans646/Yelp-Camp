FIRST PART IS TP GET THE CRUD SECTION DONE 
SECTION 40|| EXPRESS MIDDLEWARE||
- The concept of middleware 
- Morgan Logging Middleware
- Defining custom middleware
  
Middleware are what runs between the request and response lifecycle
[https://expressjs.com/en/guide/using-middleware.html]

*Using morgan middleware*
[https://www.npmjs.com/package/morgan]
so we install it with the npm i morgan and require it afterwards
and then we need to tell the app to use morgan 
app.use(app.use(morgan('tiny'))) \\app.use allows us to run code on every single request and now when you make any request to any route you should see something like : GET /campgrounds 304 - - 49.561 ms
so morgan logs the request obj to the console
and now it tell the app to move on to the next route,if not specified, app.use() will run on all requests

*DEFINING OUR OWN MIDDLEWARE*
To define our own middleware, you need to use the next middleware to make sure the app moves on to the  nest handler 
[https://expressjs.com/en/guide/using-middleware.html]

*PASSWORD MIDDLEWARE DEMO*
To protect a specific route, you define the password middleware => 

const verifyPassword = ((req, res, next) => {
    const {password } = req.query;
    if (password === "MOUNTAINTOP") {
        next();
    };
});

This is the middleware to protect a specific route => 

app.get("/secret", verifyPassword,(req, res) => {
    res.send("My secret is: lying in bed quietly so i can relax lol")
});

and now when you visit the route /secret without providing the required password in the query string, you should see an invalid password
until you provide the right password
secret?password=MOUNTAINTOP and then you should see the secret

so we can define a bunch of these middleware that can use selectively on routes
meaning if there are multiple routes routes that are protected, next() will handle the next route closer

SECTION 41-||BASIC STYLING||
There is a  package called ejs-mate that will help us structure our app and app some functionalities as well 
[https://www.npmjs.com/package/ejs-mate]
It allows us to define a boiler plate where we will have code insert between the content
so instead of having the navbar for example on every page, we can define a basic partial for the nav or footer that every page will use 

first thing is to install the page , require and use:  npm install ejs-mate --save| engine = require('ejs-mate'),
and in the views dir we can make a new dir layouts AND MAKE A FILE AND THEN we can pass the body inside teh file    <%-body -%>
and on the file where we want to use the boilerplate  we get rid of the body and leave the content and then we can include the boiler template


<%layout('layouts/boilerplate.ejs')%>
    <title>Campgrounds</title>
    <h1>All Campgrounds</h1>
    <div>
        <a href="/campgrounds/new">Add Campground</a>
    </div>
    <ul>
        <% for (let campground of campgrounds){%>
        <li><a href="/campgrounds/<%= campground._id %>"><%= campground.title %></a></li>
        <% }%>
    </ul>

So if everything goes well the content will be passed to the boilerplate and it will be inserted into the body   <%-body -%>

now we can include fonts,css,js,bootstrap and other stuffs in the boilerplate
and if we want to make any changes we can do that on the boilerplate as well 

To include the navbar and footer partials, we make the dir partials/footer| navbar and we can include them in the boilerplate

 <%- include("../partials/Navbar")%> \\Same thing for the footer

To make the footer stick to the bottom of the page, we give the a d-flex and flex-column and set a height on the body to be vh-100 \\this give the the body a min height of vh-100
so now we can make the footer stick to the bottom so on the footer mt-auto will set it to the bottom of the page


||HANDLING EXPRESS ERRORS||
- Defining custom error handlers 
- Handling asynchronous errors 
- Defining custom error class
- Express built in error handlers
- Working with mongoose errors
  *Express built in error handler*
  [https://expressjs.com/en/guide/error-handling.html]
  REQ =>ERRORS => RESPONSE

  With express errors, you can have a route like :
  app.get("/",(req,res)=>{
      chicken.fly()
  })
  First of all we can see that chicken is not defined, so this sort of error will be thrown with the default error message, bt we can throw the error ourselves =>

for example: const verifyPassword = ((req, res, next) => {
    const {password } = req.query;
    if (password === "MOUNTAINTOP") {
        next();
    };
    //res.send("Invalid password)
   throw new Error("invalid password")\\Throwing errs using the express built in errors instead of just generating it by accidentally 
});

app.get("/secret", verifyPassword,(req, res) => {
    res.send("My secret is: lying in bed quietly so i can relax lol")
});
Now when an invalid password is entered, express will throw the error

But also we can actually define our own custom errs too 
[https://expressjs.com/en/guide/error-handling.html]
=> SYNTAX:
 app.use(function (err, req, res, next) {
  // logic
})
Writing our own error handler, requires four args that we pass to the function: (err, req, res, next)

For example we define the middle ware :

app.use(function (err, req, res, next) {
    console.error("*********************")
    console.error("*********ERROR***********")
    console.error("*********************")
    next()
  })


And when we visit any route that generate errors
app.get("/error", (req, res) => {
    chicken.fly();
})
visiting /error generates errors since chicken is not defined

We will observe that we no longer get the default error handling, but the code keeps running, but we see the error middleware triggers and logs the message to the console
but we need to pass the err in when we call next(err) which will trigger the next error handling middleware and if we console.log(err) =>

STACK TRACE:
ReferenceError: chicken is not defined
    at /Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/index.js:61:5
    at Layer.handle [as handle_request] (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/layer.js:95:5)
    at next (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/layer.js:95:5)
    at /Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:335:12)
    at next (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:275:10)
    at methodOverride (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/method-override/index.js:65:14)
    at Layer.handle [as handle_request] (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:317:13)
    at /Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:335:12)
    at next (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/index.js:275:10)
    at urlencodedParser (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/body-parser/lib/types/urlencoded.js:91:7)
    at Layer.handle [as handle_request] (/Users/evans/Desktop/DEVELOPER/PORTFOLIO /YelpCamp/node_modules/express/lib/router/layer.js:95:5)

*DEFINING CUSTOM ERROR CLASS*
We make a new a file , AppError.js and then we create a class that will extend to the built in error

class AppError extends Error{
    constructor(message, status){
        super()
        this.message = message;
        this.status = status
    };
};
module.exports = AppError

so to throw an error from this class we require the file and throw in the error on the route we want to handle where we pass in the 
error message and the status code 
 =>

const verifyPassword = ((req, res, next) => {
    const {password } = req.query;
    if (password === "MOUNTAINTOP") {
        next();
    };
   throw new AppError("invalid password",401)
});

You can also define a middleware that will use the class to handle the errors =>

app.use((err, req, re, next) => {
    //we can provide a default status code and message if there is not one 
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(status).res.send(message)
})

for for example when you visit a route that throws an error ==>
app.get("/admin", (req, res) => {
    throw new AppError("You are not an admin",403)
});

app.get("/admin", (req, res) => {
    throw new AppError("You are not an admin",403)
})

and now when you try visiting /admin you will get the error message with the status code 403

*HANDLING ASYNC ERRORS*
Handling errors in express when we are working with async functions
so after making the class, we define the middleware handler and then we can handle async errs in a try and catch block and if there is a problem we throw new error from the class utility pass to the middleware function:

app.use((err, req, re, next) => {
    //we can provide a default status code and message if there is not one 
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(status).res.send(message)
})\\This is the middleware passed to the AppError

app.delete('/campgrounds/:id', async (req, res,next) => {
    try {
    const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        if (!campground) {
            throw new AppError("NOT FOUND",401) \\We throw the error
        }
    res.redirect('/campgrounds');
    } catch(e) { \\catch it here and then pass it to next 
        next(e)
  }
});

we call next and pass in the error, which handles the error, whenever it is thrown

Considering that we have many routes to handle async errors, we cannot wrap every code around the try and catch block so we can define an async utility just as for the error class 
we can make a utility called CatchAsync and define the error handler there and then we can wrap the route around the CatchAsync
=>
const catchAsync = (fn)=>{
    return function (req, res, next) {
     fun(req,res,next).catch(e=> next(e))
 }
}
and then we can wrap this around any route that we want to handle async errors
INSTEAD OF THIS 
 =>

app.delete('/campgrounds/:id', catchASync( async (req, res,next) => {
    const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        if (!campground) {
            throw new AppError("NOT FOUND",401) \\We throw the error
        }
    res.redirect('/campgrounds');
}));

we can now remove the try and block and =>
app.delete('/campgrounds/:id', catchASync( async (req, res,next) => {
    const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        if (!campground) {
            throw new AppError("NOT FOUND",401) \\We throw the error
        }
    res.redirect('/campgrounds');
}));
And all the errors will be thrown 

*DIFFERENTIATING MONGOOSE ERRORS*
Example of mongoose errors could be validation, failure to cast a product to it's id and so on 
[https://mongoosejs.com/docs/api/error.html]


||ADDING CLIENT SIDE VALIDATIONS||
We can use the in built form validation but requiring it on the form =>
 <input class="form-control" type="text" id="title" name="campground[title]"value="<%=campground.title %>" required>

 Bootstrap comes with it's own validations:
 [https://getbootstrap.com/docs/5.0/forms/validation/]

||SERVER SIDE||
 We define a error utility and and then we can require and use it :

 module.exports = function (fn) {//we define a function that 
    return (req, res, next) => {//returns a function that, executed and catches the error and passes it on to next
        fn(req, res, next).catch(next)
    };
};

And then after requiring we can define the middleware, that next will pass on to:

app.use((err, req, res, next) => {
   res.send("OH NO SOMETHING WENT WRONG")
});

Now we can wrap the error utility around all the routes we want to catch  the errors for example:

app.post('/campgrounds', CatchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
}));

Here we are trying to make a new campground and a lot can go wrong, so let's say price is a number but when you make it a string, you will get cast error
Async will catch that error and pass it on to the next() middleware which is defined. 

This is just a recap of what we did when we were manually using try and catch block, where we catch the error and pass it to next()
try{ 
    Code-block
}catch(e){
    next(e);
}

We want to prevent someone from submitted put requests maybe from post man because the only real validation is to check if the campground body is included :

app.post('/campgrounds', CatchAsync(async (req, res, next) => {
    if(!req.body.campground) throw new ExpressError('Invalid campground Data',400)
    const campground = new Campground(req.body.campground);                  
        await campground.save();                                              
        res.redirect(`/campgrounds/${campground._id}`)
}));

we can write specifically to each field before submitting, but there is a tool that can help us to do once and for all called JOI 
[https://joi.dev/api/?v=17.2.1]
we install and then require it 
afterwards in the post route where we want to validate, we can define the schema | this helps us to validate the data before we even involve mongoose at all => 

app.post('/campgrounds', CatchAsync(async (req, res, next) => {
   // if(!req.body.campground) throw new ExpressError('Invalid campground Data',400) //if there is no campground || it will make it's way down to the next() middleware
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),//with price you can even give it a min or max values
        }).required()
    });
    const results = campgroundSchema.validate(req.body);
    console.log(results) 
    const campground = new Campground(req.body.campground);                    
        await campground.save();                                              
        res.redirect(`/campgrounds/${campground._id}`)
}));

This is what logs to the console(results) when we send an empty body :
{
  value: { Name: '' },
  error: [Error [ValidationError]: "campground" is required] {
    _original: { Name: '' },
    details: [ [Object] ]
  }
}
so basically we are validating everything under campground

And if we validate campground and there is error we throw new express error:
  if (results.error) {
        throw new ExpressError(results.error.details,400);
    }

the details is an array of objects so, we need to map over:

  const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),//with price you can even give it a min or max values
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
        }).required()
    });
    const { error } = campgroundSchema.validate(req.body);
    //the error details is an array of objects so we need to map over it to print it out
    const msg = error.details.map(el => el.message).join('.')
    if (error) {//after validating if there is error, like empty fields or price less than 0 
        throw new ExpressError(msg,400); //we throw new express error
    }
    And now if you make a new campground with even price -0, you will get the error msg, if you leave of title, you will get the msg
    this will validate the data, so no one can cheat by either sending a req through ajax,axios or postman 

Now this is okay to put the logic in the route handler themselves but there might be more than one place so we can move this out on a separate file  and make this more reusable

We define the middleware:

const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),//with price you can even give it a min or max values
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
        }).required()
    });
    const { error } = campgroundSchema.validate(req.body);
    //the error details is an array of objects so we need to map over it to print it out
    const msg = error.details.map(el => el.message).join('.')
    if (error) {//after validating if there is error, like empty fields or price less than 0 
        throw new ExpressError(msg,400); //we throw new express error
    } else {
        next();
    }
}

And then  we can apply the middleware on the routes that we want to validate, basically the post and the put route => 
app.put('/campgrounds/:id', validateCampground,CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

We can also move the Joi logic on another file and just require and call Campground to be validated 

| DATA RELATIONSHIPS WITH MONGO||
How we can have different models connecting to each other :
- One to few 
- One to many 
- One to bajillions
- Populate
- Mongo schema design




||ADDING THE REVIEWS MODEL||

We make the file in the reviews dir and define our model and schema:

nst mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model("Reviews",reviewSchema);

To associate the reviews with the campgrounds, we need to add the reviews on the campground schema [we specify that the reviews are obj id from the reviews model, we store the reviews on the campground as obj ids]=>
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.types.ObjectId,
            ref: "Review"
        }
    ]
});


To create a new review, we will show the reviews on the show page so we can make teh form and the specify teh actions,  and then we can make a post route to submit the form to make a new review but first we need to require the review model to make a new review =>

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);//we find the corresponding campground that we want to associate the review to
    const review = new Review(req.body.review);
    campground.reviews.push(review); // on the
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

and now you can make a new review, and when you look into the database tou will see that the reviews is on the campgrounds  as an obj ids 

But someone can create a new review so we need to add in our basic client and server side validations like we did for creating the campgrounds

The reviews are just obj ids(which contains the data) so we need to populate to display the reviews:
> db.campgrounds.find()
{ "_id" : ObjectId("608e31365f068d64cfc904f3"), "location" : "Orland Park, Illinois", "title" : "Bullfrog Backcountry", "image" : "https://source.unsplash.com/collection/429524/100x90\"", "description" : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus laborum amet ut tenetur maiores aperiam quam quia corrupti, sit earum!", "price" : 20, "__v" : 6, "reviews" : [ ObjectId("608f9abfba9bbe17f0f2c28b"), ObjectId("608f9c96c243be1e78a36c49"), ObjectId("608f9d5ec243be1e78a36c4a") ] }

we can see that the reviews is just an obj ids so we can populate =>
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    console.log(campground);
    res.render('campgrounds/show', { campground });
}));

and when we look in the terminal we will see that now the reviews have been populated.

{
  reviews: [
    {
      _id: 608f9abfba9bbe17f0f2c28b,
      rating: 3,
      body: 'Hey there ',
      __v: 0
    },
    {
      _id: 608f9c96c243be1e78a36c49,
      rating: 3,
      body: 'Full stack',
      __v: 0
    },
    {
      _id: 608f9d5ec243be1e78a36c4a,
      body: 'Witch camp',
      rating: 1,
      __v: 0
    }
  ],
  _id: 608e31365f068d64cfc904f3,
  location: 'Orland Park, Illinois',
  title: 'Bullfrog Backcountry',
  image: 'https://source.unsplash.com/collection/429524/100x90"',
  description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus laborum amet ut tenetur maiores aperiam quam quia corrupti, sit earum!',
  price: 20,
  __v: 6
};
we have successfully made a new review and displayed it 
to delate a review =>

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));


Now we need to find out how to delete a campground and it's associated reviews to do this we need to set up a middleware to delete the associated review on the campground model => 
[https://mongoosejs.com/docs/middleware.html]
thisCampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    };console.log("DELETED REVIEWS")
});


And now when you delete a specific campground, the middleware should remove it's all associated reviews


||EXPRESS ROUTER AND COOKIES||
- Express router basics 
- Understanding cookies 
- HMAC signing 
- Signed cookies and 
- Cookie parser

Express router is a way of breaking up our routes into separate files and grouping them together
it's a way of organizing and structuring a complicated App


|COOKIES|
COOKIES are bits of information that are stored in a user's browser when browsing a particular website 
for a example  Session management
Logins, shopping carts, game scores, or anything else the server should remember
Personalization
User preferences, themes, and other settings
Tracking
Recording and analyzing user behavior

[https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies]
[https://expressjs.com/en/resources/middleware/cookie-parser.html]
[https://www.npmjs.com/package/cookie-parser]
[https://www.freeformatter.com/hmac-generator.html]
[https://en.wikipedia.org/wiki/HMAC

|SESSION AND FLASH|
- Conceptual overview of session 
- Setting up express session
- Integrating flash messages 
[https://www.npmjs.com/package/express-session]
Cookies store data, but it's not practical to store a lot of information client-side using cookies . This is where session comes in 
Sessions are server side data store that we use to make  HTTP statefulness  
instead of storing the data using cookies, we store the server-side data using session and then side the browser a cookie that can be used to retrieve the data
(session stores the data on the server side not in the browser like cookies)
because cookies have a  max size


to implement session, we just have to install it, npm i express-session
[https://www.npmjs.com/package/express-session]

Express session is made to work with express

we require and use it as a middleware 

app.use(session({secret:'Thisisabadsecrete'}));
 Now we can use session on the app :
 Inside every route or middleware on the req obj, we will now have a session property available
 
 app.get('/viewCount',)(req, res)=>{
     res.send("You have viewed this page x times")
 });

 and when you visit the route /viewCount and checks the cookie, you will see that there is a cookie made  with name connect.sid:
 thats the name for express session :

 app.get('/viewcount',(req, res)=>{
    if(req.session.count){
        req.session.count+=1;//if the session already exist, we add one to it and
    }else{
        req.session.count=1;//if it does not exit, we make it work
    }
    res.send(`You have viewed this page ${req.session.count} times`);
});

and anytime you view the page, req.session will keep track of the number of times you have viewed the page on that particular browser, unless req is made in a different browser, and the count will start off from one.

Another demo: 
app.get('/register',(req, res)=>{
    const {username = 'Anonymous'.toUpperCase()} = req.query;
    req.session.username = username;
    res.redirect('/greet')
})
app.get('/greet',(req, res)=>{
    const {username} = req.session;
    res.send(`WELCOME BACK ${username}`)
})

we stored the username under req.session, so when you visit /register and pass in the query string , you should see Welcome Back with the username, default is anonymous
Req.session will contain session information that is ongoing in a specific browser

|FLASH|
The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
[https://www.npmjs.com/package/connect-flash]
Sample of teh messages we flash, includes, failure messages, success messages that shows up one time and goes off when the page is refreshed. 

we can use this tool by installing and requiring it 
it does depend on session so we make sure express session is required as well 

npm i connect-flash
const flash = require('connect-flash');

and then after we use teh session :

const sessionOptions = {secret:'This is not a good secret!',resave:false,saveUninitialized:false}
app.use(session(sessionOptions))
app.use(flash());

Now in all the routes, the req obj has a method called flash 
for example on this post route :

app.post('/farms', async (req,res)=>{
 const farm = new Farm(req.body)
 await farm.save()
res.redirect('/farms');
});

we are creating a new farm, so after saving the farm.save(); we can flash a message, that will show up one time and goes off, like success or failure =>

app.post('/farms', async (req,res)=>{
 const farm = new Farm(req.body)
 await farm.save()
 req.flash("success","You have successfully created a new farm")
res.redirect('/farms');
});

It is not going to be available right away since we just added information to the session, so in the /farms route, we can access the messages by :
app.get('/farms', async (_req, res) => {
    const farms = await Farm.find({})
    res.render('farms/index',{farms,messages:req.flash("success")})
});
Now if there is anything success under req.flash , we pass that to the messages

Now we can access messages in our template 

We can improve the way we are passing messages through the template, we can set up a messages that wil be available on every single req, instead of having to do it manually on every single route :

app.use(function (req, res, next) {
  res.locals.messages = req.flash(success)
  res.locals.messages = req.flash.(danger)
  res.locals.messages = req.flash.(info)
  next()
});
so you can add in multiple messages , like errors also under the same middleware and just flash that in the route, here we have res.locals.messages which is stored under messages so we can define another for errors =>

app.use(function (req, res, next) {
  res.locals.messages = req.flash(success)
  res.locals.messages = req.flash.(danger)
  res.locals.messages = req.flash.(info)
  next()
});

And then we can access and flash these in our routes : just like first after a verb is executed


||AUTHENTICATION||
How to implement user login, how to associate users with posts and reviews 
- Authentication Vs Authorization
- How To not(store) password
- Understanding hashing functions 
- Password salts 
- Working with bcrypt
- AthDemo

Authentication is the process verifying who a particular user is 
(We typically authenticate with username and password combo) but there are other methods like security questions, facial recognitions 

And Authorization is verifying what a specific user has access to.
We authorize after a user has been authenticated 


"NOW THAT WE KNOW WHO YOU ARE, THIS IS WHAT YOU HAVE ACCESS AND DOES NOT HAVE ACCESS TO"

|How to (not) store passwords|
RULE #1 - Never store passwords as it is(there is a couple of reasons for this, because when a hacker gains access  to the database, it can easily see the information)

Rather than storing the password  directly into the database, we run the password  through a hashing function first and store the result in the database 

HASHING FUNCTIONS are functions that map input data of some arbitrary size to a fixed size of output value

For a example: when a user enters a password like :
user:{
    username:'EVANS',
    password:'QWERTY12'
};
Before we store this password in the database we first run it through a hashing function that will output to a fixed size of value :
This password can give us :qdgcdjslhkjgdldjblfbhfguv123jkdfjdgblkjghcxzvfd4 after it is hashed and this is what will be stored in the database so we haver have to store teh original value 
 You can also define CRYPTOGRAPHIC HASHING FUNCTIONS  as a - one way function which is infeasible  to revert (because once you get this output: qdgcdjslhkjgdldjblfbhfguv123jkdfjdgblkjghcxzvfd4, you cannot revert it to the original value)
                                            - Small change in the input value yields a large change in the output value  
                                            -  Deterministic, same input value yields same output value
                                            -  Unlikely to find two outputs with the same value 
                                            -  Are deliberately slow
[https://en.wikipedia.org/wiki/Cryptographic_hash_function]
Hash maps in computer science has something to do with hash functions
Not  every hashing function is appropriate, for storing passwords some hashing functions will hash in order from 00,01,02 so a user can easily guess which can cause a disaster 

|PASSWORD SALTS|
It is an extra safeguard 
Because when we use a hash function to hash the password, using bcrypt and a hacker gains access to the database, they can steal the common passwords that most people use and run it through a hashing function to get the same output value like the one stored in the database and compare to see the actual password
SO the idea of SALT is like adding an extra value(random) to the password before we hash it or after, we add extra value to it to store in the database

It helps to ensure unique hashing and mitigate common attacks

ilovedogs => +salt(ilovedogswackie) => hashed (qdgcdjslhkjgdldjblfbhfguv123jkdfjdgblkjghcxzvfd4trtrtdfgd)

BCRYPT is the password hashing function that we will use 
[https://github.com/kelektiv/node.bcrypt.js]
[https://www.npmjs.com/package/bcrypt]
Before we use we install and require it :

const bcrypt = require('bcrypt')
then we can specify how the length of our salt should be

To generate : 
const hashPassword = async () => {
  const salt = await bcrypt.genSalt(10)
  console.log(salt)
}

hashPassword();

OUTPUT:
$2b$10$ZjDJ3dS4fRfHzPbX9JrBHe

And then to  hash the salt with the password :
const hashPassword = async (pw) =>{
    const salt = await bcrypt.genSalt(10)//we generate a SALT 
     const hash= await bcrypt.hash(pw,salt)//And then we hash the pw with the SALT 
     console.log(salt)//LOGGING THE SALT  WE GENERATED
     console.log(hash)//LOGGING THE HASHED PASSWORD
};

hashPassword("Ilovecowmilk");

=> 

which also returns:
$2b$10$eWy6i53J6Q07xn9MfiIVe \\This is the password (d("Ilovecowmilk");
$2b$10$eWy6i53J6Q07xn9MfiIVe.kEQfydnU/oi5Clc2TYqp5laXf0IaXhW \\and this is the salt added

NOTE : the longer the salt, the longer it takes to hash.
 there is also instances where you will not have to generate the salt, but just pass the number to the has as a second argument to the has function:

 const hashPassword = async (pw) =>{
    // const salt = await bcrypt.genSalt(10)//we generate a SALT 
     const hash= await bcrypt.hash(pw,12)//And then we hash the pw with the SALT 
    // console.log(salt)//LOGGING THE SALT  WE GENERATED
     console.log(hash)//LOGGING THE HASHED PASSWORD
};

hashPassword("Ilovecowmilk");

OUTPUT => 
const hashPassword = async (pw) =>{
    // const salt = await bcrypt.genSalt(10)//we generate a SALT 
     const hash= await bcrypt.hash(pw,12)//And then we hash the pw with the SALT 
    // console.log(salt)//LOGGING THE SALT  WE GENERATED
     console.log(hash)//LOGGING THE HASHED PASSWORD
		
};

const login = async (pw,hashedPw) =>{
const result = await bcrypt.compare(pw,hashedPw)
if(result){
    console.log('LOGGED IN SUCCESSFULLY MATCH')
}else{
    console.log('SORRY TRY AGAIN')
}
}
login("Ilovecowmilk","$2b$12$8PAm3zhUg2k.5f4RFwd8Iu658SA9LqsEjr/G0VQAW2Fr..vSdbqVq");

OUTPUT: 
SUCCESSFUL MATCH!! YOU ARE IN

To verify this you can change the password to be something else and compare to check

login("Ilovecowmilk1","$2b$12$8PAm3zhUg2k.5f4RFwd8Iu658SA9LqsEjr/G0VQAW2Fr..vSdbqVq")

OUTPUT:
SORRY TRY AGAIN

And when you change iit back again :
login("Ilovecowmilk","$2b$12$8PAm3zhUg2k.5f4RFwd8Iu658SA9LqsEjr/G0VQAW2Fr..vSdbqVq");

OUTPUT: 
LOGGED IN SUCCESSFULLY MATCH


Now that we know how to set up the basic auth, there is a tool we can use to authenticate called PASSPORT
The good thing about this tool is that it's also comes with a bunch of different strategies like social media authentications
[http://www.passportjs.org/] 
npm i passport passport-local passport-local-mongoose \\this installs the tools that we will need, we can also add on twitter and facebook strategies
[https://www.npmjs.com/package/passport-local-mongoose]

we make the user model :

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);//this information will be added on to the schema oce we plugged in

module.exports = mongoose.model('User', UserSchema);


On on the index file we can require it and create a new user => 

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'jw@gmail.com', username: 'Bankboy11' });
    const newUser = await User.register(user, 'meme1001');
    res.send(newUser);
});

Now when you visit this route /fakeUser 

OUTPUT:

{
_id: "60934b46d7e93c3b5d73dc29",
email: "jw@gmail.com",
username: "Bankboy11",
salt: "cd64e830c637e480def8922505d181cacdcad9da857ffd114907cf4fa32b2c38",
hash: "92b26bee569ffb0e5eda942f3c3472e4cfdaa1a2b2de48f378ad2efb8593454520cfd250f6b8926a3c639e084298d548b6a5c4d88a1442157c03356de4b0f3ff7bf8f952f40bb163c8f119e4794c8842a2e578b35157cff021569236d8498583e50dadec35e75148764dcb09ddfe5bfc411cfd1971f132431726075860c26b16679a3309d5ab8a06cdb5465801ca6bede112e045a41236317011fbb59bc69cea1d6a6f453bfa36bcf45193e5a6164fdfb613ddc7cc8696e5a5e00fc17056063cb44e6f8c36355f362b9234f96e319a07f95ff596c20d328157e65557ed41bfa80fbe3aedaadb32ad3dd1b34af984c31e70b7d8a6e83a816e9b5c753f167f7dfcd02be186881afa5448df7ffda78d5a2e0364bd31898a63ae781a0036f23eb6ccba67e5e5dd6e7c17b3b62f5287d89eb8f62759f3e52290fc11997fcade67cb0e43a278aba7432169c9c3464f4ce9901906a3e5a88f019cc27b06b646bfa1915f04fa365d83cce151919374511fdf0f9a5cfc1e445ca7a79929e91e009fae44a1988e790ab8a6239989fdc36e5012cdedb4f76ddbde4e1644181d8c1a3b10ccedd4e4ed722a87d29579804a83fc8b718cadb20f5a904cb4bd8824fcd84d8559a95c700275e699cca9cee6f667408cfb6dc8981fefc14963af002b2ff6450955e6bc068885b7966a737def471b40dc214b5708c406a4ebba1a5b363840953af11d",
__v: 0,
}

This hash does not use bcrypt, passport uses other hash algorithms tool

We can protect a specific route for a user to be authenticated  before gaining access and passport comes with a method we can use, which is called

req.isAuthenticated()

we make a new file called middleware and add the logic

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

then we can require this on the routes and use it on any route we want to protect


|IMAGE UPLOAD|
To upload images, we have to know that the normal HTML forms cannot upload images to the server, so we need to change the forms,we also need to store the images somewhere  as we cannot store images in mongo as images are very large, GRIDFS helps us to store large files but we ain't gonna use that, we can use a tool called Cloudinary[https://docs.mongodb.com/manual/core/gridfs/], we need to store the images somewhere and store the url of the images in mongo 

Cloudinary stores information that we can retrieve and modify 

First with the regular html forms, we have to change the encoding type 

[enctype="multipart/form-data]
Then we can add the input for the file to be uploaded, 

and inside the route where we are creating anew campground, we can upload  images, to  verify,

  .post((req, res)=> {
    res.send(req.body);
    })
And when image is uploaded, you will see : {}

Which means that in order to parse the data of an encoding type, we need to use another middleware, to parse teh form data 
There is a middleware that we can use called, MULTER, which helps us to parse the body of an enctype forms [https://github.com/expressjs/multer]
To use it we need to install it and  require it on teh file that we want to upload images:
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }) //This is the files path to upload the images to 

And inside the route to post, we can specify the number of files to be uploaded and adds in the field name,on the form we specified it to be image:

  .post(upload.single('image'),(req, res)=> {
    res.send(req.body,req.file);
    })

    And when a new image is uploaded:

{"fieldname":"image","originalname":"Screenshot 2021-03-08 at 2.54.58 PM.png","encoding":"7bit","mimetype":"image/png","destination":"uploads/","filename":"98f7d85a83218695b1abbeff2548ef46","path":"uploads/98f7d85a83218695b1abbeff2548ef46","size":1037528};


And you will see uploads folder being created where the new file is stored.

Here we uploaded a single file image, we can also specify it to be array of images, and teh form will expect multiple files to be uploaded under the key of image:
.post(upload.array('image'),(req, res)=> {
    res.send(req.body,req.file);
    })

And we can specify it to be multiple in teh form: 
     <div class="mb-3">
                <div class="form-file custom-file">
                    <input type="file" class="form-file-input" id="image" name="image" multiple>
                    <label class="form-file-label" for="image">
                        <span class="form-file-text custom-file-label">Choose image(s)...</span>
                        <span class="form-file-button">Browse</span>
                    </label>
                </div>
            </div>

Now we can upload multiple files from the form.


 .post(upload.array('image',3), (req, res) => {
        console.log(req.files);
    });

We specified the method to be an array and teh number of files to be uploaded.
CONSOLE:

[
  {
    fieldname: 'image',
    originalname: 'view.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: 'd9ffd8cface4290ab8f9407ba833be5a',
    path: 'uploads/d9ffd8cface4290ab8f9407ba833be5a',
    size: 591045
  },
  {
    fieldname: 'image',
    originalname: 'warren-wong-bh4LQHcOcxE-unsplash.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: '0c7f45332028b9f635200d9ff4e0d296',
    path: 'uploads/0c7f45332028b9f635200d9ff4e0d296',
    size: 2491411
  },
  {
    fieldname: 'image',
    originalname: 'wil-stewart-K_TbABnVzHo-unsplash.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: 'f834955486a05fd686fe730fb1a75ffb',
    path: 'uploads/f834955486a05fd686fe730fb1a75ffb',
    size: 2338084
  }
]

Now we need to take these images and store them in cloudinary [https://cloudinary.com/] we need to sign up for free account.

Since we don't want to be embedding secrete api keys and cc information directly in the application
we store this information in a file  that we do not include when we submit our code to github or production mode 
Is a file that will stay on our machine locally, and it is called .env [https://www.npmjs.com/package/dotenv]

We make the file .env and we can define key value pairs 

For example : SECRET = FFHFHFHF

and on top of tHE index.js we can specify:

if (process.env.NODE_ENV !== "production") { if we are still in development mode, we require the dotenv and call the config function
    require('dotenv').config();
};

And when you  console.log(process.env.SECRET) you should see the embedded secret in the console.

To configure the dotenv file to work with cloudinary we need to fill in with the information of our cloudinary account:

CLOUDINARY_CLOUD_NAME=evans646
CLOUDINARY_APIKEY=761987322274978
CLOUDINARY_SECRET=2SDtDwAypatVhoM5Bm__LVhq220

No in our app, we can now have access to all these details 

Now we need to take the files that multer is able to upload and save them to cloudinary and to do this, there is a tool  called multer-storage-cloudinary [https://www.npmjs.com/package/multer-storage-cloudinary] it works with cloudinary as a storage engine.

npm install multer-storage-cloudinary cloudinary, we require them and configure the storage engine to use the cloudinary storage information:

since multer is uploading to the local machine, after configuring we can pass the storage to multer to use the cloudinary storage instance.
And when an image is uploaded:
[
  {
    fieldname: 'image',
    originalname: 'wil-stewart-K_TbABnVzHo-unsplash.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    path: 'https://res.cloudinary.com/javnet646/image/upload/v1620901156/YelpCamp/wylsohqmtyzpsxbieykk.jpg',
    size: 2338084,
    filename: 'YelpCamp/wylsohqmtyzpsxbieykk'
  }

Cloudinary takes the image and stores it aS a url path, so when you click on the url you can see the image uploaded, and you can verify also from the cloudinary account to see the image being stored there. 


To store the uploaded links in mongo 

we want the path and the filename incase a user wants to delete a particular image, we will take that name file name and pass it to be deleted

cloudinary takes the image and gives us a url and filename also so we can update the model for images and add in the upload as a middleware to the post route:

.post(isLoggedIn, upload.array('image',3),validateCampground,catchAsync(campgrounds.createCampground));

And when we add multer upload to the route, It will 
now have access to req.files so we can set campground.images to be the file name and tha path that we mapped over,which is teh url to the image
And when you make a new campground:

{
  reviews: [],
  _id: 609e59dd6097606f5c61516d,
  title: 'hmm',
  location: 'bepo',
  price: 1234,
  description: 'rtrgf',
  images: [
    {
      _id: 609e59dd6097606f5c61516e,
      url: 'https://res.cloudinary.com/evans646/image/upload/v1620990408/YelpCamp/g8zplainklvazrovqzgm.jpg',
      filename: 'YelpCamp/g8zplainklvazrovqzgm'
    },
    {
      _id: 609e59dd6097606f5c61516f,
      url: 'https://res.cloudinary.com/evans646/image/upload/v1620990430/YelpCamp/s2xqewq9aadvg9twnkfe.jpg',
      filename: 'YelpCamp/s2xqewq9aadvg9twnkfe'
    }
  ],
  author: 60935089fee7fc43933986cf,
  __v: 0
}

You will see the images is in array, with the filename and the url

To display the images uploaded, we can loop over them on the show page

To show the chosen files names, when choosing images to be uploaded, we can use a tool called [https://www.npmjs.com/package/bs-custom-file-input]

[https://cloudinary.com/documentation/image_transformations]


|ADDING MAPS|
To display a map : [https://www.mapbox.com/]

There are a lot of tools out there, like google maps etc but MAP BOX allows you to do a lot of customizations 

To geo code our locations, we need to register for mapbox account and get teh token

And now when a user types in the current location, we can take the location and get the longitude and latitude for that
[https://github.com/mapbox/mapbox-sdk-js] - to install and use
[https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md]
[https://mongoosejs.com/docs/geojson.html]

|TO SHOW THE MAP||
[https://docs.mapbox.com/mapbox-gl-js/api/]

This is the lib that we sue to render the mapbox maps 

||ADDING CLUSTERS||
[https://docs.mapbox.com/mapbox-gl-js/example/cluster/]

[https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addcontrol]

||COMMON SECURITY||
Assuming we have our app and someone queries from the database to find users where username is greater than "" and apparently all users are going to be found because all the username are greater than empty string:

so to prevent this there is a tool call Express Mongoose Sanitize

which [sanitizes user-supplied data to prevent MongoDB Operator Injection.]

we just have to install and use it [https://www.npmjs.com/package/express-mongo-sanitize]

- CROSS SITE SCRIPTING

The ability to prevent ppl from injecting code directly from the form, 

[ODE_Env=production node index.js]

||SECURING WITH HELMET||
[https://helmetjs.github.io/]

It helps to restricts the location where we can fetch data from 


||DEPLOYING||
MNow the applications is ready to be released but we connect it to teh same database as we are in dev mode, in production we need a database that will run on the server becaus once the app is deployed it runs on a server somewhere

so we will use a tool to help us: [https://cloud.mongodb.com/v2/5f968f89b140560940dc3ed1#clusters]  by signing up to set up the production database

Once you are done creating the cluster, then navigate to DATABASE ACCESS to create a user, once you are done, we can now connect to the database

you can specify in the network section the ip address that we can connect the cluster from.

After navigate back to cluster and then connect cluster 

click on connect to your app and then there will a url which looks like this [mongodb+srv://user1:<password>@realmcluster.6ugws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority]

you can put this file in the .env file 
 and save it to a var, the password is the user password when creating a new user :

 DB_URL=mongodb+srv://user1:KnZrohUn9oT8mvGF@realmcluster.6ugws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

 And we should be able to access the db form the index file by : const dbUrl = process.env.DB_URL

 we saved it to a var so we can connect to the db using the var :

 const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

since we have no data in this database, all the campgrounds will go off and we can create a new user to verify that the db is set up correctly

and you can check the cluster - collections to verify the user created

 and if everything works well, we should be able to access process.env.DB_URL


||STORING SESSION||
configuring the app to store the information using mongo
by default express uses the local storage in memory which can prove disaster because it does not scale well so we will not use the express session in production env instead we will use mongo which is easy to configure, there is a tool that can help us do this called, connect-mongo [https://www.npmjs.com/package/connect-mongo];
we require it[]


|HEROKU SETUP|
Is one of the tools we can use to store and host our apps 
first we need to go to [https://signup.heroku.com/account] and sign up for  new accounts.

after that is done , we need to install the CLI 
That's how we are going to get our code from our machine to heroku [https://devcenter.heroku.com/categories/command-line]

brew tap heroku/brew && brew install heroku
after that is installed, we need to login to heroku from the command line using our login information by issuing the command:
heroku login and follow the command from the line

once you are logged in from the command line
it sets up the app now we are going to deploy the it.

||PUSHING TO HEROKU||
When we run the command heroku login it worked so now we are going to run, heroku create which makes a new app space for us on heroku 
 before you issue the command, you need to make sure that you are in the top level of your application where you see the index file and all the files 

heroku create:
https://morning-oasis-67101.herokuapp.com/ | https://git.heroku.com/morning-oasis-67101.git

which makes us a url, and you can even see if on your heroku account dashboard : https://dashboard.heroku.com/apps 

you will notice that a new app has been made for us.

so now we can use the atlas db from the process.env.DB_URL

which should match exactly the one we have on atlas

and we can make a new file .gitignore in the top level of the application sand put in this code : node_modules 
.env  \\basically telling the app to ignore the .env file ad the node_modules we don't want git to care about these files, we just want push the app to heroku 


now in the terminal, you can type : git remote -v

the first command we issue is: git add \\ to add the files 