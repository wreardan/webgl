//WebGL (C) Wesley Reardan 2013
function Shader() {
	this.shaderProgram = null;
	this.linked = false;
	this.uniformLocations = {};
	this.attributes = {};
	this.uniforms = {};
}
Shader.prototype.Init = function(vertexShader, fragmentShader) {
	this.CompileShader(vertexShader);
	this.CompileShader(fragmentShader);
  shader.Link();
  shader.Use();
}

//https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding_2D_content_to_a_WebGL_context
Shader.prototype.CompileShader = function(scriptElementName) {
// Check the file name's extension to determine the shader type:
//{".vs", VERTEX}, {".vert", VERTEX}, {".fs", GLSLShader::FRAGMENT}, {".frag", GLSLShader::FRAGMENT}  
	var shaderScript, theSource, currentChild, shader;
	shaderScript = document.getElementById(scriptElementName);
	if(!shaderScript)
		throw("Unable to Find Shader: " + scriptElementName);
	theSource = "";
	currentChild = shaderScript.firstChild;
	while(currentChild) {
		if(currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}
	if(shaderScript.type == "x-shader/x-fragment") {
		this.fragmentShader = shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		this.vertexShader = shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		throw("Shader Type '" + shaderScript.type + "' not recognized: ");
	}
	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    throw ("'" + scriptElementName +
            "' Error occurred: " + gl.getShaderInfoLog(shader));
	}
};
Shader.prototype.Link = function() {
	var shaderProgram;
	
	shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, this.vertexShader);
  gl.attachShader(shaderProgram, this.fragmentShader);
  gl.linkProgram(shaderProgram);
  
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw("Unable to initialize the shader program.");
  }
  
  this.shaderProgram = shaderProgram;
  this.linked = true;
};
Shader.prototype.Validate = function() {
};
Shader.prototype.Use = function() {
  gl.useProgram(this.shaderProgram);
};
Shader.prototype.EnableAttribute = function(attributeName) {
    if(this.attributes[attributeName] == null || this.attributes[attributeName] == -1) {
		this.attributes[attributeName] = gl.getAttribLocation(this.shaderProgram, attributeName);
		gl.enableVertexAttribArray(this.attributes[attributeName]);
	}
};
Shader.prototype.BindAttribute = function(attributeName, num_elements, stride, offset) {
    gl.vertexAttribPointer(shader.attributes[attributeName], num_elements, gl.FLOAT, false, stride, offset);
};
Shader.prototype.SetUniform = function(uniformName, value) {
	if(this.uniforms[uniformName] == null) {
		this.uniforms[uniformName] = gl.getUniformLocation(this.shaderProgram, uniformName);
	}
	if(!value.length && !(value.elements && value.elements.length)) {
		if(typeof(value) == "number")
			gl.uniform1f(this.uniforms[uniformName], value);
		else
			gl.uniform1i(this.uniforms[uniformName], value);
	} else if (value.length == 2) {
	    gl.uniform2fv(this.uniforms[uniformName], value);
	} else if (value.length == 3) {
	    gl.uniform3fv(this.uniforms[uniformName], value);
	} else if (value.length == 4) {
	    gl.uniform4fv(this.uniforms[uniformName], value);
	} else if (value.length == 9) {
	    gl.uniformMatrix3fv(this.uniforms[uniformName], false, value);
	} else if (value.length == 16) {
	    gl.uniformMatrix4fv(this.uniforms[uniformName], false, value);
	}
	else throw ("Shader.SetUniform: unsupported type for parameter 'value'");
};
Shader.prototype.PrintActiveUniforms = function() {
};
Shader.prototype.PrintActiveUniformBlocks = function() {
};
Shader.prototype.PrintActiveAttribs = function() {
};