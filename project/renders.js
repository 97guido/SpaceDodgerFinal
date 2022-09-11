async function update(time){

	if (showSettingsMenu) ShowMenu(true);
	else ShowMenu(false);

	if(nstep*20 <= timeNow){ //skip the frame if the call is too early
		AstronaveDoStep(); 
		nstep++; 
		doneSomething=true;
		window.requestAnimationFrame(update);
		return; // return as there is nothing to do
	}
	timeNow=time;
	if (doneSomething) {
		render();
		doneSomething=false;
	}

	if (gameStarted && !gamePause) {

		if (timeNow % msAsteroidRatio < 20) AddAsteroid();

		increaseDifficulty();

		// Incremento il valore del punteggio con il passare del tempo, 
		// in turbo mode il contatore sale più velocemente
		points += turboMode ? 5 : 1;

		document.getElementById("pointView").textContent = "Score\n" + points
	}
	window.requestAnimationFrame(update); // get next frame
}

function increaseDifficulty() {
	asteroidSpeed += 0.001;
	moveDeltaSpeed = asteroidSpeed / 2;
	// Ri-calcolo il valore utilizzato per la rotazione dell'universo
	universeSpeed = asteroidSpeed / 2000;

	if (msAsteroidRatio > msAsteroidRatioLimit) msAsteroidRatio -= 0.02;
	else if (asteroidScaleSizeMax < asteroidScaleSizeLimit) {
		asteroidScaleSizeMax += 0.001;
		asteroidScaleSizeMin = asteroidScaleSizeMax - 20;
	}
}

// variabili globali per scelta camera
var camera = [];
var cameraInterno = false; // per passare tra la camera posteriore e anteriore
var previousCameraMode = false;

var viewMatrix;

//matrici globali. Alternativa --> passarle come argomento
var lightWorldMatrix, lightProjectionMatrix, projectionMatrix, cameraMatrix;

var rotVar = 0; // Variabile utilizzata per gli elementi in rotazione
async function drawScene(	
	projectionMatrix, 
	textureMatrix, 
	lightWorldMatrix, 
	programInfo) {

	await CameraPositioner();
	FovVariator();

	gl.useProgram(programInfo.program);

	webglUtils.setUniforms(programInfo, {
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_bias: settings.bias,
		u_textureMatrix: textureMatrix,
		u_projectedTexture: depthTexture,
		u_shininess: settings.shininess,
		u_innerLimit: Math.cos(degToRad(settings.fovLight / 2)),
		u_outerLimit: Math.cos(degToRad(settings.fovLight / 2 - 20)),
		u_lightDirection: lightWorldMatrix.slice(8, 11).map(v => -v),
		u_lightWorldPosition: [px, py, pz],
		u_viewWorldPosition: [px, py, pz],
		u_shadowIntensity: settings.shadowIntensity,
	});

	await drawUniverse(programInfo_universe);

	if (gameStarted) {
		drawAstronave(programInfo_light)
		drawAcceleratore(programInfo_color)

		console.log(asteroidList.length);

		// Disegno gli asteroidi nella lista
		asteroidList.forEach(asteroidSpecs => {

			// Specs: [asteroidRandomX,asteroidRandomY,asteroidStartDist, rotation, scale, asteroidType]

			// Se avvio la modalità turbo faccio svanire gli asteroidi rimpicciolendoli
			if (turboMode && asteroidSpecs[4] > 0) asteroidSpecs[4] -= 0.5;

			drawTravellingAsteroid(asteroidSpecs, programInfo_light)

			// Se il gioco non è in pausa faccio avanzare l'asteroide
			if (!gamePause) asteroidSpecs[2] += asteroidSpeed
			
			// Appena l'asteroide raggiunge l'rigine dell'asse Z controllo l'eventuale collisione
			if (asteroidSpecs[2] < 10 && asteroidSpecs[2] > 0) { 
				CheckCollision(asteroidList[0])
			}

			// Rimuovo l'asteroide dalla lista
			if (asteroidSpecs[2] > 10) { 
				asteroidList.shift()
			}
		})
	}

}


async function render(){

	if (!gamePause) rotVar += 0.1

	await CameraPositioner();

    gl.enable(gl.DEPTH_TEST);

	lightWorldMatrix = m4.lookAt(
        [px, py, 0],  // position
        targetAstronave, //[px, py, -1], // target
        [0, 1, 0],    // up
    );

	lightProjectionMatrix = m4.perspective(
		degToRad(settings.fovLight), 
		1, 
		0.1, 
		500);

    // draw to the depth texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawScene(
		lightProjectionMatrix,
		m4.identity(), 
		lightWorldMatrix, 
		programInfo_color);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Colore dello sfoondo
    gl.clearColor(.05, .05, .08, 1);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let textureMatrix = m4.identity();
	textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
	textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
	textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix = m4.multiply(
        textureMatrix,
        m4.inverse(lightWorldMatrix));

	//matrici di vista
	projectionMatrix = m4.perspective(settings.fov, settings.aspect, 0.1, 5000);
	
	previousCameraMode = cameraInterno;

    drawScene( 
		projectionMatrix, 
		textureMatrix, 
		lightWorldMatrix, 
		programInfo_light);
    
}

function drawAstronave(programInfo) {
	
	if (gameStarted) {
		
		var objToDraw = getObjToDraw(objectsToDraw, "astronave");
		gl.useProgram(programInfo.program);

		var matrix_astronave = m4.identity();

		matrix_astronave = m4.translate(matrix_astronave,px, py, pz);
		matrix_astronave = m4.scale(matrix_astronave, 0.5, 0.5, 0.5);
		matrix_astronave = m4.yRotate(matrix_astronave, -1.57);
		matrix_astronave = m4.xRotate(matrix_astronave, rotazioneVirata);
		matrix_astronave = m4.zRotate(matrix_astronave, 0.2+rotazioneSuGiu);
		objToDraw.uniforms.u_world = matrix_astronave;
		
		webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
		webglUtils.setUniforms(programInfo, objToDraw.uniforms);
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);

		
		// Aggiungo la cornice all'interno dell'astronave
		gl.useProgram(programInfo_universe.program);
		objToDraw = getObjToDraw(objectsToDraw, "cornice");
		
		var matrix_cornice = m4.copy(matrix_astronave);
		matrix_cornice = m4.translate(matrix_cornice, -0.4, 1, 1.9);
		matrix_cornice = m4.scale(matrix_cornice, 0.5, 0.5, 0.5);
		matrix_cornice = m4.yRotate(matrix_cornice, degToRad(-30));
		matrix_cornice = m4.zRotate(matrix_cornice, degToRad(-20));
		matrix_cornice = m4.xRotate(matrix_cornice, degToRad(290));
		objToDraw.uniforms.u_world = matrix_cornice;


		webglUtils.setBuffersAndAttributes(gl, programInfo_universe, objToDraw.bufferInfo);
		webglUtils.setUniforms(programInfo_universe, objToDraw.uniforms);
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);

		// Aggiungo i propulsori della nave
		objToDraw = getObjToDraw(objectsToDraw, "bluFire");
		
		var matrix_bluFire = m4.copy(matrix_astronave);
		matrix_bluFire = m4.translate(matrix_bluFire,8, 0.8, -1.6);
		matrix_bluFire = m4.scale(matrix_bluFire, 0.5, 0.5, 0.5);
		matrix_bluFire = m4.yRotate(matrix_bluFire, degToRad(-90));
		matrix_bluFire = m4.zRotate(matrix_bluFire, degToRad(90)*rotVar);
		objToDraw.uniforms.u_world = matrix_bluFire;


		webglUtils.setBuffersAndAttributes(gl, programInfo_universe, objToDraw.bufferInfo);
		webglUtils.setUniforms(programInfo_universe, objToDraw.uniforms);
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);
		

		matrix_bluFire = m4.copy(matrix_astronave);
		matrix_bluFire = m4.translate(matrix_bluFire,8, 0.8, 1.6);
		matrix_bluFire = m4.scale(matrix_bluFire, 0.5, 0.5, 0.5);
		matrix_bluFire = m4.yRotate(matrix_bluFire, degToRad(-90));
		matrix_bluFire = m4.zRotate(matrix_bluFire, degToRad(90)*rotVar);
		objToDraw.uniforms.u_world = matrix_bluFire;

		webglUtils.setBuffersAndAttributes(gl, programInfo_universe, objToDraw.bufferInfo);
		webglUtils.setUniforms(programInfo_universe, objToDraw.uniforms);
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);
		
	}
}



function drawUniverse(programInfo) {

	var objToDraw = getObjToDraw(objectsToDraw, "universe");
	gl.useProgram(programInfo.program);

	var matrix_universe = m4.identity();

	// Scalo e traslo il toro per contenere gli elemnti del gioco
	matrix_universe = m4.translate(matrix_universe, px+0, py-15200, 0);
	matrix_universe = m4.scale(matrix_universe, 1000, 1000, 1000);
	matrix_universe = m4.xRotate(matrix_universe, rotVar*universeSpeed);
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	
	webglUtils.setUniforms(programInfo, {
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_world: matrix_universe,
	});

	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);


}

// Variabili per la generazione del portale acceleratore
var acceleratoreDist = -1000;
var waitForNext = true;
var randomAccCoord = []
setTimeout(function() { 
	randomAccCoord = [
		px+((Math.random()*thorusRadius-(thorusRadius/2))/2), 
		py+((Math.random()*thorusRadius-(thorusRadius/2))/2)
	];
	waitForNext = false
}, 10*1000);

function drawAcceleratore(programInfo) {

	if (waitForNext) return;

	const viewMatrix = m4.inverse(cameraMatrix);
	var objToDraw = getObjToDraw(objectsToDraw, "acceleratore");

	gl.useProgram(programInfo.program);
	

	var matrix_acceleratore = m4.identity();

	if (!gamePause && gameStarted) acceleratoreDist += asteroidSpeed / 2;
	if (acceleratoreDist > 1) {

		CheckAcceleratore(randomAccCoord)

		waitForNext = true;
		setTimeout(function() {waitForNext = false}, 8000);

		acceleratoreDist = -1000;
		randomAccCoord = [
			px+((Math.random()*thorusRadius-(thorusRadius/2))/2), 
			py+((Math.random()*thorusRadius-(thorusRadius/2))/2)
		];
	}

	matrix_acceleratore = m4.translate(matrix_acceleratore, randomAccCoord[0], randomAccCoord[1], acceleratoreDist);
	matrix_acceleratore = m4.scale(matrix_acceleratore, 30, 30, 15);
	matrix_acceleratore = m4.zRotate(matrix_acceleratore, degToRad(90)*rotVar);
	
	objToDraw.uniforms.u_world = matrix_acceleratore;

	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	
	webglUtils.setUniforms(programInfo, {
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_world: matrix_acceleratore,
	});
	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);

}


function drawTravellingAsteroid(asteroidSpecs, programInfo) {

	gl.useProgram(programInfo.program);

	var objToDraw = getObjToDraw(objectsToDraw, "asteroide");
	if (asteroidSpecs[5] == 1) objToDraw = getObjToDraw(objectsToDraw, "asteroide2");
	
	var matrix_asteroide = m4.identity();

	matrix_asteroide = m4.translate(matrix_asteroide, asteroidSpecs[0], asteroidSpecs[1], asteroidSpecs[2]);
	matrix_asteroide = m4.scale(matrix_asteroide, asteroidSpecs[4], asteroidSpecs[4], asteroidSpecs[4]);
	matrix_asteroide = m4.xRotate(matrix_asteroide, rotVar*asteroidSpecs[3]);
	objToDraw.uniforms.u_world = matrix_asteroide;
	
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);

	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);

}




