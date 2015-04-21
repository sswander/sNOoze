//global var alarm
var alarm={
	created: false,
	time: new Date(), // only has hours and minutes
	hour: '',
	tempHour:'',
	min: '',
	tempMin:'',
	active: false,
	volume: 0,
	tempVolume: 80,
	song: ''
};

var songList = [
	{ 
		title: "dog'n duck jog", 
		src: "./audio/dogDuckJog", 
		imgsrc:"./img/audio/musmus.jpg", 
		artist: "MusMus", 
		desc: "楽しいジョギング。ブルーノートを使ってちょっとブルージーな面も。" 
	},{
		title: "You are Limitless", 
		src: "./audio/limitless", 
		imgsrc:"./img/audio/limitless.jpg", 
		artist: "Mario Novak", 
		desc: "Wake up to the sound of motivation" 
	}
];

var mySound; //declare song
var timer_is_on = true; //declare timer

function timerOn() {
	timer_is_on = true;
}

function trackTime() {
	now=new Date();
	hour=now.getHours();
	min=now.getMinutes();
	sec=now.getSeconds();
	
	if(timer_is_on && alarm.active && hour==alarm.hour && min==alarm.min) {
		timer_is_on = false;
		loadWakeUpScreen(); //testing purposes
		$.UIGoToArticle('#wake-up-view'); //for testing purposes
		setTimeout("timerOn()", 60000);
	}
	
 setTimeout("trackTime()", 1000);

}
		
function findSongIndex(songName) {
    for(var i = 0; i < songList.length; i++) {
        if (songList[i]['title'] === songName) return i;
    }
    return -1;
}
		
for (var i = 0; i < songList.length; i++) {
	listSong(i);
}

function listSong(id) {
	currSong = songList[id];
	$("#song-list").append( "<li class='comp' data-id='" + id + "'>" +
							"<aside><img src='" + currSong.imgsrc + "' height='80px' width='80px'></aside>" +
							"<div><h3>" + currSong.artist + "</h3><h4>" + currSong.title + "</h4><p>" + currSong.desc + "</p></div>" +
							"<aside><span class='nav'></span></aside>" + 
							"</li>");
}


		
function loadHomeScreen() {
	if(!(alarm.created)){ //if no alarm is created:
		$('#homeScreen').html('<h1 style="text-align: center">No alarm yet.</h1><a class="button action setAlarm">Set a new one</a>');
	} else {
		$('#homeScreen').html('<h1 style="text-align: center">' + alarm.hour + ':' + alarm.min + '</h1><a class="button action setAlarm">Edit Alarm</a>');
		if(alarm.active) {
			$('#homeScreen').append('<a class="button action toggleAlarm" id="toggleAlarm">Alarm is ON</a>');
		}else {
			$('#homeScreen').append('<a class="button action toggleAlarm" id="toggleAlarm">Alarm is OFF</a>');
		}
	}
}

function loadSettingsScreen(hour, min, song) {
	if(hour!='') { //one efficient check, cos both hour and min are init at the same time
		$('#alarm-time').html(hour + ':' + min);
	} else {
		$('#alarm-time').html('');
	}
	if(song!='') {
		$('#audio-name').html(song);
	} else {
		$('#audio-name').html('');
	}
	if(hour!='' && song!='') {
		$('#done-button-div').html("<a class='button action' id='done-button'>Done</a>");
	} else {
		$('#done-button-div').children().remove();
	}
}

function loadWakeUpScreen() {
	$('#wake-up-time').html(alarm.hour + ':' + alarm.min);
	$('#input-text').val('');
	mySound = new buzz.sound( songList[findSongIndex(alarm.song)].src, {
		formats: [ "ogg", "mp3"],
		loop: true,
	});
	mySound.setVolume(alarm.volume).play();
}

$('#backTo-settings').on('singletap', function() {
	loadSettingsScreen(alarm.tempHour,alarm.tempMin,alarm.tempSong);
});

$('#homeScreen').on('singletap', 'a.setAlarm', function() {
	alarm.tempSong = alarm.song; //reset temp song to alarm song but keep values of hour and min in case they didnt change anything
	loadSettingsScreen(alarm.hour,alarm.min,alarm.song);
	$.UIGoToArticle('#settings');
});

$('#homeScreen').on('singletap', 'a.toggleAlarm', function() {
	if(alarm.active) {
		alarm.active = false;
		$('#toggleAlarm').html('Alarm is OFF');
	} else {
		alarm.active = true;
		$('#toggleAlarm').html('Alarm is ON');
	}
});

$('#done-button-div').on('click', 'a.button.action', function() {
	alarm.hour = alarm.tempHour;
	alarm.min = alarm.tempMin;
	alarm.song = alarm.tempSong;
	alarm.volume = alarm.tempVolume;
	alarm.created=true;
	alarm.active=true;
	loadHomeScreen();
	trackTime();
	$.UIGoToArticle('#home');
});

$('#alarm_time').on("change", function() {
	alarm.tempHour = this.value.substring(0,2);
	alarm.tempMin = this.value.substring(3,5);
});

$("#song-list").on("singletap", "li", function() {
	var id = $(this).data("id"); // read the data-id from song item
	alarm.tempSong = songList[id].title;
	loadSettingsScreen(alarm.tempHour,alarm.tempMin,alarm.tempSong);
	$.UIGoBack();
});

// Get info on data:
$("#volume-slider").on("change", function(){
	alarm.tempVolume = this.value;
});

$('#dismiss-button').on('singletap', function() {
	var inputText = $('#input-text').val();
	if(inputText.length>1){
		mySound.stop();
		loadHomeScreen();
		$.UIGoToArticle('#home');
	}
});

loadHomeScreen();



