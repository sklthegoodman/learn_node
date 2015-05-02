//modules dependencies
var fs = require('fs'),
    stdin = process.stdin,
    stdout = process.stdout;
//main
fs.readdir(process.cwd(),function(err,files){
    console.log();
    if(!file.length) {
        return console.log("    \033[31m No files to show!\033[39m\n");
    }
    console.log('Select which file or directory you want to see\n');
    var stats = [];
    function file(i){
        var filename = files[i];
        fs.stat(__dirname+'/'+filename,function(err,stat){
            stats[i] = stat;
            if(stat.isDirectory()){
                console.log('    '+i+'  '+filename+'/');
            }else {
                console.log('    '+i+'  '+filename);
            }
            i++;
            if(i==files.length){
                read();
            }else{
                file(i);
            }
        });
        function read(){
            console.log('');
            stdout.write("Enter your choice:");
            stdin.resume();
            stdin.setEncoding('utf8');
            stdin.on('data', function (data) {
                var filename = files[Number(data)];
                if (!filename) {
                    process.stdout.write("Enter your choice:");
                } else {
                    stdin.pause();
                    if(stats[Number(data)].isDirectory()){
                        fs.readdir(__dirname+'/'+filename, function (err,files) {
                            console.log('');
                            console.log('('+files.length+'个文件)');
                            files.forEach(function(file){
                                console.log('  -'+file);
                            });
                            console.log('');
                        });
                    }else{
                        fs.readFile(__dirname+'/'+filename,'utf8',function(err,data){
                            console.log(data);
                        });
                    }
                }
            });
        }
    }
    file(0);
});