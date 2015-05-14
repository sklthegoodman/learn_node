var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    join = require('path').join;
var root = __dirname;
http.createServer(function (req, res) {
    var query = url.parse(req.url).pathname;
    var path = join(root, query);
    if(query == '/'){
        var stream = fs.createReadStream(root + '/public/index.html');
        stream.pipe(res);
        stream.on('error', function () {
            res.statusCode = 500;
            res.end('Server Error');
        });
    }else{
        fs.stat(path, function (err, stat) {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.statusCode = 404;
                    res.end('Not found');
                } else {
                    res.statusCode = 500;
                    res.end('Server Error');
                }
            } else {
                res.setHeader('Content-Length', stat.size);
                var stream = fs.createReadStream(path);
                stream.pipe(res);
                stream.on('error', function () {
                    res.statusCode = 500;
                    res.end('Server Error');
                });
            }
        });
    }
}).listen('3000');