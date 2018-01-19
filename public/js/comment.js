var prepage = 2;
var page = 1;
var comments = [];
var pages = 0;


//提交评论
$('#messageBtn').on('click', function () {
    if ($('#messageContent').val() == ''){
        return;
    }
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentId: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    });
});

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/api/comment',
    data: {
        contentId: $('#contentId').val()
    },
    success: function (responseData) {
        comments = responseData.data.reverse();
        renderComment();
    }
});

$('.comment-page').delegate('a', 'click', function () {
   if($(this).parent().hasClass('previous')){
       page--;
   } else {
       page++;
   }
   renderComment();
});


function renderComment(){

    $('.messageCount').html(comments.length + ' ');

    pages = Math.max(1,Math.ceil(comments.length / prepage));
    var start = (page-1) * prepage;
    var end = start + prepage;
    //end不能超过评论的长度
    end = Math.min(end, comments.length);

    var $lis = $('.comment-page li');
    $lis.eq(1).html( '<strong>' + page + ' / ' + pages + '</strong>').css('display','inline-block');

    if(page <= 1){
        $lis.eq(0).html('<span>没有上一页了</span>');
    }else{
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if(page >= pages){
        $lis.eq(2).html('<span>没有下一页了</span>');
    }else{
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if(comments.length == 0){
        $('.messageList').html('<div class="message"><p>还没有留言</p></div>');
    }else{
        var html = '';
        for(var i=start; i<end; i++){
            html += '<div class="message">' +
                '<p>' + comments[i].username + '<span class="em">' + formatDate(comments[i].postTime) + '</span></p>' +
                '<p>' + comments[i].content + '</p>' +
                '</div>';
        }
        $('.messageList').html(html);

    }
}

function formatDate(d){
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + toTwo(date1.getMonth()+1) + '月' +
        toTwo(date1.getDate()) + '日 ' + toTwo(date1.getHours()) + ":" +
        toTwo(date1.getMinutes()) + ":" + toTwo(date1.getSeconds());
};

function toTwo(time){
    if(time < 10){
        time = '0' + time;
    }
    return time;
};