async function SmootVariate(currentValue, toValue, step) {
	var tolleranza = step*2;
	if (currentValue >= toValue-tolleranza && currentValue <= toValue+tolleranza ) {
		return toValue;
	}
	if (currentValue < toValue) {
		return currentValue+step;
	}
	if (currentValue > toValue) {
		return currentValue-step;
	}
}

async function AstronaveDoStep(){

	if (!gameStarted || gamePause) return;

	if (key[1]) {
		px-=moveDeltaSpeed;
		rotazioneVirata = await SmootVariate(rotazioneVirata, 0.2, virataStep) //0.1;
	}
	
	if (key[3]) {
		px+=moveDeltaSpeed;
		rotazioneVirata = await SmootVariate(rotazioneVirata, -0.2, virataStep);//-0.1;
	}

	if (key[0]) { 
		py+=moveDeltaSpeed; 
		rotazioneSuGiu = await SmootVariate(rotazioneSuGiu, -0.2, virataStep);
	}
	
	if (key[2]) {
		py-=moveDeltaSpeed; 
		rotazioneSuGiu = await SmootVariate(rotazioneSuGiu, 0.2, virataStep);
	}

	if (!key[1] && !key[3]) rotazioneVirata = await SmootVariate(rotazioneVirata, 0, virataStep);//-0.1;
	if (!key[0] && !key[2]) rotazioneSuGiu = await SmootVariate(rotazioneSuGiu, 0, virataStep);//-0.1;

	if (key[5]) SwitchCamera()

}

var keypressEnabled = true
function SwitchCamera() {
	if (keypressEnabled && rotazioneVirata == 0 && rotazioneSuGiu == 0) {
		keypressEnabled = false
		console.log("switch camera");
		cameraInterno = !cameraInterno
		setTimeout(function () {keypressEnabled = true}, 300)
	}
}


function AstronaveInit(){
	// inizializzo lo stato della macchina
	// posizione e orientamento
	px = 0; py = 0; pz = 0;
	
	key=[false, false, false, false, false];

}

