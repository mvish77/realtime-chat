const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
    },
});

let users = {}

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-joined', name)
        socket.broadcast.emit('all-users',users)
        socket.emit('all-users',users)
    })

    

    socket.on('send', message => {
        socket.broadcast.emit('receive', { name: users[socket.id], message: message })
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('leave',users[socket.id])
        delete users[socket.id]
        socket.broadcast.emit('all-users',users)
        socket.emit('all-users',users)
    })


})