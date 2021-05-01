/*/////////
Hidden Menu
/////////*/
function openNav() {
	if(window.innerWidth >= 576){
		document.getElementById("mySidebar").style.width = "250px";
	}
	else{
		document.getElementById("mySidebar").style.width = "100%";
	}
	document.getElementById("openNav").style.opacity = "0";
}
function closeNav() {
  	document.getElementById("mySidebar").style.width = "0";
  	document.getElementById("openNav").style.opacity = "1";
}
/*//////////////////
console database
*///////////////////
var ref = firebase.database().ref("test");
ref.on('value', (snapshot) =>{
	const data = snapshot.val();
	console.log(data);
	console.log(Object.keys(data));
	}
);
/*//////////////////
Sign in - Sign out
*///////////////////
function register(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	if(email.lenght < 6 || password.lenght < 6){
		alert("Email และ Password ต้องมากกว่า 6 ตัวอักษร");
		return;
	}
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
	    var errorCode = error.code;
	    var errorMessage = error.message;

	    if (errorCode == 'auth/email-already-in-use') {
	        alert("Email นี้ถูกใช้งานแล้ว");
	    }else{
	        alert(errorMessage);
	    }
  	}).then(function (check){
  		if(check){
  			document.getElementById("email").value = "";
	  		document.getElementById("password").value = "";
	  	  	alert("Register Complete");
	  	  	// window.location.href = "index.html";
	  	}
  	});
}

window.onload = function(){
	initUser();
}
function initUser(){
	firebase.auth().onAuthStateChanged(function (user) {
		//User Log in
		if (user) {
			console.log(user.email);
			document.getElementById("sign").textContent = "Sign Out";
			document.getElementById("nosign").style.display = "none";
			document.getElementById("insign").style.display = "block";
			let x = document.querySelectorAll("#headeruser");
			for (var i in x) {
				x[i].innerHTML = user.email;
			}
			document.getElementById("hidsign").innerHTML = '<a onclick="sign()">Log out</a>';
		}
		else{
			document.getElementById("sign").textContent = "Sign in";
			document.getElementById("nosign").style.display = "block";
			document.getElementById("insign").style.display = "none";
			let x = document.querySelectorAll("#headeruser");
			for (var i in x) {
				x[i].innerHTML = "";
			}
			document.getElementById("hidsign").innerHTML = '<a href="register.html">Register</a><a href="login.html">Log in</a>';
		}
	})
}
function sign(){
	if(firebase.auth().currentUser){
		firebase.auth().signOut();
		console.log("Bye");
	}
	else{
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		if(email.lenght < 6 || password.lenght < 6){
			alert("Email และ Password ต้องมากกว่า 6 ตัวอักษร");
			return;
		}
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		    var errorCode = error.code;
		    var errorMessage = error.message;

		    if (errorCode == 'auth/wrong-password') {
		        alert("Password ไม่ถูกต้อง");
		    }else{
		        alert(errorMessage);
		    }
	  	}).then(function(check){
	  		if(check){
	  			// window.location.href = "index.html";
	  		}
	  	})
	}
}
function resetpass(){
	var email = document.getElementById("email").value;
	firebase.auth().sendPasswordResetEmail(email).then(function(){
		alert("Password Reset Email sent!");
	}).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;

	    if (errorCode == 'auth/invalid-email') {
	        alert(errorMessage);
	    }else if(errorCode == 'auth/user-not-found'){
	        alert(errorMessage);
	    }
	});
}
/**/
let addList = () => {
    var title = document.getElementById("int").value;
    var txt = document.getElementById("txt").value;
    const firebaseRef = firebase.database().ref("test");
    firebaseRef.push({
        title: title,
        text: txt,
    });

    alert("Add list Complete!");
    document.getElementById("int").value = "";
    document.getElementById("txt").value = "";
};