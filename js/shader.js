//WebGL (C) Wesley Reardan 2013
function Shader() {
	this.shaderProgram = null;
	this.linked = false;
	this.uniformLocations = {};
	this.attributes = {};
	this.uniforms = {};
}
Shader.prototype.Init = function(vertexShader, fragmentShader) {
	this.CompileShaderFromScript(vertexShader);
	this.CompileShaderFromScript(fragmentShader);
	this.Link();
	this.Use();
}
Shader.prototype.InitFromFiles = function(vertexShaderFilename, fragmentShaderFilename, callback) {
	this.CompileShaderFromFile(vertexShaderFilename, callback);
	this.CompileShaderFromFile(fragmentShaderFilename, callback);
}
Shader.prototype.CompileShaderFromFile = function(fileName, callback) {
	var extension = fileName.substring(fileName.lastIndexOf('.')+1);
	var shader = this;
	$.ajax({
		url: fileName,
		success: function( data ) {
		shader.CompileShader(data, extension);
		if(shader.fragmentShader && shader.vertexShader) {
			try {
				shader.Link();
				shader.Use();
				console.log("fragment shader and vertex shader loaded successfully");
				if(callback) callback();
			} catch(e) {
				throw("Unable to Link/Use the shader program even though they loaded successfully: " + e);
			}
		}
	}
	});
}

Shader.prototype.CompileShader = function(shaderSourceString, type) {
	var shader;
	switch(type) {
		case "frag":
		case "fs":
		case "shader-fs":
			this.fragmentShader = shader = gl.createShader(gl.FRAGMENT_SHADER);
			break;
		case "vert":
		case "vs":
		case "shader-vs":
			this.vertexShader = shader = gl.createShader(gl.VERTEX_SHADER);
			break;
		default:
			throw("invalid shader type: " + type);
	}
	gl.shaderSource(shader, shaderSourceString);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    throw ("'" + shaderSourceString +
            "' Error occurred: " + gl.getShaderInfoLog(shader));
	}
}

//https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding_2D_content_to_a_WebGL_context
Shader.prototype.CompileShaderFromScript = function(scriptElementName) {
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
	}	if(shaderScript.type == "x-shader/x-fragment") {
		this.CompileShader(theSource, "fs");
	} else if (shaderScript.type == "x-shader/x-vertex") {
		this.CompileShader(theSource, "vs");
	} else {
		throw("Script Element from Shader Type '" + shaderScript.type + "' not recognized: ");
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
Shader.prototype.BindAttribute = function(attributeName, num_elements, stride, offset) {
	if(this.shaderProgram) {
		var attribute = this.attributes[attributeName];
		if(attribute == null || attribute == -1) {
			attribute = gl.getAttribLocation(this.shaderProgram, attributeName);
			gl.enableVertexAttribArray(attribute);
			this.attributes[attributeName] = attribute;
		}
		gl.vertexAttribPointer(attribute, num_elements, gl.FLOAT, false, stride, offset);
	}
};
Shader.prototype.SetUniform = function(uniformName, value, isInt) {
	if(this.shaderProgram) {
		if(this.uniforms[uniformName] == null || this.uniforms[uniformName] == -1) {
			this.uniforms[uniformName] = gl.getUniformLocation(this.shaderProgram, uniformName);
		}
		if(this.uniforms[uniformName] == null || this.uniforms[uniformName] == -1
				|| this.shaderProgram == null || this.shaderProgram == -1) {
			console.log("Problem in Shader.SetUniform()");
			return;
		}
		if(!value.length) {
			if(!isInt)
				gl.uniform1f(this.uniforms[uniformName], value);
			else
				gl.uniform1i(this.uniforms[uniformName], value);
		}
		else {
			switch (value.length) {
			case 2:
				gl.uniform2fv(this.uniforms[uniformName], value);
				break;
			case 3:
				gl.uniform3fv(this.uniforms[uniformName], value);
				break;
			case 4:
				gl.uniform4fv(this.uniforms[uniformName], value);
				break;
			case 9:
				gl.uniformMatrix3fv(this.uniforms[uniformName], false, value);
				break;
			case 16:
				gl.uniformMatrix4fv(this.uniforms[uniformName], false, value);
				break;
			default:
				throw ("Shader.SetUniform: unsupported type for parameter 'value'");
			}
		}
	}
};
Shader.prototype.PrintActiveUniforms = function() {
};
Shader.prototype.PrintActiveUniformBlocks = function() {
};
Shader.prototype.PrintActiveAttribs = function() {
};


Shader.prototype.Dispose = function() {
	if(this.vertexShader)	gl.deleteShader(this.vertexShader);
	if(this.fragmentShader)	gl.deleteShader(this.fragmentShader);
	if(this.shaderProgram)	gl.deleteProgram(this.shaderProgram);
};