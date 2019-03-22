async function login() {
    var formData = document.getElementById("loginForm").elements;
    var user;
    await $.get("/checkLogin?username="+formData['username'].value+"&password="+formData['password'].value, function(data, status){
        user = data;
    });
    if(user.length > 0) {
        // LOGGED IN SUCCESSFULLY
        // LOADING HEADER AND FOOTER
        localStorage.setItem("username", formData['username'].value);
        var includesHeaderFooter = $('[data-include]');
        jQuery.each(includesHeaderFooter, function() {
            var file = '/common/' + $(this).data('include') + '.html';
            console.log(file);
            $(this).load(file);
        });

        // NEWSFEED PAGE LOAD
        var includes = $('[html-pages]');
        jQuery.each(includes, function() {
            var file = '/newsfeed.html';
            console.log(file);
            $(this).load(file);
            setTimeout(() => {
                loadNewsfeedHTML();
            }, 100);
        });
    } else {
        // COULD NOT LOG IN
        alert('Wrong username or password!');
    }
}