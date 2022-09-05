// Eventi mouse
var key=[false, false, false, false, false];

var mouseDown=function(e) {
	drag=true;
	cameraLibera = true;
	old_x=e.pageX, old_y=e.pageY;
	e.preventDefault();
	console.log("drag");
	return false;
};

var pressed = ""
var mouseUp=function(e){
	drag=false;
	cameraLibera = false;
	key[0] = false;
	key[1] = false;
	key[2] = false;
	key[3] = false;
};

var drag = false;
var mouseMove=function(e) {

	if (gameStarted && !drag) {
		xShift = 0;
		return;
	}
	
	var gameContainer = document.getElementById("containerGame");

	var width = gameContainer.offsetWidth 
	var height = screen.height // Ritorna 0, ometto fix

	// variabili utilizzate per effetto di movimento nella schermata iniziale al movimento del mouse
	var xShiftCurrent = e.pageX - (width / 2)
	var yShiftCurrent = e.pageY - (height / 2)
	
	if (gameStarted && drag) {
		console.log(xShiftCurrent +"-"+yShiftCurrent);
		if (xShiftCurrent > 0) {
			key[1] = false;
			key[3] = true;
		}
		else {
			key[1] = true;
			key[3] = false;
		}
	}
	else {
		xShift = xShiftCurrent/4;
	}
	

	if (gameStarted && drag) {
		if (yShiftCurrent > 0) {
			key[0] = false;
			key[2] = true;
		}
		else {
			key[0] = true;
			key[2] = false;
		}
	}
	else yShift = -yShiftCurrent/4;

	return;
};

// Toggle menù delle impostazioni
var toggleWait = false;
async function toggleSetting() {
	if (toggleWait) return;
	console.log("toggleSetting: "+showSettingsMenu);
	showSettingsMenu=!showSettingsMenu;
	toggleWait = true;
	setTimeout(function() {toggleWait = false;}, 200);
} 

// Eventi da tastiera
function doKeyDown(e){

	// console.log(e.key +" = "+e.keyCode);

	if (e.keyCode == 87){
		key[0]=true; 	// THE W KEY
	} 
	if (e.keyCode == 83){
		key[2]=true; 	// THE S KEY
	} 
	if (e.keyCode == 65){
		key[1]=true; 	// THE A KEY	
	} 
	if (e.keyCode == 68){
		key[3]=true; 	// THE D KEY
	} 
	if (e.keyCode == 32){
		key[4]=true; 	// THE BAR SPACE	
	} 
	if (e.keyCode == 86){
		key[5]=true; 	// THE V KEY
	} 
	if (e.keyCode == 73) {
		toggleSetting();
	}

}

function doKeyUp(e){
	if (e.keyCode == 87){
		key[0]=false; 	// THE W KEY
	} 
	if (e.keyCode == 83){
		key[2]=false; 	// THE S KEY	
	} 
	if (e.keyCode == 65){
		key[1]=false; 	// THE A KEY
	} 
	if (e.keyCode == 68){
		key[3]=false; 	// THE D KEY	
	} 
	if (e.keyCode == 32){
		key[4]=false; 	// THE BAR SPACE	
	}
	if (e.keyCode == 86){
		key[5]=false; 	// THE V KEY
	} 
}


// Eventi da mobile
var wBtn = document.getElementById("ButtonW");
var aBtn = document.getElementById("ButtonA");
var dBtn = document.getElementById("ButtonD");
var sBtn = document.getElementById("ButtonS");

wBtn.addEventListener('touchstart', function(e) {
	key[0] = true;
	e.preventDefault();
})

wBtn.addEventListener('touchend',function(e) {
	key[0] = false;
	e.preventDefault();
});

aBtn.addEventListener('touchstart', function(e) {
	key[1] = true;
	e.preventDefault();
})

aBtn.addEventListener('touchend',function(e) {
	key[1] = false;
	e.preventDefault();
});

sBtn.addEventListener('touchstart', function(e) {
	key[2] = true;
	e.preventDefault();
})

sBtn.addEventListener('touchend',function(e) {
	key[2] = false;
	e.preventDefault();
});

dBtn.addEventListener('touchstart', function(e) {
	key[3] = true;
	e.preventDefault();
})

dBtn.addEventListener('touchend',function(e) {
	key[3] = false;
	e.preventDefault();
});

// Listeners delle impostazioni
document.getElementById("rangeFovLight").addEventListener('input', function(ev) {
	settings.fovLight = this.value;
	document.getElementById("labelFovLight").textContent = `FOV luce: ${Number(this.value).toFixed(2)}`
}, true)

document.getElementById("rangeBias").addEventListener('input', function(ev) {
	settings.bias = this.value;
	document.getElementById("labelBias").textContent = `Bias: ${Number(this.value).toFixed(8)}`
}, true)

document.getElementById("rangeShadowIntensity").addEventListener('input', function(ev) {
	settings.shadowIntensity = this.value;
	document.getElementById("labelShadowIntensity").textContent = `Intensità ombra: ${Number(this.value).toFixed(5)}`
}, true)

document.getElementById("rangeShininess").addEventListener('input', function(ev) {
	settings.shininess = this.value;
	document.getElementById("labelShininess").textContent = `Lucentezza: ${Number(this.value).toFixed(2)}`
}, true)

document.getElementById("ButtonSettings").onclick = async function() {
	await toggleSetting()
};

document.getElementById("settingsMenu").onclick = async function() {
	if (onMobile) await toggleSetting()
};


document.getElementById("startBtn").onclick = function(){
	GameStart();
};
