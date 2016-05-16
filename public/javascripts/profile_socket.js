
var socket = io('https://rylan.coffee/first_express_app/socket.io', {path: '/first_express_app/socket.io'});
    
var inputBox = $('#m'); 
var listBox = $('#messages'); 

$().ready(function () {
    socket.emit('user-login', userString); 
}); 

$('#mybtn').click(function(){
    var msg = inputBox.val(); 
    console.log('Clicked button, sending: ' + msg); 
    socket.emit('chat message', msg); 
    inputBox.val('');
    return false;
});
 
socket.on('user-login', function (msg) {
    listBox.append($('<li>').text(msg + " logged in")); 
});

socket.on('user-logout', function (msg) {
    listBox.append($('<li>').text("Someone logged out")); 
});

socket.on('chat message', function(msg) {
    console.log('Received message: ' + msg);
    $('#messages').append($('<li>').text(msg));
});
