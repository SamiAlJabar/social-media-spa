var imageFile;
$(function() {
    $(document).on("change",".uploadFile", function()
    {
        $('.imagePreview').show();
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        if (/^image/.test( files[0].type)){ // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url("+this.result+")");
            }
        }
        imageFile = files[0];
    });
  });

function postSubmit() {
    var realImageName = document.querySelector('#realImageName');
    // document.getElementById("postForm").submit();
    var formData = document.getElementById("postForm").elements;
    
    if(formData['message'].value == '') {
        alert('Please enter a text!');
        return;
    }
    if(!realImageName.files[0]) {
        alert('Please upload an image for sharing!');
        return;
    }
    var data = new FormData();
    data.set('message', formData['message'].value);
    data.set('createdBy', localStorage.getItem('username'));
    data.append('image', realImageName.files[0]);
    console.log(formData['message'].value);
    console.log(realImageName.files[0]);
    jQuery.ajax({
        url: '/profilePictureUpload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
            alert('Post uploaded successfully!');
            
            $('.imagePreview').hide();
            formData['message'].value = '';
            loadNewsfeedHTML();
        }
    });
}

async function postComment(postId) {
    var formData = document.getElementById("commentForm_"+postId).elements;
    if(formData['comment'].value == '') {
        alert('Please enter a comment!');
        return;
    }
    jsonData = {
        username : localStorage.getItem('username'),
        comment  : formData['comment'].value,
        postId   : postId
    }
    await $.post("/postComment", jsonData, function(data, status){
        console.log(data);
        if(data.errno) {
            alert(data.sqlMessage);
        } else {
            formData['comment'].value = '';
            alert('Comment posted successfully!');
        }
    });
}

async function showComments(postId) {
    document.getElementById('commentDisplay_'+postId).innerHTML = '';
    await $.get("/getComments?postId="+postId, function(data, status){
        console.log(data);
        if(data.errno) {
            alert(data.sqlMessage);
        } else {
            if(data.length > 0) {
                data.forEach(element => {
                    document.getElementById('commentDisplay_'+postId).innerHTML += '<div><p><b>'+element.username+'</b></p><p>'+element.createdDate+'</p><h4>'+element.comment+'</h4></div>'; 
                });
            } else {
                document.getElementById('commentDisplay_'+postId).innerHTML = '<b style="color: red">No comments!</b>';
            }
        }
    });
}

async function searchUserPosts(option) {
    if(option == 'reset') {
        document.getElementById('userPosts').innerHTML = '';
        $.get("/getPosts", function(data, status){
            postData = data;
            console.log(data);
            data.reverse();
            data.forEach(element => {
                document.getElementById('userPosts').innerHTML += '<li class="col-md-12" style="padding-bottom: 50px; display: inline-block;"> <div class="col-md-6"> <img style="max-height: 250px;" src="'+element.postUrl+'" alt="post_image"> </div> <div class="col-md-6"> <form id="commentForm_'+element.id+'"> <h4>'+element.createdBy+'</h4> <p>'+element.createdDate+'</p> <h3>'+element.message+'</h3> <input type="text" placeholder="Enter a comment ..." name="comment" required> <button class="btn btn-primary" type="button" onclick="postComment('+element.id+');" style="padding: 10px; width: 200px; margin-right: 15px;">Post</button> <button class="btn btn-secondary" type="button" onclick="showComments('+element.id+');" style="padding: 10px; width: 200px;">Show Comments</button><br/><br/><div id="commentDisplay_'+element.id+'"></div><br/><br/></form> </div> </li>';    
            });
        });
    } else {
        var searchedUser = document.getElementById('searchUser').value;
        var flag = false;
        if(!searchedUser) {
            alert('Please enter a keyword!');
            return;
        }
        document.getElementById('userPosts').innerHTML = '';
        await postData.forEach(element => {
            if(element.createdBy.toUpperCase() == searchedUser.toUpperCase()) {
                flag = true;
                document.getElementById('userPosts').innerHTML += '<li class="col-md-12" style="padding-bottom: 50px; display: inline-block;"> <div class="col-md-6"> <img style="max-height: 250px;" src="'+element.postUrl+'" alt="post_image"> </div> <div class="col-md-6"> <form id="commentForm_'+element.id+'"> <h4>'+element.createdBy+'</h4> <p>'+element.createdDate+'</p> <h3>'+element.message+'</h3> <input type="text" placeholder="Enter a comment ..." name="comment" required> <button class="btn btn-primary" type="button" onclick="postComment('+element.id+');" style="padding: 10px; width: 200px; margin-right: 15px;">Post</button> <button class="btn btn-secondary" type="button" onclick="showComments('+element.id+');" style="padding: 10px; width: 200px;">Show Comments</button><br/><br/><div id="commentDisplay_'+element.id+'"></div><br/><br/></form> </div> </li>';    
            }
        });
        if(flag == false) {
            document.getElementById('userPosts').innerHTML += '<h3 style="color: red"><b>No user found!</b></h3>';    
        }
    }
    
}