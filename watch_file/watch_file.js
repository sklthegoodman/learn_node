/**
 * Created by wrynn on 2015/5/9.
 */
var events = require('events'),
    fs = require('fs'),
    util = require('util');
function Watcher (watchDir,processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}
util.inherits(Watcher, events.EventEmitter);//本来想用事件发射器来监控，然后并没有用.
function watchIt(files, watcher) {
    files.forEach(function (file) {
        var dir = watcher.watchDir + '/' + file;
        fs.watchFile(dir, function (cur) {
            var fileData;
            fs.readFile(dir, function (err, data) {
                fileData = data.toString();
                fs.writeFile(watcher.processedDir + '/' + file, fileData, function () {
                    console.log('writed!'+cur.mtime);
                });
            });
        });
    });
}
Watcher.prototype.watch = function () {
    var watcher = this;
    fs.readdir(watcher.watchDir, function (err, files) {
        if(err) {
            throw err;
        }else{
            watchIt(files, watcher);
        }
    });
};
var watchDir = './watch',
    processedDir = './done';
var watcher = new Watcher(watchDir,processedDir);
watcher.watch();