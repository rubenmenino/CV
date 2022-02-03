//////////////////////////////////////////////////////////////////////////////
//
//  initShaders.js 
//
//	Getting, compiling and linking the vertex and the fragment shaders
//
//  J. Madeira - October 2015
//
//////////////////////////////////////////////////////////////////////////////


// Getting and compiling a shader

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

//----------------------------------------------------------------------------

// Initializing the shader program

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	// Coordinates 
	
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	// Colors 
	
	//shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	//gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	// Vertex Normals 
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	return shaderProgram;
}

function initShaders2() {
	var fragmentShader = getShader(gl2, "shader-fs2");
	var vertexShader = getShader(gl2, "shader-vs2");

	var shaderProgram = gl2.createProgram();
	gl2.attachShader(shaderProgram, vertexShader);
	gl2.attachShader(shaderProgram, fragmentShader);
	gl2.linkProgram(shaderProgram);

	if (!gl2.getProgramParameter(shaderProgram, gl2.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl2.useProgram(shaderProgram);

	// Coordinates 

	shaderProgram.vertexPositionAttribute = gl2.getAttribLocation(shaderProgram, "aVertexPosition");
	gl2.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	// Colors 

	shaderProgram.vertexColorAttribute = gl2.getAttribLocation(shaderProgram, "aVertexColor");
	gl2.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	return shaderProgram;
}
