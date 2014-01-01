//WebGL (C) Wesley Reardan 2013
function PostProcess() {
	this.fbo = null;
	this.shader = null;
	this.vboSquare = null;
	this.numEffects = 3;
	this.currentEffect = 0;
	this.width = 0;
	this.height = 0;
}


PostProcess.prototype.Initialize = function (width, height) {
	this.width = width;
	this.height = height;
	//Initialize Shader
	this.shader = new Shader();
	this.shader.InitFromFiles("shaders/postprocess.vs", "shaders/postprocess.fs");

	//Initialize Framebuffer
	this.fbo = new Framebuffer();
	this.fbo.Initialize(width, height);

	//Generate square VBO
	var squarePositions = [

		-1.0,  1.0,		// 0, Top Left
		-1.0, -1.0,		// 1, Bottom Left
		1.0, -1.0,		// 2, Bottom Right
		1.0, -1.0,		// 3, Bottom Right
		1.0,  1.0,		// 4, Top Right
		-1.0,  1.0,		// 5, Top Left
/*
		-1.0,  1.0,		// 0, Top Left
		-1.0, -1.0,		// 1, Bottom Left
		1.0, -1.0,		// 2, Bottom Right
		1.0,  1.0,		// 3, Top Right
*/
	];
	this.vboSquare = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboSquare);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squarePositions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

PostProcess.prototype.Bind = function () {
	this.fbo.Bind();
}

PostProcess.prototype.Unbind = function () {
	this.fbo.Unbind();
}

PostProcess.prototype.Render = function (time) {
	//Return if shader hasn't finished loading yet
	if(!this.shader.linked)
		return;
	if(!this.fbo.texture.handle)
		return;

	//Clear Screen
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Set Viewport?
	//Setup shader and vertex attributes
	this.shader.Use();

	//Bind VBO and setup attributes
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboSquare);
	this.shader.BindAttribute("VertexPosition", 2, 8, 0);

	//Set Uniforms (TextureID, WindowSize, Mode, uRandom)
	//this.shader.SetUniform("TextureID", this.fbo.texture.handle);
	this.fbo.texture.Bind(0);
	//mars.textures[0].Bind(0);
	this.shader.SetUniform("TextureID", 0, true);
	this.shader.SetUniform("WindowSize", [this.width, this.height]);
	this.shader.SetUniform("Mode", this.currentEffect, true);
	this.shader.SetUniform("uRandom", 0.0);

	//DrawArrays
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	//Unbind
}

PostProcess.prototype.ChangeEffect = function () {
	this.currentEffect = (this.currentEffect + 1) % this.numEffects;
	return this.currentEffect != 0;
}

PostProcess.prototype.Dispose = function () {
}


