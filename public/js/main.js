var postData;

$(async function() {
    // CHECK LOGIN
    // var user;
    // await $.get("/checkLogin", function(data, status){
    //     user = data;
    // });
    // alert(user);
    var includesLogin = $('[html-pages]');
    jQuery.each(includesLogin, function(){
        var file;
        if($(this).data('include') == 'register') {
            file = '/register.html';
        } else {
            file = '/login.html';
        }
        console.log(file);
        $(this).load(file);
    });
    return;

    // LOADING HEADER AND FOOTER ON LOAD
    var includes = $('[data-include]');
    jQuery.each(includes, function() {
        var file = '/common/' + $(this).data('include') + '.html';
        console.log(file);
        $(this).load(file);
    });
    
    // LOADING NEWSFEED ON LOAD
    var includesTwo = $('[html-pages]');
    jQuery.each(includesTwo, function(){
        var file = '/newsfeed.html';
        console.log(file);
        $(this).load(file);
    });
});

function changeMenu(menu) {
    var includes = $('[html-pages]');
    jQuery.each(includes, function() {
        var file;
        if(menu == 'logout') {
            localStorage.removeItem('username');
            file = '/login.html';
        } else {
            if(localStorage.getItem('username')) {
                file = '/' + menu + '.html';
            } else if(menu == 'register' || menu == 'login') {
                file = '/' + menu + '.html';
            } else {
                alert('You need to login first!');
                file = '/login.html';
            }
        }
        console.log(file);
        $(this).load(file);
        if(menu == 'newsfeed') {
            setTimeout(() => {
                loadNewsfeedHTML();
            }, 1000);
        }
    });
}

function loadNewsfeedHTML() {
    var htmlConstruct = '';
    document.getElementById('userPosts').innerHTML = '';
    document.getElementById('welcomeMessage').innerHTML = 'Welcome '+localStorage.getItem('username');
    $.get("/getPosts", function(data, status){
        postData = data;
        console.log(data);
        data.reverse();
        data.forEach(element => {
            document.getElementById('userPosts').innerHTML += '<li class="col-md-12" style="padding-bottom: 50px; display: inline-block;"> <div class="col-md-6"> <img style="max-height: 250px;" src="'+element.postUrl+'" alt="post_image"> </div> <div class="col-md-6"> <form id="commentForm_'+element.id+'"> <h4>'+element.createdBy+'</h4> <p>'+element.createdDate+'</p> <h3>'+element.message+'</h3> <input type="text" placeholder="Enter a comment ..." name="comment" required> <button class="btn btn-primary" type="button" onclick="postComment('+element.id+');" style="padding: 10px; width: 200px; margin-right: 15px;">Post</button> <button class="btn btn-secondary" type="button" onclick="showComments('+element.id+');" style="padding: 10px; width: 200px;">Show Comments</button><br/><br/><div id="commentDisplay_'+element.id+'"></div><br/><br/></form> </div> </li>';    
        });
    });
}
