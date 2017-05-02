/**
 * Created by anndyfeng1 on 2/24/16.
 */
var eccy_app = angular.module('eccy_app', ['angularMoment', 'ngRoute', 'ngSanitize']);


// PARTIAL ROUTES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
eccy_app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'static/partials/play.html'
        })
        .when('/play',{
            templateUrl: 'static/partials/play.html'
        })
        .when('/admin',{
            templateUrl: 'static/partials/admin.html'
        })
        .when('/admin/edit',{
            templateUrl: 'static/partials/adminEdit.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

eccy_app.filter('Find', function() {
    return function(input, str) {
        var tmp = {};
        angular.forEach(input, function(val, key) {
            if (val.name.indexOf(str) !== -1) {
                tmp[key] = val;
            }
        });
        return tmp;
    };
});





// UserFactory ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: UserFactory
eccy_app.factory('UserFactory', function($http) {
    var factory = {};
    var users = [];
    var lbUsers = [];
    var thisUser;

    factory.profileControllerInit = function(id, callback){
        $http.get('/user/' + id).success(function(output) {
            factory.this_user = output;
            thisUser = output;
            //console.log(factory.this_user);
            callback(output);
        })
    };


    factory.getOneUser = function(id, callback){
        $http.get('/user/' + id).then(callback);
    };



    factory.retrieveUser = function(callback){
        callback(thisUser);
    };




    factory.index = function(callback) {
        $http.get('/allUsers').success(function(output) {
            users = output;
            callback(users);
        })
    };

    factory.indexLB = function(callback) {
        $http.get('/lbUsers').success(function(output) {
            lbUsers = output;
            callback(lbUsers);
        })
    };



    factory.delete = function(id, callback) {
        $http.get('/user/' + id + '/delete').success(function(output) {
            users = output;
            callback(users);
        })
    };


    factory.edit = function(info, callback) {
        $http.post('/editUser', info).success(function(output) {
            users = output;
            callback(users);
        })
    };

    factory.addScore = function(info, callback) {
        $http.post('/addScore', info).success(function(output) {
            factory.this_user = output;
            callback(output);
        })
    };



    return factory;
});






// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController
// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController
// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController
eccy_app.controller('ProfileController', function($scope, UserFactory, $rootScope){
    //console.log('hello this is the profile controller, you are logged in with the user ID: ' + $scope.thisUserId);
    UserFactory.profileControllerInit($scope.thisUserId, function(response){
        $scope.userInfo = UserFactory.this_user;
        //console.log($scope.userInfo);
    });
    $rootScope.$on("CallParentMethod", function(){
        $scope.userInfo = UserFactory.this_user;
        $scope.parentMethod();
    });
});
// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController
// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController
// ProfileController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ProfileController



// LoginController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: LoginController
eccy_app.controller('LoginController', function($scope, UserFactory, $window) {
    console.log('hello this is the login controller');


    $scope.leaderboard = [];

    UserFactory.indexLB(function(data) {
        $scope.leaderboard = data;

        for(var i=0; i<$scope.leaderboard.length; i++ ){
            $scope.leaderboard[i].rank = i+1;
        }



        console.log($scope.leaderboard);



    });
    $scope.gitHub = function(){
        // MetricFactory.incGH(function(data) {
        //     $scope.metrics = data;
        // });
        $window.open('//github.com/peachteaboba');
    };









    $scope.updated = new Date().toLocaleString();










    $scope.users = [];
    $scope.findAllUsers = function(){
        //console.log('user prefers email ---> finding all users');
        UserFactory.index(function(data) {
            $scope.users = data;
        });
    };
    $scope.verifyDuplicate = function(InputName) {
        var nameList = [];
        $scope.dnUnique = 1;
        for (var i=0; i<$scope.users.length; i++){   // put all users names into an array
            if ($scope.users[i].display_name) {
                nameList.push($scope.users[i].display_name);
            }
        }
        for (var j=0; j<nameList.length; j++){    // check if the input name is already taken
            if(InputName == nameList[j]){
                $scope.dnUnique = 0;
                break;
            }
        }
    };
    $scope.verifyDuplicateEmail = function(InputEmail) {
        var emailList = [];
        $scope.emailUnique = 1;
        for (var i=0; i<$scope.users.length; i++){   // put all local emails into an array
            if($scope.users[i].local) {
                emailList.push($scope.users[i].local.email);
            }
        }
        for (var j=0; j<emailList.length; j++){    // check if the email is already taken
            if(InputEmail == emailList[j]){
                $scope.emailUnique = 0;
                break;
            }
        }
    };
});

// AdminController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: AdminController
eccy_app.controller('AdminController', function($scope, UserFactory, $location){
    //console.log('hello this is the admin controller ########');
    //console.log('hello this is the admin controller');
    $scope.users = [];
    $scope.edit = {};
    $scope.editShow = 0;
    //console.log($scope.player);
    $scope.player = UserFactory.this_user;
    //console.log($scope.player);

    if(!$scope.player){
        UserFactory.retrieveUser(function(response){
            $scope.player = response;
        });
        //console.log($scope.player);
    }
    if($scope.player){
        if($scope.player.role == 'admin') {
            UserFactory.index(function (data) {
                $scope.users = data;
            });
        } else {
            console.log('y u no admin?');
            $location.path('/');
        }
    }
    $scope.removeUser = function (id){
        UserFactory.delete(id, function(data) {
            $scope.users = data;
        })
    };
    $scope.editUser = function (id){
        UserFactory.getOneUser(id, function(output){
            $scope.edit = output.data;
            console.log($scope.edit);
            $scope.editShow = 1;
        });
    };
    $scope.editCancel = function () {
        $scope.editShow = 0;
        //console.log( $scope.editShow);
    };
    $scope.editSubmit = function (input){
        //console.log(input);
        UserFactory.edit(input, function(data) {
            $scope.users = data;
            $scope.editShow = 0;
        })
    };
});



// GameController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GameController
// GameController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GameController
// GameController ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GameController
eccy_app.controller('GameController', function($scope, UserFactory, $sanitize, $document, $rootScope){
    $('#play-wrapper-bg').hide();
    $('#stats-wrapper-bg').hide();
    $('#data').focus();

    var world;
    var currentGameRoom = '';
    var gameVars = {};
    var moveData = {};

    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------
    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------
    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------
    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------


        var IO = {

            /**
             * This is called when the page is displayed. It connects the Socket.IO client
             * to the Socket.IO server
             */
            beforeInit: function(){
                //console.log('hello this is the game controller ---> before init function');
                $scope.player = UserFactory.this_user;
                $scope.userStats = {};
                $scope.showRooms = {};


                //console.log('leadeboard!!! -----------> start');
                $scope.leaderboard = [];
                //console.log($scope.thisUserId);
                UserFactory.indexLB(function(data) {
                    $scope.leaderboard = data;
                    $scope.one = $scope.leaderboard[0];
                    $scope.two = $scope.leaderboard[1];
                    $scope.three = $scope.leaderboard[2];
                    $scope.leaderboard.shift();
                    $scope.leaderboard.shift();
                    $scope.leaderboard.shift();
                    for(var i=0; i<$scope.leaderboard.length; i++ ){
                        $scope.leaderboard[i].rank = i+4;
                    }


                    //
                    //console.log($scope.one);
                    //console.log($scope.two);
                    //console.log($scope.three);
                    //console.log($scope.leaderboard);
                    //
                    //

                });


                //console.log('leadeboard!!! ------------>  end');



















                setTimeout(IO.init, 500);
            },

            init: function() {
                //console.log('hello this is the game controller ---> init function');

                IO.socket = io.connect();
                IO.bindEvents();
                return false;
            },

            /**
             * While connected, Socket.IO will listen to the following events emitted
             * by the Socket.IO server, then run the appropriate function.
             */
            bindEvents : function() {
                IO.socket.on('connected', IO.onConnected );
                IO.socket.on('updateChat', IO.onUpdateChat );
                IO.socket.on('updateUsers', IO.onUpdateUsers );
                IO.socket.on('updateRooms', IO.onUpdateRooms );
                IO.socket.on('newGameCreated', IO.onNewGameCreated );
                IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom );
                IO.socket.on('playerLeftRoom', IO.playerLeftRoom );
                IO.socket.on('gameInfo', IO.gameInfo );
                //IO.socket.on('beginNewGame', IO.beginNewGame );
                //IO.socket.on('newWordData', IO.onNewWordData);
                //IO.socket.on('hostCheckAnswer', IO.hostCheckAnswer);
                //IO.socket.on('gameOver', IO.gameOver);
                //IO.socket.on('error', IO.error );

                IO.socket.on('hostLeftRoom', IO.hostLeftRoom );


                // GAME EVENTS
                IO.socket.on('generateContent', IO.generateContent );
                IO.socket.on('readyCheck', IO.readyCheck );
                IO.socket.on('playerMoved', IO.playerMoved );


                return false;
            },


            onConnected : function(data) {
                // Call the server-side function 'addUser' and send one parameter (player object)
                if(!$scope.player){
                    UserFactory.retrieveUser(function(response){
                        $scope.player = response;
                    });
                }
                if ($scope.player) {
                    IO.socket.emit('addUser', $scope.player);
                    console.log(data.message);
                }
            },


            onUpdateChat : function(server, data, username) {
                if(server == 'SERVER1'){
                    if(username) {
                        $('#conversation').before('<b>'+ username + ' </b><p class="server1">' + data + '</p><br>');
                    }
                    else{
                        $('#conversation').before('<p class="server1">' + data + '</p><br>');
                    }
                }
                else if(server == 'SERVER2'){
                    if(username) {
                        $('#conversation').before('<b>'+ username + ' </b><p class="server2">' + data + '</p><br>');
                    }
                    else{
                        $('#conversation').before('<p class="server2">' + data + '</p><br>');
                    }
                }
                else if(server == 'SERVER3'){
                    if(username) {
                        $('#conversation').before('<b>'+ username + ' </b><p class="server3">' + data + '</p><br>');
                    }
                    else{
                        $('#conversation').before('<p class="server2">' + data + '</p><br>');
                    }
                }
                else if (server == 'CHAT'){
                    $('#conversation').before('<b>' + username + ':</b> ' + data + '<br>');
                }
                $('.conversation-wrapper').scrollTop($('.conversation-wrapper')[0].scrollHeight);
            },


            // UPDATE USERS -------------------------------------------------------------------------------------------
            onUpdateUsers : function(userNames) {
                $('#user').html('<div class="user-count">Users Online: ' +  Object.keys(userNames).length + '</div>');
                $.each(userNames, function (key, value) {
                    if (value != $scope.player.display_name) {
                        $('#user').append('<div class="other-username"><button id=' + 'stats' + key + '>' + value + '</button></div>');
                    } else {
                        $('#user').append('<div class="my-username"><button id=' + 'stats' + key + '>' + value + '</button></div>');
                    }
                    $(document).off("click", "#stats" + key).on("click", "#stats" + key, function () {
                        UserFactory.getOneUser(key, function(response){
                            $scope.userStats = response.data;
                        });
                        $('#stats-wrapper-bg').show();
                        disableScroll();
                    });
                });
            },
            // END UPDATE USERS ---------------------------------------------------------------------------------------



            /**
             * A new game has been created and a random game ID has been generated.
             * @param data {{ gameId: int, mySocketId: * }}
             */
            onNewGameCreated : function(data) {


                App.Host.gameInit(data);
                return false;
            },

            /**
             * A player has successfully joined the game.
             * @param data {{playerName: string, gameId: int, mySocketId: int}}
             */
            playerJoinedRoom : function(data) {

                if (App.myRole == 'Host') {
                    App.Host.updateWaitingScreen(data);
                }

            },
            playerLeftRoom : function(data) {
                //console.log('playerLeftRoom' + data);


                if (App.myRole == 'Host') {
                    App.Host.updateWaitingScreen(data);
                }
            },


            gameInfo : function(data) {
                if (App.myRole == 'Player') {
                    App.Player.updateWaitingScreen(data);
                }
            },

            hostLeftRoom : function(data) {
                if (App.myRole == 'Player') {
                    App.Player.exitGame(data);
                }
            },



            // GAME FUNCTIONS -----------------------------------------------------------------------------------------
            // GAME FUNCTIONS -----------------------------------------------------------------------------------------
            // GAME FUNCTIONS -----------------------------------------------------------------------------------------

            // Generate game content for both players (only happens once)
            generateContent : function(data) {
                //console.log('generating game content');
                //console.log(data);



                // initialize game variables :::::::::::::::::::::::::::::::::
                gameVars = {};
                resetGameVars();
                //console.log('gameVars reset');
                gameVars.p1_id = data.hostPlayerArray[0]._id;
                gameVars.p2_id = data.hostPlayerArray[1]._id;

                //console.log(gameVars.p1_id);
                //console.log(gameVars.p2_id);




                $scope.gPlayerArray = [];
                $scope.gameOn = 0;
                $scope.gRole = 0;
                $scope.ready11 = 0;
                $scope.ready22 = 0;
                $scope.gameStart = 0;
                $scope.winner = 0;
                // display world
                world = gameVars.world;
                displayWorld();
                // display player scores


                $scope.gPlayerArray = data.hostPlayerArray;
                $scope.gameOn = 1;
                $scope.p1_score = gameVars.p1_score;
                $scope.p2_score = gameVars.p2_score;
                if($scope.player._id == data.hostPlayerArray[0]._id){
                    $scope.gRole = 1;
                } else if($scope.player._id == data.hostPlayerArray[1]._id){
                    $scope.gRole = 2;
                } else {
                    $scope.gRole = 0;
                }


                $scope.$apply();
            },



            readyCheck : function(readyData) {
                var tellTheServer = {};

                // i am player 1
                // player 2 says they ready
                // i need to tell my server socket session that
                if ($scope.gRole == 1 && readyData.p2_ready == 1 && readyData.p1_ready == 0){
                    tellTheServer.myGameRole = $scope.gRole;
                    tellTheServer.currentGameRoom = currentGameRoom;
                    IO.socket.emit('otherPlayerReady', tellTheServer);
                } else if ($scope.gRole == 2 && readyData.p1_ready == 1 && readyData.p2_ready == 0){
                    tellTheServer.myGameRole = $scope.gRole;
                    tellTheServer.currentGameRoom = currentGameRoom;
                    IO.socket.emit('otherPlayerReady', tellTheServer);
                }




                if (readyData.p1_ready == 1 && $scope.ready11 == 0) {
                   $scope.ready11 = 1;
                }
                if (readyData.p2_ready == 1 && $scope.ready22 == 0) {
                    $scope.ready22 = 1;
                }
                if ($scope.ready11 == 1 && $scope.ready22 == 1){
                    $scope.gameStart = 1;
                    $document.bind('keydown', function (e) {
                        move(e.keyCode);
                    });
                }
                $scope.$apply();
            },



            playerMoved: function(data){
                if (data.e == 39 || data.e == 68) {
                    moveRight(data);
                }
                if (data.e == 37 || data.e == 65) {
                    moveLeft(data);
                }
                if (data.e == 38 || data.e == 87) {
                    moveUp(data);
                }
                if (data.e == 40 || data.e == 83) {
                    moveDown(data);
                }
            },







































            //
            //
            //moved : function(data) {
            //    //console.log(data);
            //
            //
            //    if($scope.player._id != data.playerId){ // the other player just made a move
            //        // i need to change my server side socket session variables accordingly
            //        IO.socket.emit('otherPlayerMoved', data, currentGameRoom);
            //    }
            //
            //
            //    // display world
            //    world = data.world;
            //    displayWorld();
            //
            //    // update player scores
            //    $scope.p1_score = data.p1_score;
            //    $scope.p2_score = data.p2_score;
            //
            //
            //
            //
            //    // winner winner chicken dinner!
            //    $scope.winner = data.winner;
            //
            //
            //
            //    if (data.winner != 0){ // we have a winner
            //
            //        //console.log('we have a winner');
            //
            //        $document.unbind('keydown');
            //        var dataSave = {};
            //        dataSave.id = $scope.player._id;
            //
            //        if (data.winner == 1){
            //            $scope.p1_winnings = $scope.p1_score * 2;
            //            $scope.p2_winnings = $scope.p2_score;
            //        } else if (data.winner == 2){
            //            $scope.p1_winnings = $scope.p1_score;
            //            $scope.p2_winnings = $scope.p2_score * 2;
            //        }
            //
            //
            //        if ($scope.gRole == 11){
            //            dataSave.winnings = $scope.p1_winnings;
            //            if(data.winner == 1){
            //                dataSave.wins = 1;
            //                dataSave.losses = 0;
            //            } else {
            //                dataSave.wins = 0;
            //                dataSave.losses = 1;
            //            }
            //
            //            //console.log(dataSave);
            //
            //
            //            UserFactory.addScore(dataSave, function(dataBack) {
            //                //console.log('player data updated');
            //                //console.log(dataBack);
            //                $rootScope.$emit("CallParentMethod", {});
            //                //$scope.$parent.parentMethod();
            //                //console.log(UserFactory.this_user);
            //
            //
            //            })
            //        } else if ($scope.gRole == 22){
            //            dataSave.winnings = $scope.p2_winnings;
            //            if(data.winner == 2){
            //                dataSave.wins = 1;
            //                dataSave.losses = 0;
            //            } else {
            //                dataSave.wins = 0;
            //                dataSave.losses = 1;
            //            }
            //
            //            //console.log(dataSave);
            //
            //
            //            UserFactory.addScore(dataSave, function(dataBack) {
            //                //console.log('player data updated');
            //                //console.log(dataBack);
            //                $rootScope.$emit("CallParentMethod", {});
            //                //$scope.$parent.parentMethod();
            //                //console.log(UserFactory.this_user);
            //
            //
            //
            //            })
            //        }
            //    }
            //
            //
            //
            //
            //    $scope.$apply();
            //},
            //
            //





























            // listener, whenever the server emits 'updaterooms', this updates the room the client is in


            onUpdateRooms : function(rooms, current_room) {
                $scope.currentRoom = current_room;
                $scope.showRooms = rooms;
                $scope.$apply();
                //console.log($scope.showRooms);


                $.each(rooms, function (key, value) {
                    if (key != current_room) {

                        $(document).off("click", "#" + key).on("click", "#" + key, function roomClick() {
                            var gameID = document.getElementById("game-id");
                            currentGameRoom = key;
                            App.myRole = 'Player';
                            // collect data to send to the server
                            var data = {
                                gameId : key,
                                playerInfo : $scope.player || 'anon'
                            };
                            $('#play-wrapper-bg').show();
                            $('#exit-wrapper-bg').hide();
                            disableScroll();
                            //$('#game-id').append("Game ID: <span>" + value + '</span>');
                            gameID.innerHTML ="Room Host: <span>" + value.name + "</span>";
                            // Send the gameId and playerName to the server
                            IO.socket.emit('playerJoinGame', data);
                            return false;
                        });

                    }


                }); // end .each
            } // end onUpdateRooms




        };

        var App = {

            /**
             * Keep track of the gameId, which is identical to the ID
             * of the Socket.IO Room used for the players and host to communicate
             *
             */
            gameId: 0,

            /**
             * This is used to differentiate between 'Host' and 'Player' browsers.
             */
            myRole: '',   // 'Player' or 'Host'

            /**
             * The Socket.IO socket object identifier. This is unique for
             * each player and host. It is generated when the browser initially
             * connects to the server when the page loads for the first time.
             */
            mySocketId: '',

            /**
             * Identifies the current round. Starts at 0 because it corresponds
             * to the array of word data stored on the server.
             */
            currentRound: 0,

            /* *************************************
             *                Setup                *
             * *********************************** */
            //
            ///**
            // * This runs when the page initially loads.
            // */
            //init: function () {
            //    App.cacheElements();
            //    //App.showInitScreen();
            //    //App.bindEvents();
            //
            //    return false;
            //},
            //
            ///**
            // * Create references to on-screen elements used throughout the game.
            // */
            //cacheElements: function () {
            //    App.$doc = $(document);
            ////
            ////    // Templates
            ////    //App.$gameArea = $('#gameArea');
            ////    //App.$templateIntroScreen = $('#intro-screen-template').html();
            ////    //App.$templateNewGame = $('#create-game-template').html();
            ////    App.$templateJoinGame = $('#join-game-template').html();
            ////    App.$hostGame = $('#host-game-template').html();
            //    return false;
            //},

            /**
             * Create some click handlers for the various buttons that appear on-screen.
             */
            //bindEvents: function () {
            //    // Host
            //    App.$doc.on('click', '#btnCreateGame', App.Host.onCreateClick);
            //
            //    // Player
            //    App.$doc.on('click', '#btnJoinGame', App.Player.onJoinClick);
            //    //App.$doc.on('click', '#btnStart',App.Player.onPlayerStartClick);
            //    //App.$doc.on('click', '.btnAnswer',App.Player.onPlayerAnswerClick);
            //    //App.$doc.on('click', '#btnPlayerRestart', App.Player.onPlayerRestart);
            //},
            //










            /* *******************************
             *         HOST CODE           *
             ******************************* */
            Host : {

                /**
                 * Contains references to player data
                 */
                players: [],

                /**
                 * Flag to indicate if a new game is starting.
                 * This is used after the first game ends, and players initiate a new game
                 * without refreshing the browser windows.
                 */
                isNewGame: false,

                /**
                 * Keep track of the number of players that have joined the game.
                 */
                numPlayersInRoom: 0,


                /**
                 * The Host screen is displayed for the first time.
                 * @param data{{ gameId: int, mySocketId: * }}
                 */
                gameInit: function (data) {
                    currentGameRoom = data.gameId;
                    App.Host.players = [];
                    App.myRole = 'Host';
                    App.Host.numPlayersInRoom = 0;

                    // Fill the game screen with the appropriate HTML
                    $('#play-wrapper-bg').show();
                    $('#exit-wrapper-bg').hide();
                    $('#game-id').html("Room Host: <span>" + data.roomID + '</span>');

                    disableScroll();

                    // host will automatically join their own game upon gameInit
                    App.Host.players.push($scope.player);
                    App.Host.numPlayersInRoom += 1;

                    var playerCount = document.getElementById("player-count");
                    var player1 = document.getElementById("player1");
                    var player2 = document.getElementById("player2");


                    playerCount.innerHTML = 'player count: ' + App.Host.numPlayersInRoom;
                    for (var i=0; i<App.Host.players.length; i++){
                        playerCount.innerHTML = playerCount.innerHTML + ' (' + App.Host.players[i].display_name + ')';
                    }


                    player1.innerHTML = '<p class="player-tag">player 1</p> <h1>' + App.Host.players[0].display_name + '</h1>';
                    player2.innerHTML = 'waiting for player 2..';

                    return false;
                },

                /**
                 * Update the Host screen when the first player joins
                 * @param data{{playerName: string}}
                 */
                updateWaitingScreen: function(data) {
                    var dataSave = {};
                    dataSave.gameId = data.gameId;

                    var player2 = document.getElementById("player2");
                    var playerCount = document.getElementById("player-count");



                    if(data.status == 'enter') {

                        $('#playersWaiting')
                            .append('<p/>')
                            .text('Player ' + data.playerInfo.display_name + ' joined the game.');

                        // Store the new player's data on the Host.
                        App.Host.players.push(data.playerInfo);

                        // Increment the number of players in the room
                        App.Host.numPlayersInRoom += 1;

                        dataSave.hostPlayerArray = App.Host.players;

                        if (App.Host.players.length == 2) {
                            player2.innerHTML = '<h1>' + data.playerInfo.display_name + '</h1><p class="player-tag2">player 2</p>';

                            // send data to the server to change room status to 'full' ::::::::::::::::::::::::::::::
                            IO.socket.emit('roomFull', dataSave);




                            // Room is full ----> time to initiate the game.
                            // Game sockets should work the same for host and player
                            IO.socket.emit('activateGame', dataSave);








                        }


                        // send data from the server and update player screens ::::::::::::::::::::::::::::::
                        IO.socket.emit('hostSendInfo', dataSave);


                    }
                    else if (data.status == 'exit'){

                        $('#playersWaiting')
                            .append('<p/>')
                            .text('Player ' + data.playerInfo.display_name + ' has left the game.');

                        // Delete the player's data on the Host.
                        for (var j=0; j<App.Host.players.length; j++){
                            if (App.Host.players[j]._id == data.playerInfo._id){
                                App.Host.players.splice(j,1);
                                break;
                            }
                        }

                        // Decrement the number of players in the room
                        App.Host.numPlayersInRoom -= 1;

                        dataSave.hostPlayerArray = App.Host.players;


                        if (App.Host.players.length == 1) {
                            // send data to the server to change room status to 'waiting' ::::::::::::::::::::::::::::::
                            IO.socket.emit('roomWaiting', dataSave);
                        }




                        if (App.Host.players.length < 2) {
                            player2.innerHTML = '';
                        }


                        // send data from the server and update player screens ::::::::::::::::::::::::::::::
                        IO.socket.emit('hostSendInfo', dataSave);
                    }

                    playerCount.innerHTML = 'player count: ' + App.Host.numPlayersInRoom;
                    for (var k = 0; k < App.Host.players.length; k++) {
                        playerCount.innerHTML = playerCount.innerHTML + ' (' + App.Host.players[k].display_name + ')';
                    }

                }






            },

            /* *****************************
             *        PLAYER CODE        *
             ***************************** */

            Player : {

                /**
                 * A reference to the socket ID of the Host
                 */
                hostSocketId: '',

                /**
                 * The player's name entered on the 'Join' screen.
                 */
                myName: '',

                /**
                 * Click handler for the 'JOIN' button
                 */


                /**
                 * Display the waiting screen for player 1
                 * @param data
                 */
                updateWaitingScreen : function(data) {
                    var player1 = document.getElementById("player1");
                    var player2 = document.getElementById("player2");
                    var playerCount = document.getElementById("player-count");
                    //console.log('YOU HAVE JOINED THE GAME');
                    //console.log(data);


                    App.Host.numPlayersInRoom = data.hostPlayerArray.length;

                    App.Host.players = [];
                    playerCount.innerHTML = 'player count: ' + App.Host.numPlayersInRoom;
                    for (var i=0; i<data.hostPlayerArray.length; i++){
                        App.Host.players.push(data.hostPlayerArray[i]);
                        playerCount.innerHTML = playerCount.innerHTML + ' (' + data.hostPlayerArray[i].display_name + ')';
                    }



                    player1.innerHTML = '<p class="player-tag">player 1</p> <h1>' + App.Host.players[0].display_name + '</h1>';


                    player2.innerHTML = '<h1>' + App.Host.players[1].display_name + '</h1> <p class="player-tag2">player 2</p>';

                    return false;
                },
                exitGame : function() {
                    $('#exit-wrapper-bg').show();
                }





















                //onJoinClick: function () {
                //     console.log('Clicked "Join A Game"');
                //
                //
                //    // collect data to send to the server
                //    var data = {
                //        gameId : $scope.player._id,
                //        playerName : $scope.player.display_name || 'anon'
                //    };
                //
                //
                //    // Send the gameId and playerName to the server
                //    IO.socket.emit('playerJoinGame', data);
                //
                //
                //
                //
                //
                //
                //    // Set the appropriate properties for the current player.
                //    App.myRole = 'Player';
                //    App.Player.myName = data.playerName;
                //
                //
                //
                //
                //    return false;
                //}


                ///**
                // * The player entered their name and gameId (hopefully)
                // * and clicked Start.
                // */
                //onPlayerStartClick: function() {
                //    // console.log('Player clicked "Start"');
                //
                //    // collect data to send to the server
                //    var data = {
                //        gameId : +($('#inputGameId').val()),
                //        playerName : $('#inputPlayerName').val() || 'anon'
                //    };
                //
                //
                //}








            }
        };





        // on load of page
        $(function () {
            // when the client clicks SEND
            $('#dataSend').click(function () {
                var message =   $sanitize($('#data').val());
                // clear the input box
                $('#data').val('');
                // tell server to execute 'sendChat' and send along one parameter
                IO.socket.emit('sendChat', message);
                $('#data').focus();
            });

            // when the client hits ENTER on their keyboard
            $('#data').keypress(function (e) {
                if (e.which == 13) {
                    $(this).blur();
                    $('#dataSend').focus().click();
                }
            });
        });









    // A user has clicked on 'Create a New Game' button to host their own game  =======================================
    // ================================================================================================================
    $(document).off("click", "#new_game").on("click", "#new_game", function () {
        IO.socket.emit('hostCreateNewGame', $scope.player);
        return false;
    });






    // A user has clicked on a 'user display_name' to view their stats  ===============================================
    // ================================================================================================================
    $(document).off("click", "#stats-wrapper-bg").on("click", "#stats-wrapper-bg", function () {
        $('#stats-wrapper-bg').hide();
        enableScroll();
        return false;
    });

    $('div.user-stats').click(function(e){
        e.stopPropagation();
    });










    // A user has clicked on 'Back to Profile' to exit the game  ======================================================
    // ================================================================================================================
    $(document).off("click", "#exitGame").on("click", "#exitGame", function () {
        $('#play-wrapper-bg').hide();
        enableScroll();
        //console.log('you clicked the exit game button');
        var data = {};
        data.playerInfo = $scope.player;
        data.gameId = currentGameRoom;

        if ( App.myRole == 'Host'){
            IO.socket.emit('hostLeftGame', data);
        } else{
            IO.socket.emit('playerLeftGame', data);
        }



        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::
        resetGameVariables();
        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::






        return false;
    });


    $(document).off("click", "#exitGamePlayer").on("click", "#exitGamePlayer", function () {
        $('#play-wrapper-bg').hide();
        enableScroll();
        //console.log('you clicked the exit game button');
        var data = {};
        data.playerInfo = $scope.player;
        data.gameId = currentGameRoom;

        IO.socket.emit('playerExitGame', data);




        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::
        resetGameVariables();
        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::






        return false;
    });






    //setTimeout(IO.init, 1000);









    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------
    // CHAT ROOM SOCKET ---------------------------------------------------------------------------------------------------------













    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove  = preventDefault; // mobile
        document.onkeydown  = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }












    // GAME FUNCTIONS -----------------------------------------------------------------------------
    // GAME FUNCTIONS -----------------------------------------------------------------------------
    // GAME FUNCTIONS -----------------------------------------------------------------------------

    function resetGameVars() {
        gameVars.p1_id = ''; // matches server side
        gameVars.p2_id = ''; // matches server side
        gameVars.p1_score = 0;
        gameVars.p2_score = 0;
        gameVars.p1_i = 1;
        gameVars.p1_j = 1;
        gameVars.p2_i = 1;
        gameVars.p2_j = 39;
        gameVars.winner = 0;
        gameVars.world = [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,4,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,3,2],
            [2,2,2,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,2,2,2],
            [2,1,1,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2],
            [2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2],
            [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
            [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
            [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
            [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
            [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
            [2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
        ];
    }

    // This gets triggered when any user presses a key  ---> send move info to server
    function move(e){
        moveData.e = e;
        moveData.currentGameRoom = currentGameRoom;
        moveData.player_id = $scope.player._id;
        IO.socket.emit("move", moveData);
    }


    function moveRight(move) {



        // player 1 is attempting to move right -----------------------------------------------------------------------
        if (gameVars.p1_id == move.player_id) {
            // if the hamster is not facing right, make the hamster face right ---> rightFacingHamster(4)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j] != 4) {
                gameVars.world[gameVars.p1_i][gameVars.p1_j] = 4;
            }
            // if the right div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j + 1] != 2) {
                // increment the score by one if the right div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p1_i][gameVars.p1_j + 1] == 1) {
                    gameVars.p1_score++;
                    // move player 1's hamster one step right
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_j++;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 4;
                } else if (gameVars.world[gameVars.p1_i][gameVars.p1_j + 1] == 0) {
                    // move player 1's hamster one step right
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_j++;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 4;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }
        // player 2 is attempting to move right -----------------------------------------------------------------------
        if (gameVars.p2_id == move.player_id) {
            // if the hamster is not facing right, make the hamster face right ---> rightFacingHamster(4)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j] != 4) {
                gameVars.world[gameVars.p2_i][gameVars.p2_j] = 4;
            }
            // if the right div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j + 1] != 2) {
                // increment the score by one if the right div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p2_i][gameVars.p2_j + 1] == 1) {
                    gameVars.p2_score++;
                    // move player 2's hamster one step right
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_j++;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 4;
                } else if (gameVars.world[gameVars.p2_i][gameVars.p2_j + 1] == 0) {
                    // move player 2's hamster one step right
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_j++;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 4;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }

        displayWorld();

        // update player scores
        $scope.p1_score = gameVars.p1_score;
        $scope.p2_score = gameVars.p2_score;

        checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
        $scope.$apply();
    }

    function moveLeft(move) {

        //console.log('move left function');
        //console.log(move);

        // player 1 is attempting to move left -----------------------------------------------------------------------
        if (gameVars.p1_id == move.player_id) {
            // if the hamster is not facing left, make the hamster face left ---> leftFacingHamster(3)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j] != 3) {
                gameVars.world[gameVars.p1_i][gameVars.p1_j] = 3;
            }
            // if the left div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j - 1] != 2) {
                // increment the score by one if the left div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p1_i][gameVars.p1_j - 1] == 1) {
                    gameVars.p1_score++;
                    // move player 1's hamster one step left
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_j--;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 3;
                } else if (gameVars.world[gameVars.p1_i][gameVars.p1_j - 1] == 0) {
                    // move player 1's hamster one step left
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_j--;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 3;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }
        // player 2 is attempting to move left -----------------------------------------------------------------------
        if (gameVars.p2_id == move.player_id) {
            // if the hamster is not facing left, make the hamster face left ---> leftFacingHamster(3)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j] != 3) {
                gameVars.world[gameVars.p2_i][gameVars.p2_j] = 3;
            }
            // if the left div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j - 1] != 2) {
                // increment the score by one if the left div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p2_i][gameVars.p2_j - 1] == 1) {
                    gameVars.p2_score++;
                    // move player 2's hamster one step left
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_j--;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 3;
                } else if (gameVars.world[gameVars.p2_i][gameVars.p2_j - 1] == 0) {
                    // move player 2's hamster one step left
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_j--;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 3;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }

        displayWorld();

        // update player scores
        $scope.p1_score = gameVars.p1_score;
        $scope.p2_score = gameVars.p2_score;

        checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
        $scope.$apply();
    }

    function moveUp(move) {

        //console.log('move up function');
        //console.log(move);

        // player 1 is attempting to move up -----------------------------------------------------------------------
        if (gameVars.p1_id == move.player_id) {
            // if the hamster is not facing up, make the hamster face up ---> upFacingHamster(5)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j] != 5) {
                gameVars.world[gameVars.p1_i][gameVars.p1_j] = 5;
            }
            // if the up div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p1_i - 1][gameVars.p1_j] != 2) {
                // increment the score by one if the up div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p1_i - 1][gameVars.p1_j] == 1) {
                    gameVars.p1_score++;
                    // move player 1's hamster one step up
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_i--;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 5;
                } else if (gameVars.world[gameVars.p1_i - 1][gameVars.p1_j] == 0) {
                    // move player 1's hamster one step up
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_i--;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 5;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }
        // player 2 is attempting to move up -----------------------------------------------------------------------
        if (gameVars.p2_id == move.player_id) {
            // if the hamster is not facing up, make the hamster face up ---> upFacingHamster(5)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j] != 5) {
                gameVars.world[gameVars.p2_i][gameVars.p2_j] = 5;
            }
            // if the up div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p2_i - 1][gameVars.p2_j] != 2) {
                // increment the score by one if the up div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p2_i - 1][gameVars.p2_j] == 1) {
                    gameVars.p2_score++;
                    // move player 2's hamster one step up
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_i--;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 5;
                } else if (gameVars.world[gameVars.p2_i - 1][gameVars.p2_j] == 0) {
                    // move player 2's hamster one step up
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_i--;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 5;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }

        displayWorld();

        // update player scores
        $scope.p1_score = gameVars.p1_score;
        $scope.p2_score = gameVars.p2_score;

        checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
        $scope.$apply();
    }

    function moveDown(move) {

        //console.log('move down function');
        //console.log(move);

        // player 1 is attempting to move down -----------------------------------------------------------------------
        if (gameVars.p1_id == move.player_id) {
            // if the hamster is not facing down, make the hamster face down ---> downFacingHamster(6)
            if (gameVars.world[gameVars.p1_i][gameVars.p1_j] != 6) {
                gameVars.world[gameVars.p1_i][gameVars.p1_j] = 6;
            }
            // if the down div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p1_i + 1][gameVars.p1_j] != 2) {
                // increment the score by one if the down div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p1_i + 1][gameVars.p1_j] == 1) {
                    gameVars.p1_score++;
                    // move player 1's hamster one step down
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_i++;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 6;
                } else if (gameVars.world[gameVars.p1_i + 1][gameVars.p1_j] == 0) {
                    // move player 1's hamster one step down
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0;
                    gameVars.p1_i++;
                    gameVars.world[gameVars.p1_i][gameVars.p1_j] = 6;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }
        // player 2 is attempting to move down -----------------------------------------------------------------------
        if (gameVars.p2_id == move.player_id) {
            // if the hamster is not facing down, make the hamster face down ---> downFacingHamster(6)
            if (gameVars.world[gameVars.p2_i][gameVars.p2_j] != 6) {
                gameVars.world[gameVars.p2_i][gameVars.p2_j] = 6;
            }
            // if the down div of the hamster's current position is not a wall ---> wall(2)
            if (gameVars.world[gameVars.p2_i + 1][gameVars.p2_j] != 2) {
                // increment the score by one if the down div of the hamster's current position is a coin ---> coin(1)
                if (gameVars.world[gameVars.p2_i + 1][gameVars.p2_j] == 1) {
                    gameVars.p2_score++;
                    // move player 2's hamster one step down
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_i++;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 6;
                } else if (gameVars.world[gameVars.p2_i + 1][gameVars.p2_j] == 0) {
                    // move player 2's hamster one step down
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0;
                    gameVars.p2_i++;
                    gameVars.world[gameVars.p2_i][gameVars.p2_j] = 6;
                } else {
                    playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
                }
            }
        }

        displayWorld();

        // update player scores
        $scope.p1_score = gameVars.p1_score;
        $scope.p2_score = gameVars.p2_score;

        checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
        $scope.$apply();
    }

    function playersOverlap() {
        var average;
        gameVars.world[gameVars.p2_i][gameVars.p2_j] = 0; // player 1's current position is set to empty
        gameVars.world[gameVars.p1_i][gameVars.p1_j] = 0; // player 2's current position is set to empty
        // both players go back to starting positions
        gameVars.p1_i = 1;
        gameVars.p1_j = 1;
        gameVars.p2_i = 1;
        gameVars.p2_j = 39;
        gameVars.world[gameVars.p1_i][gameVars.p1_j] = 4;
        gameVars.world[gameVars.p2_i][gameVars.p2_j] = 3;
        // both player's score gets averaged
        average = Math.floor((gameVars.p1_score + gameVars.p2_score) * 0.5);
        gameVars.p1_score = average;
        gameVars.p2_score = average;
    }


    function checkWinner() {
        if (gameVars.p1_score == 100 && gameVars.winner == 0){
            gameVars.winner = 1;
        }
        if (gameVars.p2_score == 100 && gameVars.winner == 0){
            gameVars.winner = 2;
        }

        if(gameVars.winner != 0) {
            // winner winner chicken dinner!
            $scope.winner = gameVars.winner;

            $document.unbind('keydown');
            var dataSave = {};
            dataSave.id = $scope.player._id;

            if ($scope.winner == 1){
                $scope.p1_winnings = $scope.p1_score * 2;
                $scope.p2_winnings = $scope.p2_score;
            } else if ($scope.winner == 2){
                $scope.p1_winnings = $scope.p1_score;
                $scope.p2_winnings = $scope.p2_score * 2;
            }

            if ($scope.gRole == 11){
                dataSave.winnings = $scope.p1_winnings;
                if($scope.winner == 1){
                    dataSave.wins = 1;
                    dataSave.losses = 0;
                } else {
                    dataSave.wins = 0;
                    dataSave.losses = 1;
                }

                UserFactory.addScore(dataSave, function() {
                    $rootScope.$emit("CallParentMethod", {});
                })
            } else if ($scope.gRole == 22){
                dataSave.winnings = $scope.p2_winnings;
                if($scope.winner == 2){
                    dataSave.wins = 1;
                    dataSave.losses = 0;
                } else {
                    dataSave.wins = 0;
                    dataSave.losses = 1;
                }
                UserFactory.addScore(dataSave, function() {
                    $rootScope.$emit("CallParentMethod", {});
                })
            }
        }
        $scope.$apply();
    }


    function resetGameVariables(){
        resetGameVars();
        world = null;
        App.myRole = '';
        currentGameRoom = '';
        $scope.gPlayerArray = [];
        $scope.gameOn = 0;
        $scope.gRole = 0;
        $scope.ready11 = 0;
        $scope.ready22 = 0;
        $scope.gameStart = 0;
        $scope.winner = 0;
        $scope.p1_winnings = 0;
        $scope.p2_winnings = 0;
        document.getElementById('world').innerHTML = '';
    }
















    function displayWorld(){
        //console.log('display world function');

        //console.log(gameVars.world);
        //console.log(world);
        //

        world = gameVars.world;

        var output = '';
        for(var i=0; i<world.length; i++){
            output += "<div class='row'>";
            for(var j=0; j<world[i].length; j++){
                if(world[i][j] == 2){
                    output += "<div class='brick'></div>";
                }
                if(world[i][j] == 1){
                    output += "<div class='coin'></div>";
                }
                if(world[i][j] == 0){
                    output += "<div class='empty'></div>";
                }
                if(world[i][j] == 3){
                    output += "<div class='pacmanL'></div>";  // player1 facing left
                }
                if(world[i][j] == 4){
                    output += "<div class='pacmanR'></div>";   // player1 facing right
                }
                if(world[i][j] == 5){
                    output += "<div class='pacmanU'></div>";   // player1 facing up
                }
                if(world[i][j] == 6){
                    output += "<div class='pacmanD'></div>";   // player1 facing down
                }


            }
            output += "</div>";
        }
        document.getElementById('world').innerHTML = output;
    }



    // ready check functions
    $scope.ready_1 = function (){
        //console.log('player 1 clicked ready');
        $scope.gRole = 11;
        IO.socket.emit('playerOneReady', currentGameRoom);
    };
    $scope.ready_2 = function (){
        //console.log('player 2 clicked ready');
        $scope.gRole = 22;
        IO.socket.emit('playerTwoReady', currentGameRoom, $scope.gPlayerArray);
    };














        //if (e == 39 || e == 68) {
        //    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move right
        //    IO.socket.emit("move_right", currentGameRoom, $scope.player._id);
        //    // ::::::::::::::::::::::::::::::::::::::::::::::::::::
        //}
        //
        //if (e == 37 || e == 65) {
        //    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move left
        //    IO.socket.emit("move_left", currentGameRoom, $scope.player._id);
        //    // ::::::::::::::::::::::::::::::::::::::::::::::::::::
        //}
        //
        //if (e == 38 || e == 87) {
        //    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move up
        //    IO.socket.emit("move_up", currentGameRoom, $scope.player._id);
        //    // ::::::::::::::::::::::::::::::::::::::::::::::::::::
        //}
        //
        //if (e == 40 || e == 83) {
        //    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move down
        //    IO.socket.emit("move_down", currentGameRoom, $scope.player._id, $scope.gRole);
        //    // ::::::::::::::::::::::::::::::::::::::::::::::::::::
        //}




    $scope.exitGame = function (){
        $('#play-wrapper-bg').hide();
        enableScroll();
        //console.log('you clicked the exit game button');
        var data = {};
        data.playerInfo = $scope.player;
        data.gameId = currentGameRoom;

        if ( App.myRole == 'Host'){
            IO.socket.emit('hostLeftGame', data);
        } else{
            IO.socket.emit('playerExitGame', data);
        }



        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::
        resetGameVariables();
        // User has exited game. Reset all game variables :::::::::::::::::::::
        // User has exited game. Reset all game variables :::::::::::::::::::::
    };





    // GAME FUNCTIONS -----------------------------------------------------------------------------
    // GAME FUNCTIONS -----------------------------------------------------------------------------
    // GAME FUNCTIONS -----------------------------------------------------------------------------






    IO.beforeInit();
}); // END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
// END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
// END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
// END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
// END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
// END GAME CONTROLLER ---------------------------------------------------------------------------------------------------------
