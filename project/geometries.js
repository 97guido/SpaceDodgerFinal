var objectsToDraw = [];

function setObjsToDraw() {
	objectsToDraw = [

		// Astronave
		{
			name: "astronave",
			
			programInfo: programInfo_light,
			bufferInfo: bufferInfo_astronave,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: steelTexture,
				u_world: m4.yRotate(m4.scale(m4.translation(0, 0, 0), 1, 1, 1), -1.57),
			},
		},
		
		// Universo
		{
			name: "universe",
			programInfo: programInfo_light,
			bufferInfo: bufferInfo_universe,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: skyTexture,
				u_world: m4.scale(m4.translation(0, 0, 0), 1, 1, 1),
			},
		},

		// Asteroide
		{
			name: "asteroide",
			programInfo: programInfo_light,
			bufferInfo: bufferInfo_asteroide,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: rockTexture,
				u_world: m4.scale(m4.translation(0, 0, 0), 1, 1, 1),
			},
		},

		// Asteroide2
		{
			name: "asteroide2",
			programInfo: programInfo_light,
			bufferInfo: bufferInfo_asteroide2,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: rockTexture2,
				u_world: m4.scale(m4.translation(0, 0, 0), 1, 1, 1),
			},
		},

		// Acceleratore
		{
			name: "acceleratore",
			bufferInfo: bufferInfo_acceleratore,
			uniforms: {
				u_color: [0, 0.93, 1, 1],
				u_world: m4.scale(m4.translation(0, 0, 0), 2,2, 2),
			},
		},

		// BluFire
		{
			name: "bluFire",
			bufferInfo: bufferInfo_bluFire,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: bluFireTexture,
				u_world: m4.scale(m4.translation(0, 0, 0), 1, 1, 1),
			},
		},

		// Cornice
		{
			name: "cornice",
			programInfo: programInfo_light,
			bufferInfo: bufferInfo_cornice,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: corniceTexture,
				u_world: m4.scale(m4.translation(0, 0, 0), 1, 1, 1),
			},
		}
	];
}


// Geometrie
var bufferInfo_astronave, bufferInfo_universe, bufferInfo_asteroide, bufferInfo_asteroide2, bufferInfo_acceleratore, bufferInfo_bluFire;

function setGeometries(gl) {

	loadDoc('resources/data/Astronave/naveInterna3wtxt.obj');

	const arrays_astronave = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_astronave = webglUtils.createBufferInfoFromArrays(gl, arrays_astronave);

	// ---------------------------------------------------------------------

	loadDoc('resources/data/Universe/torusY.obj');

	const arrays_universe = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_universe = webglUtils.createBufferInfoFromArrays(gl, arrays_universe);

	// ---------------------------------------------------------------------

	loadDoc('resources/data/Asteroidi/Asteroide.obj');

	const arrays_asteroide = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_asteroide = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroide);
	
	// ---------------------------------------------------------------------

	loadDoc('resources/data/Asteroidi/Asteroide2.obj');

	const arrays_asteroide2 = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_asteroide2 = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroide2);
	
	// ---------------------------------------------------------------------

	loadDoc('resources/data/Astronave/FireBlu.obj');

	const arrays_bluFire = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_bluFire = webglUtils.createBufferInfoFromArrays(gl, arrays_bluFire);
	
	// ---------------------------------------------------------------------

	loadDoc('resources/data/Acceleratore/Acceleratore.obj');

	const arrays_acceleratore = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_acceleratore = webglUtils.createBufferInfoFromArrays(gl, arrays_acceleratore);

	// ---------------------------------------------------------------------

	loadDoc('resources/data/Astronave/Cornice.obj');

	const arrays_cornice = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_cornice = webglUtils.createBufferInfoFromArrays(gl, arrays_cornice);

}
