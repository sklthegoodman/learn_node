var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    cache = {},
    chatSever = require('./lib/chat_server');
var server = http.createServer(function (req,res) {
    var filePath = false;
    if(req.url == '/') {
        filePath = 'public/index.html';
    }else{
        filePath = 'public'+req.url;
    }
    var relPath = './'+filePath;
    serverStatic(res,cache,relPath);
});
server.listen(3000);
chatSever.listen(server);

function serverStatic(res,cache,relPath) {
    if(/*cache[relPath]*/false){
        sendFile(res, relPath, cache[relPath]);
    }else{
        fs.exists(relPath, function (exist) {
           if(exist){
               fs.readFile(relPath, function (err,file) {
                   if(err) {
                       send404(res);
                   }else{
                       cache[relPath] = file;
                       sendFile(res,relPath,file);
                   }
               });
           }else{
               send404(res);
           }
        });
    }
}
function send404(res){
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.end('Error 404:resourse not found!');
}
function sendFile(res,filePath,content) {
    res.writeHeader(
        200,
        {'Content-Type':mime.lookup(path.basename(filePath))}
    );
    res.end(content);
}