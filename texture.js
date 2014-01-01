//WebGL (C) Wesley Reardan 2014
function Texture() {
	this.handle = null;
}

Texture.prototype.Initialize = function (width, height, filename) {
	//Create the texture object
	this.handle = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(GL_TEXTURE_2D, this.handle);


	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
		gl.UNSIGNED_BYTE, null);

	//Set texture parameters for any size image
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture.prototype.Bind = function (number) {
	
}

Texture.prototype.Unbind = function () {
	
}

Texture.prototype.Dispose = function () {
	gl.deleteTexture(this.handle);
	this.handle = null;
}

