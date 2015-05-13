/**
 * Created by wrynn on 2015/5/12.
 */
var http = require('http'),
    url = require('url'),
    query = require('querystring');
var todoList = [];
function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
}
http.createServer(function (req, res) {
    setHeaders(res);
    req.setEncoding('utf8');
    console.log(req.method);
    switch(req.method){
        case 'POST':
            var str = '';
            req.on('data', function (data) {
                str += data;
            });
            req.on('end', function () {
                todoList.push(str);
                res.end('1');
                console.log(todoList);
            });
            break;
        case 'GET':
            var jsonStr = '',
                jsonObj = {};
            var body = todoList.map(function (list, index) {
                return (index+1) + ')  ' + list;
            });
            jsonObj = {todoList: body};
            jsonStr = JSON.stringify(jsonObj);
            res.setHeader('Content-Length',Buffer.byteLength(jsonStr));
            res.setHeader('content-type', 'text/plain;chaset="utf-8"');
            res.end(jsonStr);
            break;
        case 'OPTIONS':
            res.end('ok');
            break;
        case "DELETE":
            var str = '';
            req.on('data', function (data) {
                str += data;
            });
            req.on('end', function () {
                var index = parseInt(str);
                todoList.splice(index, 1);
            });
            res.end('deleted');
            break;
        case 'PUT':
            var str = '';
            req.on('data', function (data) {
                str += data;
            });
            req.on('end', function () {
                var jsonO = query.parse(str);
                todoList[parseInt(jsonO.index)] = jsonO.value;
            });
            res.end('putted');
    }
}).listen(3000);