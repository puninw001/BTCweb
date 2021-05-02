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
			console.log(user.uid);
			console.log(window.location.href);
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
function creOrder(){
	var type = document.getElementById("type").value;
    var price = document.getElementById("price").value;
    var amount = document.getElementById("amount").value;
    var bank = document.getElementById("bank").value;
    var topic = document.getElementById("topic").value;
    var detail = document.getElementById("detail").value;
    if((amount == "") || (price == "") || (bank == "")){
    	alert("Price, Amount and Bank must be fill");
    	return;
    }
    firebase.auth().onAuthStateChanged(function (user){
    	if(user){
			const firebaseRef = firebase.database().ref("test");
		    firebaseRef.push({
		    	type: type,
		        price: price,
		        amount: amount,
		        bank: bank,
		        topic: topic,
		        detail: detail,
		        uid: user.uid,
		        email: user.email,
		    });
		    alert("Create Order Complete!");
		    window.location.href = "index.html";
		}
		else{
			alert("Please Sign in");
			window.location.href = "login.html";
		}
    });
}

function update(){
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		console.log(data);
		let key = Object.keys(data);
		let chk;
		let buyc = "";
		let sellc = "";
		console.log(key);
		for (let i in key) {
			console.log(key[i]);
			chk = key[i];
			if (data[chk].type == "buy"){
				buyc += `<div class="row" style="border: 1px black solid;">
							<div class="col-2">
								<p>${data[chk].price}</p>
							</div>
							<div class="col-3">
								<p>${data[chk].amount}</p>
							</div>
							<div class="col-2">
								<p>${data[chk].bank}</p>
							</div>
							<div class="col-5">
								<p>${data[chk].email}</p>
							</div>
						</div>`;
			}
			else{
				sellc += `<div class="row" style="border: 1px black solid;">
							<div class="col-2">
								<p>${data[chk].price}</p>
							</div>
							<div class="col-3">
								<p>${data[chk].amount}</p>
							</div>
							<div class="col-2">
								<p>${data[chk].bank}</p>
							</div>
							<div class="col-5">
								<p>${data[chk].email}</p>
							</div>
						</div>`;
			}
		}
		document.getElementById("buyc").innerHTML = buyc;
		document.getElementById("sellc").innerHTML = sellc;
	});
}