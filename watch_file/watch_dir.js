/**
 * Created by wrynn on 2015/5/11.
 */
var fs = require('fs');
function Watcher (watchDir,processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}
Watcher.prototype.watch = function () {
    var watcher = this;
    fs.watchFile(watcher.watchDir, function () {
        fs.readdir(watcher.watchDir, function (err,files) {
            if(err) return;
            files.forEach(function (file) {
                fs.readFile(watcher.watchDir + '/' + file, function (err,data) {
                    var fileData = data.toString();
                    fs.writeFile(watcher.processedDir+'/'+file.toLowerCase(),fileData);
                });
            });
        });
    });
};
var watchDir = './watch',
    processedDir = './done';
var watcher = new Watcher(watchDir,processedDir);
watcher.watch();
console.log('start!!!');