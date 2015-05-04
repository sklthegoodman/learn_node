var socketio = require('socket.io'),
    io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {};
exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level',1);
    io.sockets.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};
function assignGuestName(socket,guestNumber,nickNames,namesUsed) {
    var name = 'Guest'+guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult',{
        name:name,
        success:true
    });
    namesUsed.push(name);
    return guestNumber+1;
}
function joinRoom(socket,room) {
    socket.join(room);
    socket.emit('joinResult', {room: room});
    currentRoom[socket.id] = room;
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joind '+room+'.'
    });
    var usersInRooom = io.sockets.clients(room);
    if(usersInRooom.length > 1) {
        var usersInRoomText = 'Users currently in '+room+':';
        for(var i in usersInRooom) {
            var userSocketId = usersInRooom[i].id;
            if(userSocketId != socket.id) {
                if(i>0) {
                    usersInRoomText += ',';
                }
                usersInRoomText += nickNames[userSocketId];
            }
        }
        usersInRoomText += '.';
        socket.emit('message',{
            text:usersInRoomText
        });
    }
}
function handleMessageBroadcasting(socket,nickNames) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ':' + message.text
        });
    });
}
function handleNameChangeAttempts(socket,nickNames,namesUsed) {
    socket.on('nameAttempt',function(name) {
        if(name.indexOf('Guest')==0) {
            socket.emit('nameResult',{
                success:false,
                message:'Name can not begin with "Guest".'
            });
        }else {
            if(namesUsed.indexOf(name)==-1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                nickNames[socket.id] = name;
                namesUsed.splice(previousNameIndex, 1);
                namesUsed.push(name);
                socket.emit('nameResult',{
                    success:true,
                    name:name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            }else{
                socket.emit('nameResult', {
                    success: false,
                    message:'That name is already used.'
                });
            }
        }
    });
}
function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        socket.broadcast.to(currentRoom[socket.id]).emit('message',{
            text:nickNames[socket.id] + '已经离开房间。'
        });
        joinRoom(socket, room.newRoom);
    })
}
function handleClientDisconnection(socket,nickNames,nameUsed) {
    socket.on('disconnect', function () {
        var name = nickNames[socket.id];
        var nameIndex = nameUsed.indexOf(name);
        delete nickNames[socket.id];
        nameUsed.splice(nameIndex,1);
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
            text: name+'已经离开房间'
        });
    })
}