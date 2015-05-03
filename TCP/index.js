//module require
var net = require('net');
//create server
var count = 0,
    users = {};
var server = net.createServer(function (connect) {
    count++;
    var nickName;
    connect.setEncoding('utf8');
    connect.write(
        " > 我Welcome to TCP\n"+ " > "+count+" people online\n"+ " > Please enter you name\n"
    );
    connect.on('close', function () {
        count--;
        if(!nickName){
            delete users[nickName];
            for(var i in users) {
                users[i].write(nickName + ' left the room');
            }
        }
    });
    connect.on('data', function (data) {
        data = data.replace('\r\n','');
        if(!nickName){
            if(users[data]){
                console.log('this nickname is already used,please try again.');
                return;
            }else{
                nickName = data;
                users[nickName] = connect;
                for(var i in users){
                    users[i].write(nickName + "joined the room\n");
                    console.log(nickName);
                }
            }
        }else{
            for(var i in users){
                if(i != nickName){
                    users[i].write(nickName+':'+data);
                }
            }
        }
    });
});
server.listen(3000,function(){
    console.log("connected in 3000");
});