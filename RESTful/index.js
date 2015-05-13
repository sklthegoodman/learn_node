
/**
 * Created by wrynn on 2015/5/12.
 */
$(document).ready(function(){
    var postBtn = $('#postBtn'),
        getBtn = $('#getBtn'),
        unli = $('#list');
    var postInput = $('#postValue');
    postBtn.on('click',function(){
        var data = postInput.val();
        $.ajax('http://127.0.0.1:3000', {
            type: 'POST',
            data:data,
            success: function (data) {
                if(data == 1) {
                    getList(unli);
                }
            },
            dataType:'text'
        });
    });
    function getList(unli) {
        $.ajax('http://127.0.0.1:3000', {
            type: 'GET',
            data: '',
            success: function (data) {
                var jsonObj = JSON.parse(data);
                unli.empty();
                jsonObj.todoList.forEach(function (list, index) {
                    var template = $('#template').text();
                    template = template.replace('%', list);
                    template = template.replace(/index/g, index);
                    unli.append(template);
                });
            }
        });
    }
    getBtn.on('click', function () {
        getList(unli);
    });
    unli.on('click', function (event) {
        switch (event.target.className) {
            case 'deleteBtn':
                var index = $(event.target).attr('title');
                $.ajax('http://127.0.0.1:3000',{
                    type:'DELETE',
                    data:index,
                    success: function () {
                        unli.empty();
                        getList(unli);
                    }
                });
                break;
            case 'editBtn':
                var index = $(event.target).attr('title');
                var value = $(event.target).parent().find('.editValue').val().trim();
                var data = {index: index, value: value};
                if(value != '') {
                    $.ajax('http://127.0.0.1:3000',{
                        type:'PUT',
                        data:data,
                        success: function () {
                            getList(unli);
                        }
                    });
                }
        }
    });
});