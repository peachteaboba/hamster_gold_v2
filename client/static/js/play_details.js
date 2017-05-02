/**
 * Created by anndyfeng1 on 2/24/16.
 */
$(document).ready(function (){
    //alert('hello from the other side');


    // this triggers the connection event in our server! ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    var socket = io.connect();

    var log = document.getElementById("log");
    var p1 = document.getElementById("p1");
    var p2 = document.getElementById("p2");
    var ps1 = document.getElementById("ps1");
    var ps2 = document.getElementById("ps2");
    var name;


    var player_id;
    var world;
    var ready11 = 0;
    var ready22 = 0;
    var game_start = 0;




    // button styles ------------------------------------------------------------------------------
    $(document).on('mouseenter', 'button', function(){
        $(this).toggleClass('blue');
    });
    $(document).on('mouseout', 'button', function(){
        $(this).toggleClass('blue');
    });



    // --------------------------------------------------------------------------------------------



    // CHATROOM ------------------------------------------------------------------------------------

    if (name === undefined){
        $( "#game-wrapper" ).hide();
    }



    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: New user submitted
    $('.add-user-form').submit(function (){
        var formData = $('form').serialize();
        socket.emit("new_user_submitted", formData);
        $( "#nameForm" ).hide();
        $( "#game-wrapper" ).show();
        return false;
    });  // ::::::::::::::::::::::::::::::::::::::::::::::::::::





    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: New message submitted
    $('.add-message-form').submit(function (){
        var formData = $('form').serialize();
        socket.emit("new_message_submitted", formData);
        $(".add-message-form")[0].reset();
        return false;
    });  // ::::::::::::::::::::::::::::::::::::::::::::::::::::










    // PROCESS RESPONSE FROM THE SERVER ::::::::::::::::::::::::::: Log new user
    socket.on('new_user', function (data, player2, w, p2s){

        // display world :::::::::
        world = w;
        displayWorld(); //::::::::


        name = data.name;


        if(player2 != undefined) {
            p2.innerHTML = '<h3>player 2:<span> ' + player2 + '</span></h3>';
            ps2.innerHTML = '<h1>Score:<span> ' + p2s + '</span></h1>';
        }

        log.innerHTML = '<p>New user:<span> ' + name + ' </span>has joined the chat</p>' + log.innerHTML;
    });  // :::::::::::::::::::::::::::::::::::::::::::::::::::








    // PROCESS RESPONSE FROM THE SERVER ::::::::::::::::::::::::::: Log new message
    socket.on('new_message', function (data){

        log.innerHTML = '<p><span> ' + data.name + ': </span> ' + data.message + '</p>' + log.innerHTML;
    });   // :::::::::::::::::::::::::::::::::::::::::::::::::::









    // PROCESS RESPONSE FROM THE SERVER ::::::::::::::::::::::::::: Generate content for new users (only happens once)
    socket.on('generate_content', function (data, player1, player2, w, id, p1s, p2s){

        // record player id (1 = player1, 2 = player2, 0 = spectator)
        player_id = id;
//                console.log(player_id);


        // display world
        world = w;
        displayWorld();

        // display player info
        p1.innerHTML = '<h3>player 1:<span> ' + player1 + '</span></h3>';
        ps1.innerHTML = '<h1>Score:<span> ' + p1s + '</span></h1>';

        if(id == 1){
            p1.innerHTML = p1.innerHTML + '<button id="ready01">ready</button>';
        }






        if(player2 != undefined) {
            p2.innerHTML = '<h3>player 2:<span> ' + player2 + '</span></h3>';
            ps2.innerHTML = '<h1>Score:<span> ' + p2s + '</span></h1>';


            if(id == 2){
                p2.innerHTML = p2.innerHTML + '<button id="ready02">ready</button>';
            }





        }

        // display previous log content
        var length = Object.keys(data).length;
        for (var i = 0; i<length; i++){
            log.innerHTML =  '<p><span> ' + data[i].name + ': </span> ' + data[i].message + '</p>'+ log.innerHTML;
        }
    });    // :::::::::::::::::::::::::::::::::::::::::::::::::::




















    // PACMAN GAME ------------------------------------------------------------------------------------




    function displayWorld(){
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
                    output += "<div class='pacmanL'></div>";  // pacman facing left
                }
                if(world[i][j] == 4){
                    output += "<div class='pacmanR'></div>";   // pacman facing right
                }
                if(world[i][j] == 5){
                    output += "<div class='pacmanU'></div>";   // pacman facing up
                }
                if(world[i][j] == 6){
                    output += "<div class='pacmanD'></div>";   // pacman facing down
                }
            }
            output += "</div>";
        }
        document.getElementById('world').innerHTML = output;
    }







    // This gets triggered when any user presses a key
    document.onkeydown = function(e){

        console.log(game_start);
        if(game_start == 1) {

            console.log(e.keyCode);
            console.log(player_id);


            if (e.keyCode == 39 || e.keyCode == 68) {
                // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move right
                socket.emit("move_right", player_id);
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::
            }


            if (e.keyCode == 37 || e.keyCode == 65) {
                // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move left
                socket.emit("move_left", player_id);
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::
            }

            if (e.keyCode == 38 || e.keyCode == 87) {
                // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move up
                socket.emit("move_up", player_id);
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::
            }

            if (e.keyCode == 40 || e.keyCode == 83) {
                // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Move down
                socket.emit("move_down", player_id);
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::
            }
        }
    }



    // PROCESS RESPONSE FROM THE SERVER ::::::::::::::::::::::::::: Pac-man moved, update content.
    socket.on('move', function (w, p1s, p2s, p2_here, winner){
        // display new world
        world = w;
        displayWorld();

        if (winner == 1){
            ps1.style.border = "5px solid #3CFA82";
            log.innerHTML = '<h3><span>PLAYER 1 </span> WINS!</h3>' + log.innerHTML;
        }
        if (winner == 2){
            ps2.style.border = "5px solid #3CFA82";
            log.innerHTML = '<h3><span>PLAYER 2 </span> WINS!</h3>' + log.innerHTML;
        }


        // display new player info
        ps1.innerHTML = '<h1>Score:<span> ' + p1s + '</span></h1>';
        if(p2_here) {
            ps2.innerHTML = '<h1>Score:<span> ' + p2s + '</span></h1>';
        }
    });   // :::::::::::::::::::::::::::::::::::::::::::::::::::




    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Player 1 Ready Send
    $(document).on("click", "#ready01", function() {


        console.log("p1 ready");
        socket.emit("player_1_ready");

        return false;

    });

    // EMIT EVENT TO THE SERVER ::::::::::::::::::::::::::: Player 2 Ready Send
    $(document).on("click", "#ready02", function() {


        console.log("p2 ready");
        socket.emit("player_2_ready");

        return false;

    });




    // PROCESS RESPONSE FROM THE SERVER ::::::::::::::::::::::::::: READY CHECK
    socket.on('ready_check', function (ready1, ready2, ready){
        var ready01 = document.getElementById("ready01");
        var ready02 = document.getElementById("ready02");

        if (ready1 == 1 && ready11 == 0) {
            if (player_id == 1 && ready01) {
                ready01.setAttribute("id", "ready1");
            }
            if(!ready01){
                p1.innerHTML = p1.innerHTML + '<button id="ready1">ready</button>';
            }
            ready11 = 1;
        }





        if (ready2 == 1 && ready22 == 0) {
            if (player_id == 2 && ready02) {
                ready02.setAttribute("id", "ready2");
            }
            if(!ready02){
                p2.innerHTML = p2.innerHTML + '<button id="ready2">ready</button>';
            }
            ready22 = 1;
        }







        if (ready == 1){
            game_start = 1;
        }
        console.log(ready);
        console.log(game_start);


    });   // :::::::::::::::::::::::::::::::::::::::::::::::::::








    // ------------------------------------------------------------------------------------------------

});