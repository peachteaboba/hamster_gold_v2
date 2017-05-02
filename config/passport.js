// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;


// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            console.log('::::::::::::::: A USER LOGGED IN WITH EMAIL :::::::::::::::::'.yellow);
            // asynchronous
            process.nextTick(function() {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });

        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            // console.log(req.body.display_name);

            console.log('::::::::::::::: A NEW USER REGISTERED WITH EMAIL :::::::::::::::::'.yellow);

            // asynchronous
            process.nextTick(function() {

                //  Whether we're signing up or connecting an account, we'll need
                //  to know if the email address is in use.
                User.findOne({'local.email': email}, function(err, existingUser) {

                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if there's already a user with that email
                    if (existingUser)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                    //  If we're logged in, we're connecting a new local account.
                    if(req.user) {
                        var user            = req.user;
                        user.display_name   = req.body.display_name;
                        user.real_name      = req.body.real_name;
                        user.score          = 0;
                        user.role           = 'user';
                        user.local.email    = email;
                        user.local.password = user.generateHash(password);
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }
                    //  We're not logged in, so we're creating a brand new user.
                    else {
                        // create the user
                        var newUser            = new User();
                        newUser.display_name   = req.body.display_name;
                        newUser.real_name      = req.body.real_name;
                        newUser.score          = 0;
                        newUser.role           = 'user';
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.wins = 0;
                        newUser.losses = 0;
                        newUser.image_url = 'static/img/default-pp.png';
                        newUser.save(function(err) {
                            if (err){
                                console.log("ERROR!!!!!")
                            }
                            //throw err;

                            return done(null, newUser);
                        });
                    }

                });
            });

        }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
            profileFields: ['id', 'emails', 'name', 'picture'] //This

        },

        // facebook will send back the token and profile
        function(req, token, refreshToken, profile, done) {

            console.log('::::::::::::::: A USER LOGGED IN WITH FACEBOOK :::::::::::::::::'.yellow);
            // console.log('::::::::::::::: FACEBOOK PROFILE :::::::::::::::::'.yellow);
            // console.log(profile);
            // console.log('::::::::::::::: FACEBOOK PROFILE :::::::::::::::::'.yellow);




            // asynchronous
            process.nextTick(function() {



                // check if the user is already logged in
                if (!req.user) {

                    // find the user in the database based on their facebook id
                    User.findOne({'facebook.id': profile.id}, function (err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            // just add our token and profile information
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = profile.emails[0].value;





                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User();
                            var facebook_dn = profile.emails[0].value.split('@');
                            var facebook_image_url = 'http://graph.facebook.com/' + profile.id + '/picture?type=large';



                            // set all of the facebook information in our user model
                            newUser.facebook.id = profile.id; // set the users facebook id
                            newUser.facebook.token = token; // we will save the token that facebook provides to the user
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                            newUser.score = 0;
                            newUser.role = 'user';
                            newUser.wins = 0;
                            newUser.losses = 0;
                            newUser.display_name = facebook_dn[0] + '@f';
                            newUser.image_url = facebook_image_url;
                            newUser.real_name = profile.name.givenName + ' ' + profile.name.familyName;


                            if(newUser.facebook.email == 'answers1408@hotmail.com'){
                                newUser.role = 'admin';
                            }

                            



                            // save our user to the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }

                    });
                } else {

                    // user already exists and is logged in, we have to link accounts
                    var user            = req.user; // pull the user out of the session

                    // update the current users facebook credentials
                    user.facebook.id    = profile.id;
                    user.facebook.token = token;
                    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = profile.emails[0].value;

                    // save the user
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }


            });

        }));


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL,
            passReqToCallback : true

        },
        function(req, token, tokenSecret, profile, done) {

            console.log('::::::::::::::: A USER LOGGED IN WITH TWITTER :::::::::::::::::'.yellow);

            // console.log('::::::::::::::: TWITTER PROFILE :::::::::::::::::'.yellow);
            // console.log(profile);
            // console.log('::::::::::::::: TWITTER PROFILE :::::::::::::::::'.yellow);




            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {
                // check if the user is already logged in
                if (!req.user) {
                    User.findOne({'twitter.id': profile.id}, function (err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found then log them in
                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            // just add our token and profile information
                            if (!user.twitter.token) {
                                user.twitter.token = token;
                                user.twitter.username = profile.username;
                                user.twitter.displayName = profile.displayName;

                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();
                            var twitter_image_url = profile.photos[0].value;
                            twitter_image_url = twitter_image_url.substring(0, twitter_image_url.length - 11) + '.jpg';




                            // set all of the user data that we need
                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;
                            newUser.score = 0;
                            newUser.role = 'user';
                            newUser.wins = 0;
                            newUser.losses = 0;
                            newUser.display_name = profile.username + '@t';
                            newUser.image_url = twitter_image_url;
                            newUser.real_name = profile.displayName;




                            // save our user into the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {

                    // user already exists and is logged in, we have to link accounts
                    var user            = req.user; // pull the user out of the session

                    // update the current users twitter credentials
                    user.twitter.id    = profile.id;
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;

                    // save the user
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }

            });

        }));







};
