'use strict';

const pushButton = document.querySelector('.js-push-btn');
let alertShown = false;
let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function updateSubscriptionOnServer(subscription) {
	// TODO: Send subscription to application server

	// const subscriptionJson = document.querySelector('.js-subscription-json');
	// const subscriptionDetails =
	// 	document.querySelector('.js-subscription-details');

	if (subscription) {
		console.log(JSON.stringify(subscription));
		// subscriptionDetails.classList.remove('is-invisible');
	} 
    // else {
	// 	subscriptionDetails.classList.add('is-invisible');
	// }
}

function subscribeUser() {
	const applicationServerPublicKey = localStorage.getItem('applicationServerPublicKey');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	swRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		})
		.then(function(subscription) {
			console.log('User is subscribed.');
			const contentType = 'application/json'; // Adjust based on server expectation
			const headers = { 'Content-Type': contentType };
			axios.post('/subscribe', JSON.stringify(subscription), {headers});
			updateSubscriptionOnServer(subscription);
			console.log(subscription)		
			localStorage.setItem('sub_token',JSON.stringify(subscription));
			isSubscribed = true;
			Swal.fire({
				title: 'Sukses',
				text: "Anda berhasil mengaktifkan notifikasi browser",
				icon: "success"
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
						window.location.reload();
				}
			})
		})
		.catch(function(err) {
			console.log('Failed to subscribe the user: ', err);
		});
}

function unsubscribeUser() {
	swRegistration.pushManager.getSubscription()
		.then(function(subscription) {
			if (subscription) {
				return subscription.unsubscribe();
			}
		})
		.catch(function(error) {
			console.log('Error unsubscribing', error);
		})
		.then(function() {
			updateSubscriptionOnServer(null);

			console.log('User is unsubscribed.');

			axios.post('/unsubscribe');
			isSubscribed = false;

			Swal.fire({
				title: 'Sukses',
				text: "Notifikasi browser telah dinonaktifkan",
				icon: "success"
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
						window.location.reload();
				}
			})
		});
}

function initializeUI() {
    $("#notif-browser").on('change', function() {
        if ($(this).is(':checked')) {
			subscribeUser();
        }else {
			unsubscribeUser();
        }
    });

	// Set the initial subscription value
	swRegistration.pushManager.getSubscription()
		.then(function(subscription) {
			isSubscribed = !(subscription === null);

			updateSubscriptionOnServer(subscription);

			if (isSubscribed) {
				console.log('User IS subscribed.');
			} else {
				console.log('User is NOT subscribed.');
			}

		});
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Service Worker and Push is supported');

	navigator.serviceWorker.register("/static/js/service/sw.js")
		.then(function(swReg) {
			console.log('Service Worker is registered', swReg);

			swRegistration = swReg;
			initializeUI();
		})
		.catch(function(error) {
			console.error('Service Worker Error', error);
		});
} else {
	console.warn('Push meapplicationServerPublicKeyssaging is not supported');
	pushButton.textContent = 'Push Not Supported';
}

function push_message() {
	$.ajax({
		type: "POST",
		url: "/push_v1/",
		contentType: 'application/json; charset=utf-8',
		dataType:'json',
		data: JSON.stringify({'sub_token':localStorage.getItem('sub_token')}),
		success: function( data ){
			console.log("success",data);
    },
    error: function( jqXhr, textStatus, errorThrown ){
        console.log("error",errorThrown);
    }
	});
}
function push_welcome() {
	$.ajax({
		type: "POST",
		url: "/push_welcome",
		contentType: 'application/json; charset=utf-8',
		dataType:'json',
		data: {},
		success: function(){
			console.log("success");
    },
    error: function( jqXhr, textStatus, errorThrown ){
        console.log("error",errorThrown);
    }
	});
}

async function push_predict(){
	let dataCuaca = await predictDay('today')
	let dataWaktu = [];
	let dataNotif = [];
	for(let i=0; i<dataCuaca.length;i++){
		let waktu = dataCuaca[i].waktu;
		dataWaktu.push(waktu)
	}
	let dataWaktuInt = dataWaktu.map(timeString => {
		// Extract the numeric part using substring and convert to integer
		const [hours, minutes] = timeString.split(':').map(Number);

		// Create a new Date object with the extracted time components
		const dateObject = new Date();
		dateObject.setHours(hours, minutes, 0); // Set milliseconds to zero
	  
		return dateObject;
	  });
	  for(let i=0; i<dataCuaca.length;i++){
		let curah = dataCuaca[i].curahHujan;
		dataNotif.push(curah)
	}

	console.log(dataNotif);

	  let currentDate = new Date();
	  let closestTimeNotif = null
	  let closestTime = null;
	  let closestTimeDiff = Infinity;
	  let closestCurahHujan = null;
	  
	  function updateClosestTimeAndDiff() {
		currentDate = new Date();
		let timeIntervalId = null;
		for (let j=0; j<dataWaktuInt.length;j++) {
		if(dataWaktuInt[j].getTime()>currentDate.getTime()){
			localStorage.setItem('alertShown', 'false');
		  const timeDiff = Math.abs(dataWaktuInt[j].getTime() - currentDate.getTime());
	  
		  if (timeDiff < closestTimeDiff) {
			closestTime = dataWaktuInt[j];
			closestTimeDiff = timeDiff;
			closestCurahHujan = dataNotif[j];
			closestTimeNotif = dataWaktu[j];
		  }
		}
		}
		
		if (closestTime !== null) {
			let timeDiffInSeconds = closestTimeDiff / 1000;
			$('#diff').text(formatTimeDiff(timeDiffInSeconds))
			timeIntervalId = setInterval(() => {
				// Update timeDiffInSeconds and formattedTimeDiff
				timeDiffInSeconds -= 1;
				const formattedTimeDiff = formatTimeDiff(timeDiffInSeconds);
			  
				// Update diffElement content
				$('#diff').text(formattedTimeDiff);
			  
				// Check if timer has reached zero
				if (timeDiffInSeconds <= 8700) {
					if(!alertShown){
					let classCurah = getClass(closestCurahHujan)
					$.ajax({
						type: "POST",
						url: "/push_predict",
						data: {
							curahhujan: closestCurahHujan,
							waktu: closestTimeNotif,
							class: classCurah.classPredict,
							warning: classCurah.warning,
						},
					})
					localStorage.setItem('alertShown', 'true');
					}
					alertShown=true;
				}
			  }, 1000);
		}
	  }
	  function formatTimeDiff(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secondsLeft = Math.floor(seconds % 60);
	  
		return `${hours ? hours + ' jam ' : ''} ${minutes ? minutes + ' menit ' : ''} ${secondsLeft} detik`;
	  }
	  
	  updateClosestTimeAndDiff();
}
$(document).ready(function(){
	if (localStorage.getItem('alertShown') === 'true') {
		alertShown = true; // Set flag based on LocalStorage value
	  }
	$.ajax({
		type:"GET",
		url:'/subscription/',
		success:function(response){
			console.log("response",response);
			localStorage.setItem('applicationServerPublicKey',response.public_key);
		}
	})
});
