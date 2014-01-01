//WebGL (C) Wesley Reardan 2013
function PostProcess() {
	this.fbo = null;
	this.shader = null;
	this.square = null;
	this.numEffects = 1;
	this.currentEffect = 0;
}


PostProcess.prototype.Initialize = function (width, height) {
	//Initialize Shader

	//Initialize Framebuffer
	this.fbo = new Framebuffer();
	this.fbo.Initialize(width, height);

	//Generate square VBO
	//
}

PostProcess.prototype.Bind = function () {
}

PostProcess.prototype.Unbind = function () {
}

PostProcess.prototype.Render = function () {
}

PostProcess.prototype.ChangeEffect = function () {
	this.currentEffect = (this.currentEffect + 1) % this.numEffects;
}

PostProcess.prototype.Dispose = function () {
}


