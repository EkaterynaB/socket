$(function () {
    let socket = io.connect();
    let $messageForm = $('#messageForm');
    let $message = $('#message');
    let $chat = $('#chatWindow');
    let $usernameForm = $('#usernameForm');
    let $users = $('#users');
    let $username = $('#username');
    let $error = $('#error');
    let $quit = $('.quit');

    $usernameForm.submit(function (e) {
        console.log($username.val())
        e.preventDefault();
        socket.emit('new user', $username.val(), function (data) {
            if (data === true) {
                $('#namesWrapper').hide();
                $('#mainWrapper').show();
            } else {
                $error.html(data);
            }
        });
        $username.val('');
    });

    $quit.on('click', function(e) {
        //e.preventDefault();
        //socket.disconnect();
        //$('#namesWrapper').show();
        //$('#mainWrapper').hide();
        socket.emit('disconect');
    });

    socket.on('usernames', function (data) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += data[i] + '<br>';
        }
        $users.html(html);
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', $message.val());

        $message.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<strong>' + data.user + ': </strong>' + data.msg + '<br>');
    })
});