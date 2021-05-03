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
	  	  	window.location.href = "index.html";
	  	}
  	});
}

window.onload = function(){
	initUser();
	countorder();
	readHistory();
	update();
	firebase.auth().onAuthStateChanged(function (user){
		if (user) {
			readProfile(user.uid);
		}
	})
}
function initUser(){
	firebase.auth().onAuthStateChanged(function (user) {
		//User Log in
		if (user) {
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
	  			window.location.href = "index.html";
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
let count = 0;
let dataOrder;
let keyOrder;
function countorder(){
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		dataOrder = data;
		keyOrder = key;
		for (let i in key){
			count += 1;
		}
		count += 1;
	});
}
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
		        noor: count,
		        isHave: true,
		        buyBy: "",
		        doneDate: "",
		        hash: "",
		        status: "incomplete",
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
		let key = Object.keys(data);
		let chk;
		let buyc = "";
		let sellc = "";
		console.log(count);
		for (let i in key) {
			console.log(key[i]);
			chk = key[i];
			console.log(data[chk].noor);
			if (data[chk].type == "buy" && data[chk].isHave){
				buyc += `<div class="row" style="border: 1px black solid;cursor: pointer;" onclick='ttt(${data[chk].noor})'>
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
			else if(data[chk].type == "sell" && data[chk].isHave){
				sellc += `<div class="row" style="border: 1px black solid;cursor: pointer;" onclick='ttt(${data[chk].noor})'>
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
function editpro(){
	var phone = document.getElementById("phone").value;
	var fb = document.getElementById("fb").value;
	var line = document.getElementById("line").value;
	var proimg = document.getElementById("proimg").value;
	var address = document.getElementById("address").value;
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
			const firebaseRef = firebase.database().ref("userinfo");
		    firebaseRef.push({
		    	phone: phone,
		        fb: fb,
		        line: line,
		        proimg: proimg,
		        address: address,
		        uid: user.uid,
		        email: user.email,
		    });
		    alert("Edit Profile Complete!");
		    window.location.href = "index.html";
		}
		else{
			alert("Please Sign in");
			window.location.href = "login.html";
		}
    });
}
function readProfile(idd){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		let add = "";
		let con = "";
		for(let i in key){
			chk = key[i];
			if(data[chk].uid == idd){
				add += `<div class="mid">
							<img src="img/address.png" class="logo1">
							<p>${data[chk].address}</p>
						</div>`;
				con += `<div class="mid">
							<img src="img/call.png" class="logo1">
							<p>${data[chk].phone}</p>
						</div><div class="mid">
							<img src="img/fb.png" class="logo1">
							<p>${data[chk].fb}</p>
						</div><div class="mid">
							<img src="img/line.png" class="logo1">
							<p>${data[chk].line}</p>
						</div><div class="mid">
							<img src="img/email.png" class="logo1">
							<p>${data[chk].email}</p>
						</div>`;
			}
		}
		document.getElementById("add").innerHTML = add;
		document.getElementById("con").innerHTML = con;
	});
}

let mem = "";

function ttt(num){
	console.log(num);
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		let inn = "";
		for (let i in key){
			chk = key[i];
			if(data[chk].noor == num){
				inn += `<div class="container">
							<h1 style="text-align:center;">Order No.${data[chk].noor}</h1>
							<h2 style="text-align:center;">Order: ${data[chk].type}</h2>
							<div class="row">
								<div class="col-12 col-lg-6">
									<div class="row">
										<div class="col-12 col-sm-4" style="border: 1px black solid;">
											<p>Price: ${data[chk].price}</p>
										</div>
										<div class="col-12 col-sm-4" style="border: 1px black solid;">
											<p>Amount: ${data[chk].amount}</p>
										</div>
										<div class="col-12 col-sm-4" style="border: 1px black solid;">
											<p>Bank: ${data[chk].bank}</p>
										</div>
									</div>
									<div class="row">
										<h4 style="margin-top:25px;margin-bottom:10px;">Topic text:</h4>
										<div class="col-12" style="border: 1px black solid;">
											<p>${data[chk].topic}</p>
										</div>
										<h4 style="margin-top:25px;margin-bottom:10px;">Detail text:</h4>
										<div class="col-12" style="border: 1px black solid;">
											<p>${data[chk].detail}</p>
										</div>
									</div>
								</div>
								<div class="col-12 col-lg-6">`
				hidmem(data[chk].uid);
				inn +=	mem + `</div>
							</div>
						</div>
						<button class="btn btn-primary mid" onclick="showSure(${data[chk].noor})" style="margin-top:30px;margin-bottom:30px;">DEAL!</button>`;
			}
		}
		document.getElementById("hidorder").innerHTML = inn;
		document.getElementById("hidorder").style.opacity = "1";
		document.getElementById("hidorder").style.zIndex = "100";
		document.getElementById("hidback").style.opacity = "0.7";
		document.getElementById("hidback").style.zIndex = "99";
	});
}
function hidmem(num){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		for (let i in key){
			chk = key[i];
			if(data[chk].uid == num){
				mem = `<h2 style="text-align:center;">${data[chk].email}</h2>
				<p><img src="img/call.png" class="logo1">&nbsp;: ${data[chk].phone}</p>
				<p><img src="img/fb.png" class="logo1">&nbsp;: ${data[chk].fb}</p>
				<p><img src="img/line.png" class="logo1">&nbsp;: ${data[chk].line}</p>
				<p><img src="img/uid.png" class="logo1">&nbsp;: ${data[chk].uid}</p>
				`;
			}
		}
	});
}
function clorder(){
	document.getElementById("hidorder").style.opacity = "0";
	document.getElementById("hidorder").style.zIndex = "-10";
	document.getElementById("hidback").style.opacity = "0";
	document.getElementById("hidback").style.zIndex = "-11";
	document.getElementById("hidsure").style.display = "none";
}
function showSure(num){
	document.getElementById("hidsure").style.display = "block";
	document.getElementById("hidsure").innerHTML = `<h4 style="margin-bottom: 20px">ต้องการยืนยันออเดอร์หรือไม่?</h4>
		<button onclick="accOrder(${num})" class="btn btn-success" style="margin-right: 50px">ยืนยัน</button>
		<button onclick="hidSure()" class="btn btn-danger">ยกเลิก</button>`;
}
function hidSure(){
	document.getElementById("hidorder").style.opacity = "0";
	document.getElementById("hidorder").style.zIndex = "-10";
	document.getElementById("hidback").style.opacity = "0";
	document.getElementById("hidback").style.zIndex = "-11";
	document.getElementById("hidsure").style.display = "none";
}
function accOrder(num){
	console.log(num);
	console.log(dataOrder);
	console.log(keyOrder);
	let chk;
	let current = new Date();
  	let date = current.toLocaleString();
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		for(let i in keyOrder){
    			chk = keyOrder[i];
    			if(dataOrder[chk].noor == num){
		    		const firebaseRef = firebase.database().ref("test");
				    firebaseRef.child(`${chk}/isHave`).set(false);
				    firebaseRef.child(`${chk}/buyBy`).set(user.email);
				    firebaseRef.child(`${chk}/doneDate`).set(date);
				}
			}
			alert("Order Complete!");
			hidSure();
    	}
    	else{
    		alert("Please Sign in!");
    		window.location.href("login.html");
    	}
    });
}
function readHistory(){
	let chk;
	let chkDate;
	let his = "";
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		for(let i in keyOrder){
    			chk = keyOrder[i];
    			if(user.email == dataOrder[chk].buyBy || user.email == dataOrder[chk].email){
    				if(dataOrder[chk].doneDate == "")
    					chkDate = "Order isn't progressed";
    				else
    					chkDate = dataOrder[chk].doneDate;
    				his += `<div class="row" style="text-align:center;cursor: pointer;" onclick='chkHash(${dataOrder[chk].noor})'>
								<div class="col-1">
									<p>${dataOrder[chk].price}</p>
								</div>
								<div class="col-1">
									<p>${dataOrder[chk].amount}</p>
								</div>
								<div class="col-2">
									<p>${dataOrder[chk].bank}</p>
								</div>
								<div class="col-3">
									<p>${chkDate}</p>
								</div>
								<div class="col-2">
									<p>${dataOrder[chk].status}</p>
								</div>
								<div class="col-3">
									<p>${dataOrder[chk].email}</p>
								</div>
							</div><hr>`;
    			}
    		}
    		document.getElementById("hisor").innerHTML = his;
    	}
    	else{
    		document.getElementById("hisor").innerHTML = `<h1 style="text-align:center;">Please Sign in</h1>`;
    	}
    });
}
function chkHash(num){
	let chk;
	let his = "";
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		for(let i in keyOrder){
    			chk = keyOrder[i];
    			if((num == dataOrder[chk].noor) && (user.email == dataOrder[chk].email) && (dataOrder[chk].doneDate != "") && (dataOrder[chk].status == "incomplete")){
    				his += `<button onclick="recHash(${num})" class="btn btn-success" style="margin-right: 50px">ยืนยัน</button>
							<button onclick="hidehis()" class="btn btn-danger">ยกเลิก</button>`;
					document.getElementById("rech").innerHTML = his;
    				document.getElementById("hidhisor").style.opacity = "1";
					document.getElementById("hidhisor").style.zIndex = "100";
					document.getElementById("hidbackhi").style.opacity = "0.7";
					document.getElementById("hidbackhi").style.zIndex = "99";
    			}
    			else{
    				console.log("Nope man");
    			}
    		}
    	}
    });
}
function hidehis(){
	document.getElementById("hidhisor").style.opacity = "0";
	document.getElementById("hidhisor").style.zIndex = "-10";
	document.getElementById("hidbackhi").style.opacity = "0";
	document.getElementById("hidbackhi").style.zIndex = "-11";
}
function recHash(num){
	let chk;
	let hash = document.getElementById("hash").value;
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		for(let i in keyOrder){
    			chk = keyOrder[i];
    			if(dataOrder[chk].noor == num){
		    		const firebaseRef = firebase.database().ref("test");
				    firebaseRef.child(`${chk}/hash`).set(hash);
				    firebaseRef.child(`${chk}/status`).set("Complete!");
				    alert("Hash Recorded!");
				    hidehis();
				}
			}
		}
	});
}