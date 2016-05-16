module.exports = function (nsp) {
    return function (socket) {
        console.log('SOCKET.IO: A user connected!'); 
        socket.on('chat message', function (msg) {
            console.log('SOCKET.IO: Chat message: '+msg);
            nsp.emit('chat message', msg);
        });
        socket.on('disconnect', function () {
            console.log('SOCKET.IO: User disconnected'); 
        }); 
    }
}
