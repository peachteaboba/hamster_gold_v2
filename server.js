/**
 * Created by peachteaboba on 2/24/16.
 */
// server.js




// ===================================================================================================================
// get the packages we need ==========================================================================================
// ===================================================================================================================
var express  = require('express'); // require express so that we can build an express app
var app      = express(); // instantiate the express app
var port     = process.env.PORT || 8000;
var passport = require('passport');
var flash    = require('connect-flash');
var colors = require('colors');
var path = require('path');  // require path so that we can use path stuff like path.join




// ===================================================================================================================
// require the veccy.js game file ====================================================================================
// ===================================================================================================================
var veccy = require('./veccy');




// ===================================================================================================================
// database configuration ============================================================================================
// ===================================================================================================================
require('./config/database.js');




// ===================================================================================================================
// configuration =====================================================================================================
// ===================================================================================================================
require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'whoismrrobot' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// set up a static file server that points to the "client" directory
app.use(express.static(path.join(__dirname, './client')));






// ===================================================================================================================
// routes ============================================================================================================
// ===================================================================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport






// ===================================================================================================================
// launch ============================================================================================================
// ===================================================================================================================
// Create an http server with Node's HTTP module.
// Pass it the Express application, and listen on port 8080.
var server = require('http').createServer(app).listen(port);
console.log("Vegeta! Vegeta! What's wrong with you?! Tell me what his power level is! ".green);
console.log("It's over ".cyan + port + "!".cyan);
console.log("What?! ".green + port + "?! You've got to be kidding me, that thing's a piece of junk!".green);





// ===================================================================================================================
// sockets ===========================================================================================================
// ===================================================================================================================
// Instantiate Socket.IO hand have it listen on the Express/HTTP server
var io = require('socket.io').listen(server);
// Whenever a connection event happens (the connection event is built in) run the following code

io.sockets.on('connection', function (socket) {
    // RUN AS SOON AS SOCKET IS CONNECTED ----
    console.log("New client connected   ------>   Socket ID: ".yellow + socket.id);
    // ----------------------------------------
    // initialize a new game instance for this particular socket connection
    veccy.initGame(io, socket);

});




