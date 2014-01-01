//WebGL (C) Wesley Reardan 2013
function Framebuffer() {
	this.fbo = null;
	this.textureHandle = null;

}

Framebuffer.prototype.Initialize = function (width, height) {
	//Generate and bind Framebuffer
	this.fbo = gl.createFramebuffer();
	this.Bind();

	//Create the texture object
	this.textureHandle = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(GL_TEXTURE_2D, this.textureHandle);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
		gl.UNSIGNED_BYTE, null);

	//Set texture parameters for any size image
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.bindTexture(gl.TEXTURE_2D, null);
	this.Unbind();
}

Framebuffer.prototype.Bind = function () {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
}

Framebuffer.prototype.Unbind = function () {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

Framebuffer.prototype.Dispose = function () {
	gl.deleteFramebuffer(this.fbo);
	this.fbo = null;
	gl.deleteTexture(this.textureHandle);
	this.textureHandle = null;
}


