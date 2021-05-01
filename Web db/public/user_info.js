window.onload = function(){
	userInfo();
}
function userInfo(){
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			document.getElementById("username").innerHTML = user.email;
			console.log(user);
		}
	})
}