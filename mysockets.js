module.exports = function (nsp) {
    return function (socket) {
        socket.on('user-login', function (msg) {
            nsp.emit('user-login', msg); 
        }); 
        console.log('SOCKET.IO: A user connected!'); 
        socket.on('chat message', function (msg) {
            console.log('SOCKET.IO: Chat message: '+msg);
            nsp.emit('chat message', msg);
        });
        socket.on('disconnect', function () {
            nsp.emit('user-logout', 1);  
            console.log('SOCKET.IO: User disconnected'); 
        }); 
    }
}
