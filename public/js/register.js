async function register() {
    var formData = document.getElementById("registrationForm").elements;
    jsonData = {
        username : formData['username'].value,
        password : formData['password'].value,
        gender   : formData['gender'].value,
        country  : formData['country'].value
    }
    await $.post("/register", jsonData, function(data, status){
        console.log(data);
        if(data.errno) {
            alert(data.sqlMessage);
        } else {
            alert('User registered successfully!');
        }
    });
}