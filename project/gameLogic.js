var showSettingsMenu = false;

async function GameStart() {
	document.getElementById("startBtn").style.visibility = "hidden";

	gameStarted = true;
}

function InitGame() {
	px = 0; py = 0; pz = 0;
	
	key=[false, false, false, false, false];

	asteroidList = [];
	asteroidSpeed = 3;
	universeSpeed = 0.002;
	moveDeltaSpeed = asteroidSpeed / 2;
	universeSpeed = asteroidSpeed / 2000;
	asteroidScaleSizeMax = 30;
	msAsteroidRatio = 100;
	rotazioneVirata = 0;
	rotazioneSuGiu = 0;
	cameraInterno = false;
	previousCameraMode = false;
	rotVar = 0

	px = 0;
	py = 0;
	pz = 0;

	cameraXDelta = 0;
	cameraYDelta = 10;
	cameraZDelta = -10;

	xShift = 0;
	yShift = 0;

	acceleratoreDist = -1000;
}

async function GameOver() {

	alert("Game Over\nPunti: "+points);
	points = 0;

	document.getElementById("startBtn").style.visibility = "visible";
	gameStarted = false;

	InitGame()

}

async function ShowMenu(s) {
	if (s) {
		document.getElementById("settingsMenu").style.visibility = "visible";
		gamePause = true;
	}
	else {
		document.getElementById("settingsMenu").style.visibility = "hidden";
		setTimeout(function() {gamePause = false;}, 3000);
	}
}

function CheckCollision(asteroidCoord) {

	// In modelità turbo le collisioni non vengono considerate
	if (turboMode) return;

	const margin = asteroidCoord[4]*1.2; // Margine di collisione

	if (Math.abs(px-asteroidCoord[0]) < margin && Math.abs(py-asteroidCoord[1]) < margin ) {
		GameOver();
	}
}

function FovVariator() {
	if (turboMode && settings.fov < degToRad(165)) settings.fov *= 1.007
	else if (!turboMode && settings.fov > degToRad(100)) settings.fov /= 1.005
}


var cameraXDelta = 0;
var cameraYDelta = 10;
var cameraZDelta = -10;

async function CameraPositioner() {

	console.log(camera);

	// Aggiorno la posizione della camera con un delta di scostamento dalla posizione dell'astronave
	// In modalità tubo forzo la visuale esterna
	if (!cameraInterno || turboMode) {
		cameraXDelta = await SmootVariate(cameraXDelta, 0, 0.05)
		cameraYDelta = await SmootVariate(cameraYDelta, 5, 0.05)
		cameraZDelta = await SmootVariate(cameraZDelta, 8, 0.1)
	}
	else {
		cameraXDelta = await SmootVariate(cameraXDelta, 0, 0.1)
		cameraYDelta = await SmootVariate(cameraYDelta, 0.5, 0.1)
		cameraZDelta = await SmootVariate(cameraZDelta, 0.6, 0.2)
	}
	
	camera[0] = px + cameraXDelta + (gameStarted ? 0 : xShift)
	camera[2] = pz + cameraZDelta
	camera[1] = py + cameraYDelta + (gameStarted ? 0 : yShift)

	targetAstronave = [px-rotazioneVirata*50, py-rotazioneSuGiu*50, -500];
	cameraMatrix = m4.lookAt(camera, targetAstronave, [0,1,0]);
	viewMatrix = m4.inverse(cameraMatrix);
}

function CheckAcceleratore(accCoord) {

	// Eventualmente prevengo il protrarsi della modelità turbo
	if (turboMode) return;

	const margin = 30;
	if (Math.abs(px-accCoord[0]) < margin && Math.abs(py-accCoord[1]) < margin ) {
		turboMode = true;
		setTimeout(function () {turboMode = false;}, 5000);
	}
}

var addEnabled = true; // Valore booleano per prevenire la creazione di asteroidi multipli
async function AddAsteroid() {

	if (!addEnabled) return;
	
	// Genero coordinate casuali
	var asteroidRandomX = ((Math.random()*2-1)*thorusRadius)+px;
	var asteroidRandomY = ((Math.random()*2-1)*thorusRadius)+py;

	// Genero un valore randomico che indica la velocità di rotazione dell'asteroide 
	var rotation = (Math.random()*2-1)
	var scale = Math.random()*(asteroidScaleSizeMax-asteroidScaleSizeMin)+asteroidScaleSizeMin

	// Valore che determina la mesh da utilizzare per l'asteroide (tra due)
	var asteroidType = Math.floor(Math.random() * 2);

	// Commenta per disabilitare asteroidi
	if (gameStarted && !turboMode) asteroidList.push([asteroidRandomX,asteroidRandomY,asteroidStartDist, rotation, scale, asteroidType]);
	
	addEnabled = false;

	// Impedisco di generare asteroid prima dell'intervalo prestabilito
	await setTimeout(function () {
		addEnabled = true
	}, msAsteroidRatio-1);
}