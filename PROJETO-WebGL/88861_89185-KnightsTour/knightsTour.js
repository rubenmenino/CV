//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_26.js 
//
//  Interaction using the keyboard and the mouse
//
//  J. Madeira - November 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//



var gl = null; // WebGL context

var gl2 = null; // WebGL 2D context

var shaderProgram1 = null; 

var shaderProgram2 = null;

var triangleVertexPositionBuffer = null;

var triangleVertexPositionBuffer2 = null;
	
var triangleVertexColorBuffer = null;

// The global transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 1.0;

var sy = 1.0;

var sz = 1.0;

// NEW - To allow choosing the way of drawing the model triangles

var primitiveType = null;

// NEW - To allow choosing the projection type

var projectionType = 0;

var posX = 0; // começa 0,0

var posY = 0;

var calcTour = false;
// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];

// NEW --- Model Material Features

// Ambient coef.

var kAmbi = [ 0.2, 0.2, 0.2 ];

// Diffuse coef.

var kDiff = [ 0.7, 0.7, 0.7 ];

// Specular coef.

var kSpec = [ 0.7, 0.7, 0.7 ];

// Phong coef.

var nPhong = 100;

var winSound = new Audio('sounds/finish.wav');
var enter = new Audio('sounds/horse.wav');
var galopar = new Audio('sounds/galopar.wav')
// Initial model has just ONE TRIANGLE

var normals = [ 
];

// For storing the vertices defining the triangles
var vertices = [];


var tour = [
];

var antVerticesX = [];
var vertices2 = [];
var atualVerticesX = [ // most left tile
	-0.8, 0.8, 0.0,
	-0.8, 0.6, 0.0,
	-0.6, 0.6, 0.0,

	-0.8, 0.8, 0.0,
	-0.6, 0.6, 0.0,
	-0.6, 0.8, 0.0
]

vertices2 = vertices2.concat(atualVerticesX);
//calculating the vertices of the board
for (var x = 0; x < 8; x++) {
	antVerticesX = atualVerticesX.slice();

	var d = 0;

	for (var y = 1; y < 8; y++) {

		var i;
		var next = -1;
		d = d + 0.2;
		for (i = 0; i < antVerticesX.length; i++) {

			if (i == 1 || i == next) {

				var p = antVerticesX[i] - d;

				next = i + 3;
				vertices2.push(parseFloat(p.toFixed(2)));
			}
			else {
				vertices2.push(antVerticesX[i]);
			}

		}

	}

	var i;
	var next = -1;

	for (i = 0; i < antVerticesX.length; i++) {

		if (x != 7) { // last iteretion doesnt need to calculate de next
			if (i == 0 || i == next) {
				var d = antVerticesX[i];
				atualVerticesX[i] = parseFloat((d + 0.2).toFixed(2));
				next = i + 3;
			}
			vertices2.push(atualVerticesX[i]);
		}
	}

}
black = [
	0, 0, 0,
	0, 0, 0,
	0, 0, 0,
	0, 0, 0,
	0, 0, 0,
	0, 0, 0
];

white = [
	1, 1, 1,
	1, 1, 1,
	1, 1, 1,
	1, 1, 1,
	1, 1, 1,
	1, 1, 1
];
var colors2 = [];

var color1 = white;
var color2 = black;

for (var x = 0; x < 8; x++) {
	//alternating between black and white in start collumn tile
	var tmpColor = color1;
	color1 = color2;
	color2 = tmpColor;

	for (var y = 0; y < 8; y++) {
		if (y % 2 == 0) {

			colors2 = colors2.concat(color1);
		}
		else {
			colors2 = colors2.concat(color2);
		}
	}

}

var normalCor = [ // normal for white squares
	0.0, -1.0, .6,

	0.0, -1.0, .6,

	0.0, -1.0, .6,

	0.0, -1.0, .6,

	0.0, -1.0, .6,

	0.0, -1.0, .6,
];

var normalPreto = [ // normal for black squares
	0.0, 0.0, 0.0,
	0.0, 0.0, 0.0,
	0.0, 0.0, 0.0,

	0.0, 0.0, 0.0,
	0.0, 0.0, 0.0,
	0.0, 0.0, 0.0,

];
	
var color1 = normalCor;
var color2 = normalPreto;
for (var x = 0; x < 8; x++) {
	//alternating between black and white in start collumn tile
	var tmpColor = color1;
	color1 = color2;
	color2 = tmpColor;

	for (var y = 0; y < 8; y++) {
		if (y % 2 == 0) {

			normals = normals.concat(color1);
		}
		else {
			normals = normals.concat(color2);
		}
	}

}

var normalHorse = [

	//esq
	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	//dir
	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,
	//frente
	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	//tras
	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

	0.0, 1.0, -0.6,

];


var normalSelectTile = [
	-1.0, 0.0, 0.0,

	-1.0, 0.0, 0.0,

	-1.0, 0.0, 0.0,


	-1.0, 0.0, 0.0,

	-1.0, 0.0, 0.0,

	-1.0, 0.0, 0.0,
];

// normals borda
for (var i = 0; i < 5; i++) {
	normals = normals.concat(normalPreto);
}

normals = normals.concat(normalHorse);

var horse3D = [

	//esq
	- 0.8, 0.8, 0.0,
	-0.8, 0.6, 0.0,
	-0.7, 0.7, 0.2,

	//direita
	- 0.6, 0.8, 0.0,
	-0.7, 0.7, 0.2,
	-0.6, 0.6, 0.0,

	//frente
	-0.8, 0.6, 0.0,
	-0.6, 0.6, 0.0,
	-0.7, 0.7, 0.2,

	//trás
	-0.8, 0.8, 0.0,
	-0.7, 0.7, 0.2,
	-0.6, 0.8, 0.0,
	
];

var horse2D =
	[
		-0.8, 0.6, 0.0,
		-0.6, 0.6, 0.0,
		-0.7, 0.8, 0.0,

	];

var colorHorse2D =
	[
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

	];

var edge1Vertices = [
	-0.8, -0.8, 0.0,
	-0.8, -0.8, -0.2,
	0.8, -0.8, -0.2,

	0.8, -0.8, -0.2,
	0.8, -0.8, 0.0,
	-0.8, -0.8, 0.0,
];

var opEdge1Vertices = [
	-0.8, 0.8, 0.0,
	0.8, 0.8, -0.2,
	-0.8, 0.8, -0.2,


	0.8, 0.8, -0.2,
	-0.8, 0.8, 0.0,
	0.8, 0.8, 0.0,

];

var edge2Vertices = [
	0.8, -0.8, 0.0,
	0.8, -0.8, -0.2,
	0.8, 0.8, -0.2,

	0.8, -0.8, 0.0,
	0.8, 0.8, -0.2,
	0.8, 0.8, 0.0,

];

var opEdge2Vertices = [
	-0.8, -0.8, 0.0,
	-0.8, 0.8, -0.2,
	-0.8, -0.8, -0.2,

	-0.8, -0.8, 0.0,
	-0.8, 0.8, 0.0,
	-0.8, 0.8, -0.2,
];

var botEdgeVertices = [
	-0.8, -0.8, -0.2,
	0.8, 0.8, -0.2,
	0.8, -0.8, -0.2,

	-0.8, -0.8, -0.2,
	-0.8, 0.8, -0.2,
	0.8, 0.8, -0.2,

];

var selectTile = [//base

	-0.75, 0.75, 0.0,
	-0.75, 0.65, 0.0,
	-0.65, 0.65, 0.0,

	-0.75, 0.75, 0.0,
	-0.65, 0.65, 0.0,
	-0.65, 0.75, 0.0
];


vertices = vertices2.slice();

vertices2 = vertices2.concat(horse2D);
colors2 = colors2.concat(colorHorse2D);

vertices = vertices.concat(edge1Vertices);
vertices = vertices.concat(opEdge1Vertices);
vertices = vertices.concat(edge2Vertices);
vertices = vertices.concat(opEdge2Vertices);
vertices = vertices.concat(botEdgeVertices);

vertices = vertices.concat(horse3D);

// algorithm knights tour
// --------------------------------------- // 

// visited = [[0 for x in range(N)] for y in range(N)]


let visited = [
	0, 0, 0, 0, 0, 0, 0, 0, // row 0
	0, 0, 0, 0, 0, 0, 0, 0, // row 1  
	0, 0, 0, 0, 0, 0, 0, 0, // row 2
	0, 0, 0, 0, 0, 0, 0, 0,

	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	//c0 c1 c2
]



var pathRow1 = [2, 1, -1, -2, -2, -1, 1, 2];
var pathCol1 = [1, 2, 2, 1, -1, -2, -2, -1];



function getValidMoves(x, y) {
	
	var validMovesX = new Array();
	var validMovesY = new Array();
	
	for (var i = 0; i < pathRow1.length; i++) {
		var rowNew = x + pathRow1[i];
		var colNew = y + pathCol1[i];


		if (IfValidMove(rowNew, colNew)) {
			validMovesX.push(pathRow1[i]);
			validMovesY.push(pathCol1[i]);
		}
		
	}

	return [validMovesX, validMovesY];

}

function movesSortedbyNumNextValidMoves(x, y) {
	var moves = getValidMoves(x, y);
	
	var nextValidMovesX = moves[0];
	
	var nextValidMovesY = moves[1];

	
	var arrIndex = [];
	var arrNum = [];

	for (var i = 0; i < nextValidMovesX.length; i++) {
		
		var valid = getValidMoves(x + nextValidMovesX[i], y + nextValidMovesY[i]);

		arrIndex.push(i);
		arrNum.push(valid[0].length)
		
	}
	
	return bubbleSort([arrIndex, arrNum]);
}

function bubbleSort(arr2) { //ordenar por ordem decrescente
	let noSwaps;
	

	var arr0 = arr2[0]; // index
	var arr1 = arr2[1]; //nº de possibilidades do prox movimento
	for (let i = arr0.length; i > 0; i--) {
		noSwaps = true;
		for (let j = 0; j < i - 1; j++) {
			if (arr1[j + 1] < arr1[j]) {
				
				[arr1[j + 1], arr1[j]] = [arr1[j], arr1[j + 1]];
				[arr0[j + 1], arr0[j]] = [arr0[j], arr0[j + 1]];
				
				noSwaps = false;
			}
		}
		// End the iterations if there were no swaps made in one full pass
		if (noSwaps) {
			break;
		}
	}

	return [arr0, arr1];
}

function knightTour(row, col, move) {
	
	if (move == 64) {
		for (var i = 0; i < 64; i++) {

			tour.push(visited[i]);
		}
		return true;
	}
	
	var moves = getValidMoves(row, col); 
	var validMovesX = moves[0];
	var validMovesY = moves[1];

	var bestMoves = movesSortedbyNumNextValidMoves(row, col);
	var indexMoves = bestMoves[0];

	for (var i = 0; i < indexMoves.length; i++) {

		var rowNew = row + validMovesX[indexMoves[i]];
		var colNew = col + validMovesY[indexMoves[i]];

		if (IfValidMove(rowNew, colNew)) {
			move++;
			visited[rowNew * 8 + colNew] = move;

			if (knightTour(rowNew, colNew, move )) {
				return true;
			}

			else {
			
				visited[rowNew * 8 + colNew] = 0;
			}

		}
	}
	return false;
}

function IfValidMove(rowNew, colNew) {

	if ((rowNew >= 0) && (rowNew < 8) && (colNew >= 0) && (colNew < 8) && (visited[rowNew * 8 + colNew] == 0 )) {
		
		return true;
	}
	return false;
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Color Buffers

function initBuffers() {

	// Coordinates

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram1.vertexPositionAttribute,
		triangleVertexPositionBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

	// Colors
	/*

	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram1.vertexColorAttribute,
		triangleVertexColorBuffer.itemSize,
		gl.FLOAT, false, 0, 0);
	*/
	// Vertex Normal Vectors

	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = normals.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram1.vertexNormalAttribute,
		triangleVertexNormalBuffer.itemSize,
		gl.FLOAT, false, 0, 0);	
}

function initVertexBuffer2() {
	
	triangleVertexPositionBuffer2 = gl2.createBuffer();
	gl2.bindBuffer(gl2.ARRAY_BUFFER, triangleVertexPositionBuffer2);
	gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertices2), gl2.STATIC_DRAW);
	triangleVertexPositionBuffer2.itemSize = 3;
	triangleVertexPositionBuffer2.numItems = vertices2.length / 3;

	// Associating to the vertex shader

	gl2.vertexAttribPointer(shaderProgram2.vertexPositionAttribute,
		triangleVertexPositionBuffer2.itemSize, gl2.FLOAT, false, 0, 0);

	triangleVertexColorBuffer2 = gl2.createBuffer();
	gl2.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer2);
	gl2.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors2), gl.STATIC_DRAW);
	triangleVertexColorBuffer2.itemSize = 3;
	triangleVertexColorBuffer2.numItems = colors2.length / 3;

	// Associating to the vertex shader

	gl2.vertexAttribPointer(shaderProgram2.vertexColorAttribute,
		triangleVertexColorBuffer2.itemSize,
		gl2.FLOAT, false, 0, 0);
}

//  Drawing the 3D scene
function drawScene() {

	var pMatrix;
		
	pMatrix = perspective( 45, 1, 0.05, 15 );
		
		
	if (tz == 0.0) {

		tz = -1.5;

	}

	pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
	pos_Viewer[3] = 1.0;  
	

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram1, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));


	// Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram1, "viewerPosition"),
        flatten(pos_Viewer) );
	
	
	// FOR EACH LIGHT SOURCE
	    
	for (var i = 0; i < lightSources.length; i++) {
		// Animating the light source, if defined

		var lightSourceMatrix = mat4();

		if (!lightSources[i].isOff()) {

			if (lightSources[i].isRotYYOn()) {
				lightSourceMatrix = mult(
					lightSourceMatrix,
					rotationYYMatrix(lightSources[i].getRotAngleYY()));
			}
		}

		// NEW Passing the Light Souree Matrix to apply

		var lsmUniform = gl.getUniformLocation(shaderProgram1, "allLights[" + String(i) + "].lightSourceMatrix");

		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}

	
	drawModel(tx, ty, tz, 0.53 * sx, 0.53 * sy, 0.53 *sz, -60 + -angleXX, angleYY, angleZZ);
		
}

function drawModel(tx, ty, tz, sx, sy, sz, angleXX, angleYY, angleZZ) {

	var mvMatrix = mult(rotationZZMatrix(angleZZ),

		scalingMatrix(sx, sy, sz));

	mvMatrix = mult(rotationYYMatrix(angleYY), mvMatrix);

	mvMatrix = mult(rotationXXMatrix(angleXX), mvMatrix);

	mvMatrix = mult(translationMatrix(tx, ty, tz), mvMatrix);

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram1, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	initBuffers();
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram1, "k_ambient"), 
		flatten(kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram1, "k_diffuse"),
        flatten(kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram1, "k_specular"),
        flatten(kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram1, "shininess"), 
		nPhong);

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram1, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram1, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram1, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram1, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }


	// Drawing the contents of the vertex buffer

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	if (primitiveType == gl.LINE_LOOP) {


		var i;

		for (i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++) {

			gl.drawArrays(primitiveType, 3 * i, 3);
		}
	}
	else {

		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);

	}
}


//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;
var delay = 0;
var speed = 1000;
var posAtual = 0;
var prevCoordX = 0;
var prevCoordY = 0;

var prevCoordX2 = 0;
var prevCoordY2 = 0;;
var count = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if (timeNow >= delay + speed) {
	
		var i;
		if (lastTime != 0) {
			
			if (calcTour) {
				posAtual++;
				if (count == 0) {
					
					prevCoordX = posX;
					prevCoordY = -posY;
					
				}
				count++;
				
				for (i = 0; i < tour.length; i++) {
					if (posAtual + 1 == tour[i]) {
						break;
					}
				}
				if (i != 64) {
					coordX = i % 8;
					coordY = Math.floor(i / 8);
					
					coordX2 = i % 8;
					coordY2 = Math.floor(i / 8);	

					for (var j = 0; j < horse3D.length / 3; j++) { //translation horse
						var nextX = horse3D[3 * j] + 0.2 * (coordX - prevCoordX);
						var nextY = horse3D[3 * j + 1] - 0.2 * (coordY - prevCoordY);
						
						horse3D[3 * j] = parseFloat(nextX.toFixed(2));
						horse3D[3 * j + 1] = parseFloat(nextY.toFixed(2));
					}
					translationTile(coordX - prevCoordX, -(coordY - prevCoordY));

					prevCoordX = coordX;
					prevCoordY = coordY;

					vertices.splice(vertices.length - horse3D.length);
					normals.splice(normals.length - normalHorse.length);
		
					vertices = vertices.concat(selectTile);
					normals = normals.concat(normalSelectTile); //add normals select tile

					vertices = vertices.concat(horse3D);
					normals = normals.concat(normalHorse);

					for (var k = 0; k < horse2D.length / 3; k++) { //translation horse2D
						var nextX2 = horse2D[3 * k] + 0.2 * (coordX2 - prevCoordX2);
						var nextY2 = horse2D[3 * k + 1] - 0.2 * (coordY2 - prevCoordY2);
						
						horse2D[3 * k] = parseFloat(nextX2.toFixed(2));
						horse2D[3 * k + 1] = parseFloat(nextY2.toFixed(2));
					}

					prevCoordX2 = coordX2;
					prevCoordY2 = coordY2;

					vertices2.splice(vertices2.length - 9);
					vertices2 = vertices2.concat(horse2D);
				}
			}
		}
		delay = timeNow;
	}
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;
		for (var i = 0; i < lightSources.length; i++) {
			if (lightSources[i].isRotXXOn()) {

				var angle = lightSources[i].getRotAngleXX() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleXX(angle);
			}

			if (lightSources[i].isRotYYOn()) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleYY(angle);
			}

			if (lightSources[i].isRotZZOn()) {

				var angle = lightSources[i].getRotAngleZZ() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleZZ(angle);
			}
		}
	}
	lastTime = timeNow;
	
}
	


//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

function handleKeys() {

	if (currentlyPressedKeys[33]) {
		
		// Page Up
		
		sx *= 0.9;
		
		sz = sy = sx;
	}
	if (currentlyPressedKeys[34]) {
		
		// Page Down
		
		sx *= 1.1;
		
		sz = sy = sx;
	}
	if (currentlyPressedKeys[37]) {
		
		// Left cursor key
		if (!calcTour) {
			galopar.play();
			translationHorse(-1, 0);
        }
		
	}
	if (currentlyPressedKeys[39]) {// Right cursor key
		if (!calcTour) {
			galopar.play();
			translationHorse(1, 0);
		}
	}
	if (currentlyPressedKeys[38]) {

		// Up cursor key
		if (!calcTour) {
			galopar.play();
			translationHorse(0, 1);
		}
	}
	if (currentlyPressedKeys[40]) {

		// Down cursor key
		if (!calcTour) {
			galopar.play();
			translationHorse(0, -1);
		}
	}

	if (currentlyPressedKeys[13]) {

		// Enterr key
		if (!calcTour) {
			enter.play();
			visited[-posY * 8 + posX] = 1; // starts at 0
			console.log(visited);
			knightTour(-posY, posX, 1);
		
			document.getElementById("tour").innerHTML = tour.slice(0, 8);
			document.getElementById("tour1").innerHTML = tour.slice(8, 16);
			document.getElementById("tour2").innerHTML = tour.slice(16, 24);
			document.getElementById("tour3").innerHTML = tour.slice(24, 32);
			document.getElementById("tour4").innerHTML = tour.slice(32, 40);
			document.getElementById("tour5").innerHTML = tour.slice(40, 48);
			document.getElementById("tour6").innerHTML = tour.slice(48, 56);
			document.getElementById("tour7").innerHTML = tour.slice(56, 64);

			calcTour = true;
		}
	}
}

//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com


var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {
	
    mouseDown = true;
  
    lastMouseX = event.clientX;
  
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {
	  
      return;
    } 
  
    // Rotation angles proportional to cursor displacement
    
    var newX = event.clientX;
  
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    
    angleYY += radians( 10 * deltaX  )

    var deltaY = newY - lastMouseY;
    
    angleXX += radians( 10 * deltaY  )
    
    lastMouseX = newX
    
    lastMouseY = newY;
  }
//----------------------------------------------------------------------------

function translationTile(valueX, valueY) {
	console.log(valueX, valueY);
	tileAnt = selectTile.slice();
	
	for (var j = 0; j < selectTile.length / 3; j++) { //translation horse

		var nextX = selectTile[3 * j] + 0.2 * valueX;
		var nextY = selectTile[3 * j + 1] + 0.2 * valueY;
		
		if (nextX > 0.80 || nextX < -0.80 || nextY > 0.80 || nextY < -0.80) {

			selectTile = tileAnt.slice();
		
			break;
		}
		selectTile[3 * j] = parseFloat(nextX.toFixed(2));
		selectTile[3 * j + 1] = parseFloat(nextY.toFixed(2));
	}

}

function translationHorse(valueX, valueY) { // translation with keys
	console.log(valueX, valueY);
	horseAnt = horse3D.slice();
	posXAnt = posX;
	posYAnt = posY;

	posX += valueX;
	posY += valueY;

	translationTile(valueX, valueY);

	for (var j = 0; j < horse3D.length / 3; j++) { //translation horse
	
		var nextX = horse3D[3 * j] + 0.2 * valueX;
		var nextY = horse3D[3 * j + 1] + 0.2 * valueY;

		if (nextX > 0.80 || nextX < -0.80 || nextY > 0.80 || nextY < -0.80) {
			
			horse3D = horseAnt.slice();
			posX = posXAnt;
			posY = posYAnt;
			break;
        }
		horse3D[3 * j] = parseFloat(nextX.toFixed(2));
		horse3D[3 * j + 1] = parseFloat(nextY.toFixed(2));
	}
	vertices.splice(vertices.length - horse3D.length);
	vertices = vertices.concat(horse3D);
}

// Timer
var delay1 = 0;
function tick() {
	
	requestAnimFrame(tick);
	
	// NEW --- Processing keyboard events 
	var timeNow = new Date().getTime();


	if (timeNow >= delay1 + 70) {
		handleKeys();
		delay1 = timeNow;

	}

	drawScene();
	drawScene2();
	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//


//----------------------------------------------------------------------------

function setEventListeners( canvas ){
	
	// NEW ---Handling the mouse
	
	// From learningwebgl.com

    canvas.onmousedown = handleMouseDown;
    
    document.onmouseup = handleMouseUp;
    
    document.onmousemove = handleMouseMove;
    
    // NEW ---Handling the keyboard
	
	// From learningwebgl.com

    function handleKeyDown(event) {
		
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
		
        currentlyPressedKeys[event.keyCode] = false;
    }

	document.onkeydown = handleKeyDown;
    
    document.onkeyup = handleKeyUp;
	
	   
    // NEW --- Dropdown list

	var list = document.getElementById("rendering-mode-selection");

	list.addEventListener("click", function () {

		// Getting the selection

		var mode = list.selectedIndex;

		switch (mode) {

			case 0: primitiveType = gl.TRIANGLES;
				break;

			case 1: primitiveType = gl.LINE_LOOP;
				break;

			case 2: primitiveType = gl.POINTS;
				break;
		}

		// Rendering

		drawScene();

	});

	      
     // Button events

	document.getElementById("move-left-button").onclick = function () {

		// Updating

		tx -= 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("move-right-button").onclick = function () {

		// Updating

		tx += 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("move-up-button").onclick = function () {

		// Updating

		ty += 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("move-down-button").onclick = function () {

		// Updating

		ty -= 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("move-front-button").onclick = function () {

		// Updating

		tz += 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("move-back-button").onclick = function () {

		// Updating

		tz -= 0.20;

		// Render the viewport

		drawScene();
	};

	document.getElementById("scale-up-button").onclick = function () {

		// Updating

		sx *= 1.1;

		sy *= 1.1;

		sz *= 1.1;

		// Render the viewport

		drawScene();
	};

	document.getElementById("scale-down-button").onclick = function () {

		// Updating

		sx *= 0.9;

		sy *= 0.9;

		sz *= 0.9;

		// Render the viewport

		drawScene();
	};

	document.getElementById("speed").onclick = function () {
		speed -= 100;
		
	};

	document.getElementById("break").onclick = function () {
		speed += 100;
	};

	document.getElementById("XX-rotate-CW-button").onclick = function () {

		// Updating

		angleXX -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("XX-rotate-CCW-button").onclick = function () {

		// Updating

		angleXX += 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("YY-rotate-CW-button").onclick = function () {

		// Updating

		angleYY -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("YY-rotate-CCW-button").onclick = function () {

		// Updating

		angleYY += 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("ZZ-rotate-CW-button").onclick = function () {

		// Updating

		angleZZ -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("ZZ-rotate-CCW-button").onclick = function () {

		// Updating

		angleZZ += 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("reset-button").onclick = function () {
		location.reload();
		return false;
	};

	document.getElementById("start-button").onclick = function () {
		if (!calcTour) {
			console.log(posX, posY);

			visited[-posY * 8 + posX] = 1; // starts at 0
			console.log(visited);
			knightTour(-posY, posX, 1);

			calcTour = true;
		}
	};
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL(canvas) {
	try {

		// Create the WebGL context

		// Some browsers still need "experimental-webgl"

		wgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas 

		// DEFAULT: The viewport background color is WHITE

		// NEW - Drawing the triangles defining the model

		primitiveType = wgl.TRIANGLES;

		// DEFAULT: Face culling is DISABLED

		// Enable FACE CULLING

		wgl.enable(wgl.CULL_FACE);

		wgl.cullFace(wgl.BACK);

		//wgl.enable( gl.DEPTH_TEST );


	} catch (e) {
	}
	if (!wgl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}

	return wgl;
}

function drawScene2() {

	// Clearing with the background color

	//gl2.clear(gl2.COLOR_BUFFER_BIT);

	initVertexBuffer2();
	// Drawing the contents of the vertex buffer

	gl2.drawArrays(gl2.TRIANGLES, 0, triangleVertexPositionBuffer2.numItems);
}
//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");

	var canvas2D = document.getElementById("2Dcanvas");
	
	gl = initWebGL(canvas);
	gl.clearColor(0.25, 0.50, 0.50, 1.0);
	gl2 = initWebGL(canvas2D);
	gl2.clearColor(0.25, 0.50, 0.50, 1.0);   

	shaderProgram1 = initShaders();
	shaderProgram2 = initShaders2();
	
	setEventListeners( canvas );
	
	initBuffers();
	initVertexBuffer2();

	tick();		// A timer controls the rendering / animation    

}


