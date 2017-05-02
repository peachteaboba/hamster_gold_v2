/**
 * Created by Andy Feng on 2/19/16.
 */

// this is our users.js file located at /server/controllers/users.js

// :::::::::::::   CONTROLLER   :::::::::::::::



var mongoose = require('mongoose');  // need to require mongoose to be able to run mongoose.model()

var User = mongoose.model('Users');  // access our model through var User



module.exports = (function() {
    return {

        index: function(req, res) {
            // var q = User.find({}).sort({'score': -1}).limit(20);
            var q = User.find({}).sort({'score': -1});
            q.exec(function(err, results) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('successfully retrieved all users (by "all" I mean ALL!)'.green);
                    res.json(results);  // ----------> Return all users in the callback as JSON data
                }
            })
        },
        lb: function(req, res) {
            var q = User.find({}, {
                display_name: 1,
                real_name: 1,
                image_url: 1,
                score: 1
            }).sort({'score': -1}).limit(10);
            //var q = User.find({}).sort({'score': -1});
            q.exec(function(err, results) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('successfully retrieved all users (by "all" I mean 10!)'.green);
                    res.json(results);  // ----------> Return all users in the callback as JSON data
                }
            })
        },

        show: function(req, res){
            User.findOne({_id: req.params.id}, function(err, results) {
                if(err) console.log(err);
                res.json(results);  // ----------> Return single user info in the callback as JSON data
            })
        },

        delete: function(req, res) {
            User.remove({_id: req.params.id}, function(err) {
                if (err) {
                    console.log('something with wrong -----> delete method in the Users Controller'.red);
                } else {
                    console.log('successfully deleted user'.green);
                    res.redirect('/allUsers');
                }
            })
        },

        edit: function(req, res) {
            User.findOne({_id: req.body._id}, function(err, results) {
                if(err) {
                    console.log('something with wrong -----> edit method in the Users Controller'.red);
                } else {
                    results.display_name = req.body.display_name;
                    results.real_name = req.body.real_name;
                    results.score = req.body.score;
                    results.wins = req.body.wins;
                    results.losses = req.body.losses;
                    results.role = req.body.role;

                    results.save(function(err) {
                        if(err) {
                            console.log('something with wrong -----> edit-save method in the Users Controller'.red);
                        } else {
                            console.log('successfully edited user'.green);
                            res.redirect('/allUsers');
                        }
                    });
                }
            });
        },

        addScore: function(req, res) {

            //console.log('IM IN THE CONTROLLER!!!!!'.yellow);
            //console.log(req.body);
            //console.log('IM IN THE CONTROLLER!!!!!'.yellow);






            User.findOne({_id: req.body.id}, function(err, results) {
                if(err) {
                    console.log('something with wrong -----> addScore method in the Users Controller'.red);
                } else {
                    results.score += req.body.winnings;
                    results.wins += req.body.wins;
                    results.losses += req.body.losses;

                    results.save(function(err) {
                        if(err) {
                            console.log('something with wrong -----> addScore method in the Users Controller'.red);
                        } else {
                            //console.log('successfully added score to user'.green);
                            res.redirect('/user/' + req.body.id);
                        }
                    });
                }
            });
        }























    }
})();













