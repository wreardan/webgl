//WebGL (C) Wesley Reardan 2013
function Framebuffer() {
	this.framebuffers = [];
	this.textures = [];
	this.renderbuffers = [];
}

Framebuffer.prototype.CreateTexture = function () {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	return texture;
}

Framebuffer.prototype.Initialize = function (width, height) {
	for(var i = 0; i < 2; i++) {
		var texture = this.CreateTexture();
		this.textures.push[texture];
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
			gl.RGBA, gl.UNSIGNED_BYTE, null);
		var fbo = gl.createFramebuffer();
		this.framebuffers.push(fbo);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
			gl.TEXTURE_2D, texture, 0);
	}
}

Framebuffer.prototype.Bind = function () {
	var fbo = this.framebuffers[0];
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
}

Framebuffer.prototype.Unbind = function () {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

Framebuffer.prototype.Dispose = function () {
	gl.deleteFramebuffer(this.fbo);
	this.fbo = null;
	this.texture.Dispose();
	this.texture = null;
}


