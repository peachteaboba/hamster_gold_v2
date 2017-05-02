// app/routes.js

// First, require the controllers *************************************************************
var users = require('./controllers/users.js');
var moment = require('moment');



module.exports = function(app, passport) {





    // USER ROUTES ----------------------------------------------------------------------------
    app.get('/allUsers', function(req, res) {    // show all users (used for easy access to login page)
        users.index(req, res);
    });

    app.get('/lbUsers', function(req, res) {    // show 20 users (used for leaderboard)
        users.lb(req, res);
    });

    app.get('/user/:id', users.show); // SHOW ONE USER



    app.get('/user/:id/delete', function(req, res) {
        users.delete(req, res);
    });


    app.post('/editUser', function(req, res) {     // edit a user via admin console
        users.edit(req, res);
    });

    app.post('/addScore', function(req, res) {     // add score to user's gold total

        //console.log('IM IN THE ROUTE!!!!!'.green);
        //console.log(req.body);
        //console.log('IM IN THE ROUTE!!!!!'.green);
        users.addScore(req, res);
    });















	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', isLoggedInProfile, function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});



    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));




	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
            moment: moment });
	});




    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));



    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // =====================================
    // FACEBOOK ROUTES PLAY================================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebookPlay', passport.authenticate('facebook', { scope : 'email' }));




    // =====================================
    // TWITTER ROUTES PLAY=================================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitterPlay', passport.authenticate('twitter'));



// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });



};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


// route middleware to make sure
function isLoggedInProfile(req, res, next) {

    // if user is authenticated in the session, redirect them to the profile page
    if (req.isAuthenticated())
        res.redirect('/profile');

    // if they aren't, carry on and redirect them to the login page
    return next();
}


