// veccy.js


// SERVER1 =====> Green: when new user enters the main chat
// SERVER2 =====> Red: when user leaves the main chat
// SERVER3 =====> Orange: when user creates a new game room


/****************************************************
 *                                                  *
 *       INITIALIZE GLOBAL SOCKET VARIABLES         *
 *                                                  *
 ****************************************************/
// ::::::::::::::: These variables are only initiated when the server starts/restarts :::::::::::::::::::::::
// Display names of users which are currently connected to the client-side Game Controller
var userNames = {};

// Socket rooms which are currently available to users
var rooms = {room1: {name: 'room1', status: 'mainChat'}};


// WORLD VARIABLES ----------------

var worlds = {};

worlds.world_1 = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];


// ::::::::::::::: These variables are only initiated when the server starts/restarts :::::::::::::::::::::::







/********************************
 *                              *
 *       CODE TO EXPORT         *
 *                              *
 ********************************/
exports.initGame = function(io, socket){
    // The current game ID this user is in. Set to NULL if not in a game.
    var currentGameID = null;

    // This executes upon user connect. Will trigger 'addUser' emit from client. ======================================
    // ================================================================================================================
    socket.emit('connected', { message: "You are connected!" });


    /*************************************
     *       MAIN CHAT ROOM EVENTS       *
     *************************************/
    // When the client emits 'addUser', this listens and executes =====================================================
    // ================================================================================================================
    socket.on('addUser', function(newUser){
        //console.log('*** New User Entered ***    ------>   ' + newUser.display_name);
        console.log(newUser);

        // Emit to 'room1' that a new user has connected to their room -----------------------------------------------------> This will emit to a specific room
        io.to('room1').emit('updateChat', 'SERVER1', 'has entered the building!', newUser.display_name);


        // Store the newUser's complete info object in the socket session
        socket.userInfo = newUser;

        // Store the current room name in the socket session for this user. Initially 'room1' AKA main chat room.
        socket.room = 'room1';

        // Send newUser to 'room1'
        socket.join('room1');
        // Emit to newUser that they've connected ---------------------------------------------------------------------------> This will emit back to the source user only
        socket.emit('updateChat', 'SERVER1', 'you have entered the general chat room');
        socket.emit('updateRooms', rooms, 'room1'); // This will tell the newUser that he/she is in 'room1'

        // Add the newUser's display_name to the global list of connected users
        userNames[newUser._id] = newUser.display_name;

        // Emit to 'room1' to add the new display_name to global user names list. (emit to players currently NOT in a game room)
        io.to('room1').emit('updateUsers', userNames);



        // initialize GAME variables for this new user::::::::::::::::::::::::::
        // initialize GAME variables for this new user::::::::::::::::::::::::::
        // initialize GAME variables for this new user::::::::::::::::::::::::::
        var gameVar = {};
        gameVar.currentGameID = null;
        gameVar.p1_id = '';
        gameVar.p2_id = '';
        gameVar.p1_score = 0;
        gameVar.p2_score = 0;
        gameVar.p1_ready = 0;
        gameVar.p2_ready = 0;
        gameVar.p1_i = 0;
        gameVar.p1_j = 0;
        gameVar.p2_i = 0;
        gameVar.p2_j = 0;
        gameVar.winner = 0;
        gameVar.world = [];

        // Store the newUser's initialized game info object in the socket session

        if(!socket.gameVars) {
            socket.gameVars = gameVar;
            console.log('initialize GAME variables for this new user::::::::::::::::::::::::::'.green);
            console.log(socket.userInfo.display_name);
            console.log('initialize GAME variables for this new user::::::::::::::::::::::::::'.green);
        }

        // initialize GAME variables for this new user::::::::::::::::::::::::::
        // initialize GAME variables for this new user::::::::::::::::::::::::::
        // initialize GAME variables for this new user::::::::::::::::::::::::::
    });

    // When the client emits 'sendChat', this listens and executes ====================================================
    // ================================================================================================================
    socket.on('sendChat', function (data) {
        if(data) {
            console.log('*** New Message Received ***'.blue);
            console.log('room: '.blue + socket.room);
            // We tell the client to execute 'updateChat' with 2 parameters
            io.to(socket.room).emit('updateChat', 'CHAT', data, socket.userInfo.display_name);
        }
        else{
            console.log('*** No Message Entered ***'.red);
        }
    });

    // When the user disconnects.. perform this =======================================================================
    // ================================================================================================================
    socket.on('disconnect', function() {
        console.log(socket.userInfo.display_name + " has triggered the disconnect event".red);

        // Remove the user's display_name from global userNames list
        delete userNames[socket.userInfo._id];

        // Emit to 'room1' that this user has left and update their global userNames list
        io.to('room1').emit('updateUsers', userNames);
        io.to('room1').emit('updateChat', 'SERVER2', 'has left the building!', socket.userInfo.display_name);

        if (socket.gameVars.currentGameID){
            var data = {};
            // User who left is leaving from a game room
            data.playerInfo = socket.userInfo;
            data.gameId = socket.userInfo._id;
            if (socket.gameVars.currentGameID == socket.userInfo._id) {
                // User who left is the host
                //hostLeftGame(data);


                console.log('calling the hostLeftGame function upon user disconnect ------------------------------- '.yellow + data);
                console.log(':::::::::::::::::  hostLeftGame Function  :::::::::::::::'.cyan);
                console.log('Host ' + data.playerInfo.display_name + ' attempting to leave game: ' + data.gameId );

                // Emit an event notifying the clients that the host has left the room. (ONLY PLAYERS WILL USE THIS) ************************************************* tell them to exit
                io.to(socket.gameVars.currentGameID).emit('hostLeftRoom', data);


                // Leave the game room and rejoin 'room1' (main chat)
                //noinspection JSCheckFunctionSignatures
                socket.leave(socket.gameVars.currentGameID);
                delete rooms[socket.gameVars.currentGameID];
                /// Remove the game room from global rooms list


                // Emit to 'room1' to update their global rooms list
                io.to('room1').emit('updateRooms', rooms, 'room1');
                console.log('Rooms: '.yellow + rooms );

                console.log('::::::::::::::::: hostLeftGame Function  :::::::::::::::'.cyan);

            } else {
                // User who left is leaving from a game room and he/she is a player
                //playerLeftGame(data);

                console.log('calling the playerLeftGame function upon user disconnect ------------------------------- '.yellow + data);
                console.log(':::::::::::::::::  playerLeftGame Function  :::::::::::::::'.cyan);
                console.log('Player ' + data.playerInfo.display_name + ' attempting to leave game: ' + data.gameId );

                // Emit an event notifying the clients that the player has left the room. (ONLY HOST WILL USE THIS)
                // Add an 'exit' status so the host knows the player is leaving
                data.status = 'exit';
                io.to(socket.gameVars.currentGameID).emit('playerLeftRoom', data);// -------------------------------------------------------------------------------- why this no work??
                //noinspection JSCheckFunctionSignatures
                socket.leave(socket.gameVars.currentGameID);
                console.log('emit playerLeftRoom to all clients still in the game room');

                console.log(':::::::::::::::::  playerLeftGame Function  :::::::::::::::'.cyan);


            }
        } else{
            // player has no currentGameID. User left from the main chat 'room1'
            //noinspection JSCheckFunctionSignatures
            socket.leave(socket.room);
            console.log('User has disconnected via the main chat ------------------------------- '.yellow);
        }
        console.log(socket.userInfo.display_name + " has disconnected".red);
    });






    /**************************************
     *       HOST EVENTS LISTENERS        *
     **************************************/
    socket.on('hostCreateNewGame', hostCreateNewGame);
    socket.on('hostSendInfo', hostSendInfo);
    socket.on('hostLeftGame', hostLeftGame);

    socket.on('roomFull', roomFull);
    socket.on('roomWaiting', roomWaiting);
    //socket.on('hostRoomFull', hostPrepareGame);
    //socket.on('hostCountdownFinished', hostStartGame);
    //socket.on('hostNextRound', hostNextRound);

    /****************************************
     *       PLAYER EVENTS LISTENERS        *
     ****************************************/
    socket.on('playerJoinGame', playerJoinGame);
    //socket.on('playerAnswer', playerAnswer);
    //socket.on('playerRestart', playerRestart);

    socket.on('playerLeftGame', playerLeftGame);
    socket.on('playerExitGame', playerExitGame);


    /****************************************
     *       GAME EVENTS LISTENERS        *
     ****************************************/
    socket.on('activateGame', activateGame);
    socket.on('playerOneReady', playerOneReady);
    socket.on('playerTwoReady', playerTwoReady);
    socket.on('otherPlayerReady', otherPlayerReady);
    //socket.on('otherPlayerMoved', otherPlayerMoved);
    //socket.on('move_right', move_right);
    //socket.on('move_left', move_left);
    //socket.on('move_up', move_up);
    //socket.on('move_down', move_down);


    socket.on('move', move);










    /*******************************
     *       GAME FUNCTIONS        *
     *******************************/

    // The game room is full, initialize the game world =============================================================
    // ================================================================================================================
    function activateGame(data) {
        //console.log(':::::::::::::::::  activateGame Function  :::::::::::::::'.magenta);
        //
        //console.log(data);


        if (socket.gameVars.currentGameID == data.gameId){
            //var dataSend = {};
            resetGameVars();

            // Set player variables ----------------------------------
            socket.gameVars.p1_id = data.hostPlayerArray[0]._id;
            socket.gameVars.p2_id = data.hostPlayerArray[1]._id;


            // Set player starting positions ----------------------
            //socket.gameVars.p1_i = 1;
            //socket.gameVars.p1_j = 1;
            //socket.gameVars.p2_i = 1;
            //socket.gameVars.p2_j = 39;


            // Build response data object
            //dataSend.dataPassed = data;
            //dataSend.p1_id = socket.gameVars.p1_id;
            //dataSend.p2_id = socket.gameVars.p2_id;



            // EMIT RESPONSE TO CLIENT
            io.to(data.gameId).emit('generateContent', data); // this only goes out to everyone in the game room
        }
    }


    function playerOneReady(gameRoom) {
        //console.log(':::::::::::::::::  playerOneReady Function  :::::::::::::::'.magenta);
        //console.log(socket.gameVars);


        var readyData = {};

        if (socket.gameVars.currentGameID){
            if (socket.gameVars.currentGameID == gameRoom){
                socket.gameVars.p1_ready = 1;

                readyData = {
                    p1_ready: socket.gameVars.p1_ready,
                    p2_ready: socket.gameVars.p2_ready
                };
                //console.log(readyData);
                io.to(gameRoom).emit('readyCheck', readyData); // this only goes out to everyone in the game room
            }
        }
    }

    function playerTwoReady(gameRoom, gPlayerArray) {
        //console.log(':::::::::::::::::  playerTwoReady Function  :::::::::::::::'.magenta);
        //
        //console.log(socket.gameVars);
        //console.log(':::::::::::::::::  playerTwoReady Function   -------> going to re-initialize world variables :::::::::::::::'.magenta);
        resetGameVars();

        // Set player variables ----------------------------------
        socket.gameVars.p1_id = gPlayerArray[0]._id;
        socket.gameVars.p2_id = gPlayerArray[1]._id;

        // Set player starting positions ----------------------
        //socket.gameVars.p1_i = 1;
        //socket.gameVars.p1_j = 1;
        //socket.gameVars.p2_i = 1;
        //socket.gameVars.p2_j = 39;

        //console.log(socket.gameVars);
        //console.log(':::::::::::::::::  playerTwoReady Function   -------> finished re-initializing world variables :::::::::::::::'.magenta);

        var readyData = {};

        if (socket.gameVars.currentGameID){
            if (socket.gameVars.currentGameID == gameRoom){
                socket.gameVars.p2_ready = 1;

                readyData = {
                    p1_ready: socket.gameVars.p1_ready,
                    p2_ready: socket.gameVars.p2_ready
                };

                //console.log(readyData);
                io.to(gameRoom).emit('readyCheck', readyData); // this only goes out to everyone in the game room
            }
        }
    }

    function otherPlayerReady(tellTheServer) {
        //console.log(':::::::::::::::::  otherPlayerReady Function  :::::::::::::::'.magenta);
        //console.log('tellTheServer.myGameRole: '.yellow +  tellTheServer.myGameRole );
        //
        //console.log(':::::::::::::::::  before  :::::::::::::::'.blue);
        //console.log('socket.gameVars.p2_ready: '.yellow +  socket.gameVars.p2_ready );
        //console.log('socket.gameVars.p1_ready: '.yellow +  socket.gameVars.p1_ready );
        if(tellTheServer.myGameRole == 1){
            socket.gameVars.p2_ready = 1;
        } else if (tellTheServer.myGameRole == 2){
            socket.gameVars.p1_ready = 1;
        }
        //
        //console.log(':::::::::::::::::  after  :::::::::::::::'.blue);
        //console.log('socket.gameVars.p2_ready: '.yellow +  socket.gameVars.p2_ready );
        //console.log('socket.gameVars.p1_ready: '.yellow +  socket.gameVars.p1_ready );


    }



    function move(data) {
        if (socket.gameVars.currentGameID) {
            if (socket.gameVars.currentGameID == data.currentGameRoom) {

                //
                //console.log(data);

                // Relay the move to both players
                io.to(data.currentGameRoom).emit('playerMoved', data);

            }
        }




    }








    //
    //
    //
    //
    //
    //
    //function otherPlayerMoved(data, gameRoom) {
    //    //console.log(':::::::::::::::::  otherPlayerMoved Function  :::::::::::::::'.magenta);
    //    //
    //    //
    //    //console.log(':::::::::::::::::  same  :::::::::::::::'.magenta);
    //    //console.log('this is the playerId that was sent from the client ----> (this is the one that didnt move)'.yellow + playerId);
    //    //console.log('This is my id: '.yellow + socket.userInfo._id );
    //    //console.log(':::::::::::::::::  same  :::::::::::::::'.magenta);
    //    //console.log('This is the id of the player who moved: '.yellow +  data.playerId );
    //
    //    if (socket.gameVars.currentGameID) {
    //        if (socket.gameVars.currentGameID == gameRoom) {
    //            if(socket.userInfo._id != data.playerId){
    //                //console.log(':::::::::::::::::  inside the ifs  :::::::::::::::'.blue);
    //                // the other player made a move. I need to change my session data.
    //                socket.gameVars.world = data.world;
    //                socket.gameVars.p1_score = data.p1_score;
    //                socket.gameVars.p2_score = data.p2_score;
    //                socket.gameVars.winner = data.winner;
    //
    //                socket.gameVars.p1_i = data.p1_i;
    //                socket.gameVars.p1_j = data.p1_j;
    //                socket.gameVars.p2_i = data.p2_i;
    //                socket.gameVars.p2_j = data.p2_j;
    //            }
    //        }
    //    }
    //
    //    //
    //    //console.log(':::::::::::::::::  this should now match the other players  :::::::::::::::'.magenta);
    //    //console.log(socket.gameVars);
    //    //console.log(':::::::::::::::::  this should now match the other players  :::::::::::::::'.magenta);
    //    //
    //    //
    //
    //}
    //
    //
    //
    //
    //











    //
    //
    //
    //
    //
    //
    //
    //
    //function move_right(gameRoom, playerId) {
    //    if (socket.gameVars.currentGameID) {
    //        if (socket.gameVars.currentGameID == gameRoom) {
    //            // player 1 is attempting to move right -----------------------------------------------------------------------
    //            if (socket.gameVars.p1_id == playerId) {
    //                // if the hamster is not facing right, make the hamster face right ---> rightFacingHamster(4)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] != 4) {
    //                    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 4;
    //                }
    //                // if the right div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j + 1] != 2) {
    //                    // increment the score by one if the right div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j + 1] == 1) {
    //                        socket.gameVars.p1_score++;
    //                        // move player 1's hamster one step right
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_j++;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 4;
    //                    } else if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j + 1] == 0) {
    //                        // move player 1's hamster one step right
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_j++;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 4;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // player 2 is attempting to move right -----------------------------------------------------------------------
    //            if (socket.gameVars.p2_id == playerId) {
    //                // if the hamster is not facing right, make the hamster face right ---> rightFacingHamster(4)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] != 4) {
    //                    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 4;
    //                }
    //                // if the right div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j + 1] != 2) {
    //                    // increment the score by one if the right div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j + 1] == 1) {
    //                        socket.gameVars.p2_score++;
    //                        // move player 2's hamster one step right
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_j++;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 4;
    //                    } else if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j + 1] == 0) {
    //                        // move player 2's hamster one step right
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_j++;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 4;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //
    //            // organize the data to send back to the clients
    //            var data = {};
    //
    //            data.world = socket.gameVars.world;
    //            data.p1_score = socket.gameVars.p1_score;
    //            data.p2_score = socket.gameVars.p2_score;
    //            data.winner = socket.gameVars.winner;
    //
    //            data.playerId = socket.userInfo._id;
    //            data.p1_i = socket.gameVars.p1_i;
    //            data.p1_j = socket.gameVars.p1_j;
    //            data.p2_i = socket.gameVars.p2_i;
    //            data.p2_j = socket.gameVars.p2_j;
    //
    //
    //            // emit response to clients in the current game room
    //            io.to(gameRoom).emit('moved', data);
    //        }
    //    }
    //}
    //
    //
    //
    //function move_left(gameRoom, playerId) {
    //    if (socket.gameVars.currentGameID) {
    //        if (socket.gameVars.currentGameID == gameRoom) {
    //            // player 1 is attempting to move left -----------------------------------------------------------------------
    //            if (socket.gameVars.p1_id == playerId) {
    //                // if the hamster is not facing left, make the hamster face left ---> leftFacingHamster(3)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] != 3) {
    //                    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 3;
    //                }
    //                // if the left div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j - 1] != 2) {
    //                    // increment the score by one if the left div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j - 1] == 1) {
    //                        socket.gameVars.p1_score++;
    //                        // move player 1's hamster one step left
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_j--;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 3;
    //                    } else if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j - 1] == 0) {
    //                        // move player 1's hamster one step left
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_j--;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 3;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // player 2 is attempting to move left -----------------------------------------------------------------------
    //            if (socket.gameVars.p2_id == playerId) {
    //                // if the hamster is not facing left, make the hamster face left ---> leftFacingHamster(3)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] != 3) {
    //                    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 3;
    //                }
    //                // if the left div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j - 1] != 2) {
    //                    // increment the score by one if the left div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j - 1] == 1) {
    //                        socket.gameVars.p2_score++;
    //                        // move player 2's hamster one step left
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_j--;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 3;
    //                    } else if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j - 1] == 0) {
    //                        // move player 2's hamster one step left
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_j--;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 3;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // organize the data to send back to the clients
    //            var data = {};
    //            data.world = socket.gameVars.world;
    //            data.p1_score = socket.gameVars.p1_score;
    //            data.p2_score = socket.gameVars.p2_score;
    //            data.winner = socket.gameVars.winner;
    //
    //            data.playerId = socket.userInfo._id;
    //            data.p1_i = socket.gameVars.p1_i;
    //            data.p1_j = socket.gameVars.p1_j;
    //            data.p2_i = socket.gameVars.p2_i;
    //            data.p2_j = socket.gameVars.p2_j;
    //            // emit response to clients in the current game room
    //            io.to(gameRoom).emit('moved', data);
    //        }
    //    }
    //}
    //
    //
    //function move_up(gameRoom, playerId) {
    //    if (socket.gameVars.currentGameID) {
    //        if (socket.gameVars.currentGameID == gameRoom) {
    //            // player 1 is attempting to move up -----------------------------------------------------------------------
    //            if (socket.gameVars.p1_id == playerId) {
    //                // if the hamster is not facing up, make the hamster face up ---> upFacingHamster(5)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] != 5) {
    //                    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 5;
    //                }
    //                // if the up div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p1_i - 1][socket.gameVars.p1_j] != 2) {
    //                    // increment the score by one if the up div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p1_i - 1][socket.gameVars.p1_j] == 1) {
    //                        socket.gameVars.p1_score++;
    //                        // move player 1's hamster one step up
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_i--;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 5;
    //                    } else if (socket.gameVars.world[socket.gameVars.p1_i - 1][socket.gameVars.p1_j] == 0) {
    //                        // move player 1's hamster one step up
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_i--;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 5;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // player 2 is attempting to move right -----------------------------------------------------------------------
    //            if (socket.gameVars.p2_id == playerId) {
    //                // if the hamster is not facing up, make the hamster face up ---> upFacingHamster(5)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] != 5) {
    //                    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 5;
    //                }
    //                // if the up div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p2_i - 1][socket.gameVars.p2_j] != 2) {
    //                    // increment the score by one if the up div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p2_i - 1][socket.gameVars.p2_j] == 1) {
    //                        socket.gameVars.p2_score++;
    //                        // move player 2's hamster one step up
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_i--;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 5;
    //                    } else if (socket.gameVars.world[socket.gameVars.p2_i - 1][socket.gameVars.p2_j] == 0) {
    //                        // move player 2's hamster one step up
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_i--;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 5;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // organize the data to send back to the clients
    //            var data = {};
    //            data.world = socket.gameVars.world;
    //            data.p1_score = socket.gameVars.p1_score;
    //            data.p2_score = socket.gameVars.p2_score;
    //            data.winner = socket.gameVars.winner;
    //
    //            data.playerId = socket.userInfo._id;
    //            data.p1_i = socket.gameVars.p1_i;
    //            data.p1_j = socket.gameVars.p1_j;
    //            data.p2_i = socket.gameVars.p2_i;
    //            data.p2_j = socket.gameVars.p2_j;
    //            // emit response to clients in the current game room
    //            io.to(gameRoom).emit('moved', data);
    //        }
    //    }
    //}
    //
    //
    //function move_down(gameRoom, playerId) {
    //    if (socket.gameVars.currentGameID) {
    //        if (socket.gameVars.currentGameID == gameRoom) {
    //            // player 1 is attempting to move down -----------------------------------------------------------------------
    //            if (socket.gameVars.p1_id == playerId) {
    //                // if the hamster is not facing down, make the hamster face down ---> downFacingHamster(6)
    //                if (socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] != 6) {
    //                    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 6;
    //                }
    //                // if the down div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p1_i + 1][socket.gameVars.p1_j] != 2) {
    //                    // increment the score by one if the down div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p1_i + 1][socket.gameVars.p1_j] == 1) {
    //                        socket.gameVars.p1_score++;
    //                        // move player 1's hamster one step down
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_i++;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 6;
    //                    } else if (socket.gameVars.world[socket.gameVars.p1_i + 1][socket.gameVars.p1_j] == 0) {
    //                        // move player 1's hamster one step down
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0;
    //                        socket.gameVars.p1_i++;
    //                        socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 6;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // player 2 is attempting to move right -----------------------------------------------------------------------
    //            if (socket.gameVars.p2_id == playerId) {
    //                // if the hamster is not facing down, make the hamster face down ---> downFacingHamster(6)
    //                if (socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] != 6) {
    //                    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 6;
    //                }
    //                // if the down div of the hamster's current position is not a wall ---> wall(2)
    //                if (socket.gameVars.world[socket.gameVars.p2_i + 1][socket.gameVars.p2_j] != 2) {
    //                    // increment the score by one if the down div of the hamster's current position is a coin ---> coin(1)
    //                    if (socket.gameVars.world[socket.gameVars.p2_i + 1][socket.gameVars.p2_j] == 1) {
    //                        socket.gameVars.p2_score++;
    //                        // move player 2's hamster one step down
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_i++;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 6;
    //                    } else if (socket.gameVars.world[socket.gameVars.p2_i + 1][socket.gameVars.p2_j] == 0) {
    //                        // move player 2's hamster one step down
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0;
    //                        socket.gameVars.p2_i++;
    //                        socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 6;
    //                    } else {
    //                        playersOverlap(); // THIS HAPPENS IF THE TWO HAMSTERS OVERLAP :::::::::::::::::::::::
    //                    }
    //                    checkWinner(); // WINNER WINNER CHICKEN DINNER :::::::::::::::::::::::
    //                }
    //            }
    //            // organize the data to send back to the clients
    //            var data = {};
    //            data.world = socket.gameVars.world;
    //            data.p1_score = socket.gameVars.p1_score;
    //            data.p2_score = socket.gameVars.p2_score;
    //            data.winner = socket.gameVars.winner;
    //
    //            data.playerId = socket.userInfo._id;
    //            data.p1_i = socket.gameVars.p1_i;
    //            data.p1_j = socket.gameVars.p1_j;
    //            data.p2_i = socket.gameVars.p2_i;
    //            data.p2_j = socket.gameVars.p2_j;
    //            // emit response to clients in the current game room
    //            io.to(gameRoom).emit('moved', data);
    //        }
    //    }
    //}


    //function playersOverlap() {
    //    var average;
    //    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 0; // player 1's current position is set to empty
    //    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 0; // player 2's current position is set to empty
    //    // both players go back to starting positions
    //    socket.gameVars.p1_i = 1;
    //    socket.gameVars.p1_j = 1;
    //    socket.gameVars.p2_i = 1;
    //    socket.gameVars.p2_j = 39;
    //    socket.gameVars.world[socket.gameVars.p1_i][socket.gameVars.p1_j] = 4;
    //    socket.gameVars.world[socket.gameVars.p2_i][socket.gameVars.p2_j] = 3;
    //    // both player's score gets averaged
    //    average = Math.floor((socket.gameVars.p1_score + socket.gameVars.p2_score) * 0.5);
    //    socket.gameVars.p1_score = average;
    //    socket.gameVars.p2_score = average;
    //}
    //
    //
    //function checkWinner() {
    //    if (socket.gameVars.p1_score == 100 && socket.gameVars.winner == 0){
    //        socket.gameVars.winner = 1;
    //    }
    //    if (socket.gameVars.p2_score == 100 && socket.gameVars.winner == 0){
    //        socket.gameVars.winner = 2;
    //    }
    //}
    //
    //


















    function resetGameVars() {
        socket.gameVars.p1_id = '';
        socket.gameVars.p2_id = '';
        socket.gameVars.p1_score = 0;
        socket.gameVars.p2_score = 0;

        socket.gameVars.p1_ready = 0;
        socket.gameVars.p2_ready = 0;
        //socket.gameVars.p1_i = 0;
        //socket.gameVars.p1_j = 0;
        //socket.gameVars.p2_i = 0;
        //socket.gameVars.p2_j = 0;
        //socket.gameVars.winner = 0;
        //socket.gameVars.world = [
        //    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        //    [2,4,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,3,2],
        //    [2,2,2,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,2,2,2],
        //    [2,1,1,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,1,1,2],
        //    [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2],
        //    [2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2],
        //    [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
        //    [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
        //    [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
        //    [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
        //    [2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],
        //    [2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2],
        //    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
        //    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
        //    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
        //];
    }




































    /*******************************
     *       HOST FUNCTIONS        *
     *******************************/

    // The 'Create New Game' button was clicked by a user =============================================================
    // ================================================================================================================
    function hostCreateNewGame() {
        console.log(':::::::::::::::::  hostCreateNewGame Function  :::::::::::::::'.magenta);
        // Create a unique Socket.IO Game Room. This will be the host user's user ID.
        socket.gameVars.currentGameID = socket.userInfo._id;
        console.log(socket.userInfo.display_name + " has created a new game room".green + ' -----> currentGameID: ' + socket.gameVars.currentGameID);


        // Initialize a new room object and add this new game room to the global rooms array
        rooms[socket.gameVars.currentGameID] = {
            name: socket.userInfo.display_name,
            status: 'waiting'
        };


        // Join the Room and wait for the players
        //noinspection JSCheckFunctionSignatures
        socket.leave(socket.room);
        socket.join(socket.gameVars.currentGameID);
        socket.room = socket.gameVars.currentGameID;

        // Update the rooms listing for all users currently in 'room1' (main chat) ---> Add this new game room
        io.to('room1').emit('updateRooms', rooms, 'room1');
        io.to('room1').emit('updateChat', 'SERVER3', 'has created a new game room!', socket.userInfo.display_name);

        // Update host rooms listing. Host is now in this newly created game room
        socket.emit('updateRooms', rooms, socket.gameVars.currentGameID);

        // Return the Room ID (gameId) and the socket ID (mySocketId) to the host
        socket.emit('newGameCreated', {gameId: socket.gameVars.currentGameID, mySocketId: socket.id, roomID: socket.userInfo.display_name });
    }


    // New player has joined the game, host will send the new player the host game room info ==========================
    // ================================================================================================================
    function hostSendInfo(dataSave) {
        console.log(':::::::::::::::::  hostSendInfo Function  :::::::::::::::'.magenta);
        // Emit an event to everyone in the game room that a new player has joined the room, passing along the new player's info.
        // ONLY THE PLAYERS WILL GET THIS (client side code)
        io.to(dataSave.gameId).emit('gameInfo', dataSave);
    }

    // A HOST has clicked on 'Back to Profile' to exit the game  ====================================================
    // ================================================================================================================
    function hostLeftGame(data) {
        console.log(':::::::::::::::::  hostLeftGame Function  :::::::::::::::'.cyan);
        console.log('Host ' + data.playerInfo.display_name + 'attempting to leave game: '.red + data.gameId );

        // Emit an event notifying the clients that the host has left the room. (ONLY PLAYERS WILL USE THIS) ************************************************* tell them to exit
        io.to(data.gameId).emit('hostLeftRoom', data);

        // Update the host's room (client side) to 'room1' (main chat)
        socket.emit('updateRooms', rooms, 'room1');

        // Leave the game room and rejoin 'room1' (main chat)
        //noinspection JSCheckFunctionSignatures
        socket.leave(socket.room);
        socket.join('room1');
        socket.room = 'room1';
        socket.gameVars.currentGameID = null;

        // Remove the game room from global rooms list
        delete rooms[data.gameId];

        // Emit to 'room1' to update their global rooms list
        io.to('room1').emit('updateRooms', rooms, 'room1');
        resetGameVars();
    }



    // The host's game room has 2 players. This room is now FULL ======================================================
    // ================================================================================================================
    function roomFull(data) {
        // Change the host's room status to 'full'
        rooms[data.gameId].status = 'full';
        // Update the rooms listing for everyone in 'room1' AKA main chat room
        // Emit to 'room1' to update their global rooms list
        io.to('room1').emit('updateRooms', rooms, 'room1');
    }

    // The host's game room is back to only 1 player. This room is now WAITING ========================================
    // ================================================================================================================
    function roomWaiting(data) {
        // Change the host's room status to 'waiting'
        rooms[data.gameId].status = 'waiting';
        // Update the rooms listing for everyone in 'room1' AKA main chat room
        // Emit to 'room1' to update their global rooms list
        io.to('room1').emit('updateRooms', rooms, 'room1');
    }



























    /*******************************
     *       PLAYER FUNCTIONS      *
     *******************************/

    // A user has clicked on a specific game room to enter that game  =================================================
    // ================================================================================================================
    function playerJoinGame(data) {
        console.log(':::::::::::::::::  playerJoinGame Function  :::::::::::::::'.cyan);
        console.log('Player ' + data.playerInfo.display_name + 'attempting to join game: '.green + data.gameId );

        // Set the currentGameId for this player to be the game ID they are attempting to join
        socket.gameVars.currentGameID = data.gameId;

        // Update the player's room (client side) to be the game room ID they are attempting to join
        socket.emit('updateRooms', rooms, socket.gameVars.currentGameID);

        // Leaving 'room1' because players can only join games from 'room1'
        //noinspection JSCheckFunctionSignatures
        socket.leave('room1');
        socket.join(socket.gameVars.currentGameID);
        socket.room = socket.gameVars.currentGameID;

        // Emit an event notifying the clients that the player has joined the room. (ONLY HOST WILL USE THIS)
        // Add an 'enter' status so the host knows the player is joining
        data.status = 'enter';
        io.to(data.gameId).emit('playerJoinedRoom', data);
    }


    // A PLAYER has clicked on 'Back to Profile' to exit the game  ====================================================
    // ================================================================================================================
    function playerLeftGame(data) {
        console.log(':::::::::::::::::  playerLeftGame Function  :::::::::::::::'.cyan);
        console.log('Player ' + data.playerInfo.display_name + 'attempting to leave game: '.red + data.gameId );

        // Emit an event notifying the clients that the player has left the room. (ONLY HOST WILL USE THIS)
        // Add an 'exit' status so the host knows the player is leaving
        data.status = 'exit';
        io.to(data.gameId).emit('playerLeftRoom', data);

        // Update the player's room (client side) to 'room1' (main chat)
        io.to(socket.id).emit('updateRooms', rooms, 'room1');

        // Leave the game room and rejoin 'room1' (main chat)
        //noinspection JSCheckFunctionSignatures
        socket.leave(socket.room);
        socket.join('room1');
        socket.room = 'room1';
        socket.gameVars.currentGameID = null;
        resetGameVars();
    }


    // A PLAYER has clicked on 'Exit Game' to exit the game after the host has left ===================================
    // ================================================================================================================
    function playerExitGame(data) {
        console.log(':::::::::::::::::  playerExitGame Function  :::::::::::::::'.cyan);
        console.log('Player ' + data.playerInfo.display_name + 'attempting to leave game: '.red + data.gameId );

        // Update the player's room (client side) to 'room1' (main chat)
        io.to(socket.id).emit('updateRooms', rooms, 'room1');

        // Leave the game room and rejoin 'room1' (main chat)
        //noinspection JSCheckFunctionSignatures
        socket.leave(socket.room);
        socket.join('room1');
        socket.room = 'room1';
        socket.gameVars.currentGameID = null;
        resetGameVars();
    }
























};

