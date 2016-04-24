/*jshint browser: true */
/*global io: false */
"use strict";
// Inicjalizacja UI
window.addEventListener("load", function (event) {
    var status = document.getElementById("status");
    var open = document.getElementById("open");
    var close = document.getElementById("close");
    var send = document.getElementById("send");
    var text = document.getElementById("text");
    var message = document.getElementById("message");
    var name = document.getElementById("name");
    var room = document.getElementById("room");
    var socket;
    var history = $('#history');
    var wiadomosc;
    status.textContent = "Brak połącznia";
    close.disabled = true;
    send.disabled = true;

    // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
    open.addEventListener("click", function (event) {
        open.disabled = true;
        socket = io.connect('http://' + location.host);

        socket.on('connect', function () {
            close.disabled = false;
            send.disabled = false;
            status.src = "img/bullet_green.png";
            console.log('Nawiązano połączenie przez Socket.io');
            name = document.getElementById("name");
            room = document.getElementById("room");
            if (name.value == "") {
                name.value = "Anonymous";
            }
            room.disabled = true;
            name.disabled = true;
            var msg  = "user " + name.value +" connected to chat!";
            socket.emit('message', msg);
        });
        socket.on('disconnect', function () {
            open.disabled = false;
            status.src = "img/bullet_red.png";
            console.log('Połączenie przez Socket.io zostało zakończone');
        });
        socket.on("error", function (err) {
            message.textContent = "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'";
        });
        socket.on("echo", function (data) {
            // message.textContent.append($('<li>').text(data));
            $('#message').append($('<li>').text(data));
        });
    });

    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.addEventListener("click", function (event) {
        close.disabled = true;
        send.disabled = true;
        message.textContent = "";
        socket.disconnect();
        name.disabled = false;
        room.disabled = false;
    });

    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    send.addEventListener("click", function (event) {
        wiadomosc =  name.value+": "+ text.value;
        socket.emit('message', wiadomosc);
        console.log('Wysłałem wiadomość: ' + text.value);

    });
});
