//WebGL (C) Wesley Reardan 2013
function Framebuffer() {
	this.fbo = null;
	this.texture = null;
	this.renderbuffer = null;
}

Framebuffer.prototype.Initialize = function (width, height) {
	//Generate and bind Framebuffer
	this.fbo = gl.createFramebuffer();
	this.Bind();

	//Create the texture object
	this.texture = new Texture();
	this.texture.InitializeBlank(width, height);
	this.texture.Bind(0);

	//Bind the texture to the framebuffer
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, 
		this.texture.handle, 0);

	//Create the depth buffer
	this.renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER,
		this.renderbuffer);

	//check framebuffer for errors
	var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	switch(status) {
	case gl.FRAMEBUFFER_COMPLETE:
		break;
	case gl.FRAMEBUFFER_UNSUPPORTED:
		throw("FRAMEBUFFER_UNSUPPORTED");
	case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
		throw("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
	case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
		throw("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
	case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
		throw("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
	default:
		throw("Unknown Error");
	}

	//Unbind objects
	//this.texture.Unbind();
	//gl.bindRenderbuffer(gl.RENDERBUFFER, null)
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
	this.texture.Dispose();
	this.texture = null;
}


