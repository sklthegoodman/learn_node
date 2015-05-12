/**
 * Created by wrynn on 2015/5/12.
 */
$(document).ready(function(){
    var postBtn = $('#postBtn'),
        getBtn = $('#getBtn');
    var postInput = $('#postValue');
    postBtn.on('click',function(){
        var data = postInput.val();
        $.ajax('http://127.0.0.1:3000', {
            type: 'POST',
            data:data,
            success: function (data) {
                if(data == 1) {
                    alert('Added!');
                }
            },
            dataType:'text'
        });
    });
    getBtn.on('click', function () {
        $.ajax('http:127.0.0.1:3000',{
            type:'GET',
            data:'',
            success:function(data) {
                var jsonObj = JSON.parse(data);
                var unli = $('#list');
                unli.empty();
                jsonObj.todoList.forEach(function (list, index) {
                    unli.append('<li>' + list + '</li>');
                });
            }
        });
    });
});