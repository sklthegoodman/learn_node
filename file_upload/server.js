/**
 * Created by wrynn on 2015/5/14.
 */
var http = require('http'),
    formidable = require('formidable'),
    fs = require('fs');
var root = __dirname;
http.createServer(function (req, res) {
    if (req.url != '/upload') {
        var stream = fs.createReadStream(root + '/index.html');
        stream.pipe(res);
    }else{
        var form = new formidable.IncomingForm();
        form.uploadDir = root + '/upload_dir';
        form.parse(req, function (err,filed,file) {
            if(!err) {
                var file = file.file;
                var type = file.name.split('.');
                type = type[type.length-1];
                fs.rename(file.path, file.path + '.' + type,function(){
                    if(err) {
                        throw new Error('杀');
                    }
                });
                res.end('OK');
            }
        });
        /*form.on('progress',function(bytesReceived,bytesExpected){
            console.log(bytesReceived);
        });*/
        /*form.on('fileBegin', function (name,file) {
            file.name = 'aa.jpg';
            console.log(name);
            console.log(file);
        });*/
    }
}).listen(3000);