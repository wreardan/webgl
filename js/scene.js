//WebGL (C) Wesley Reardan 2013
function Scene() {
	//all scenes
	this.objects = [];

	//camera stuff
	this.width = 0;
	this.height = 0;
	this.cameraPosition = [-3, 0, 3];
	this.cameraTarget = [0, 0, 0];
	this.cameraUp = [0, 1, 0];
	this.projectionMatrix = mat4.create();
	this.modelviewMatrix = mat4.create();

	this.shader = null;
	this.solidShader = null;

	//object viewer scene
	this.currentObject = 3;
	this.fbo = null;
	this.fboEnabled = true;
}

//called on window resize events
//call once before initialize
Scene.prototype.Resize = function (width, height) {
	this.width = width;
	this.height = height;

	mat4.perspective(this.projectionMatrix, 45, width / height, 0.1, 100.0);
}

Scene.prototype.InitializeShaders = function () {
	this.shader = new Shader();
	var shader = this.shader;

	this.shader.InitFromFiles("shaders/basic.vs", "shaders/basic.fs", function() {
		/*this.shader.EnableAttribute("VertexPosition");
		this.shader.EnableAttribute("VertexColor");
		this.shader.EnableAttribute("VertexNormal");
		this.shader.EnableAttribute("VertexTexture");*/

		shader.SetUniform("Material.Ka", [0.1, 0.1, 0.1]);
		shader.SetUniform("Material.Kd", [0.9, 0.9, 0.9]);
		shader.SetUniform("Material.Ks", [0.4, 0.4, 0.4]);
		shader.SetUniform("Material.Shininess", 50.0);

		shader.SetUniform("Light[0].Position", [1, 1, 1, 1]);
		shader.SetUniform("Light[0].Intensity", [0.8, 0.8, 1.0]);
		shader.SetUniform("Light[1].Position", [-1, -1, 1, 1]);
		shader.SetUniform("Light[1].Intensity", [0.6, 1.0, 0.6]);
	});

	this.solidShader = new Shader();
	this.solidShader.InitFromFiles("shaders/solid.vs", "shaders/solid.fs");
}


//Create objects required by Scene
Scene.prototype.Initialize = function () {
	this.InitializeShaders();

	//create post processing framebuffer
	this.fbo = new PostProcess();
	this.fbo.Initialize(1024, 768);

	//add objects to scene
	var mesh = new Mesh();
	mesh.Init(20, 20);
	mesh.LoadTexture('img/mars.jpg');
	mesh.BuildNormalVisualizationGeometry();
	this.objects.push(mesh);

	var sphere = new Mesh();
	sphere.Sphere(20, 20);
	sphere.Init(20, 20);
	sphere.LoadTexture('img/mars.jpg');
	sphere.BuildNormalVisualizationGeometry();
	this.objects.push(sphere);

	var cylinder = new Mesh();
	cylinder.Cylinder(20, 20);
	cylinder.Init(20, 20);
	cylinder.LoadTexture('img/metal.jpg');
	cylinder.BuildNormalVisualizationGeometry();
	this.objects.push(cylinder);

	var mars = new Mars();
	mars.InitMars();
	mars.LoadTexture('img/mars.jpg');
	mars.BuildNormalVisualizationGeometry();
	this.objects.push(mars);
}

//update scene's objects
Scene.prototype.Update = function (deltaTime) {
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].Update(deltaTime);
	}
}

Scene.prototype.InnerDraw = function () {

	if(this.currentObject < this.objects.length)
		this.objects[this.currentObject].Draw(this.shader, this.solidShader, 
			this.modelviewMatrix, this.projectionMatrix);
}

//draw the scene
Scene.prototype.Draw = function () {

	if(! this.shader)
		return;

	if(this.fboEnabled)
		this.fbo.Bind();

	//OpenGL enables
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//setup camera
	mat4.lookAt( this.modelviewMatrix, 
		this.cameraPosition, this.cameraTarget, this.cameraUp);

	this.InnerDraw();
	
	//OpenGL disables
	gl.disable(gl.DEPTH_TEST);

	if(this.fboEnabled) {
		this.fbo.Unbind();
		this.fbo.Render();
	}
}

//free scene objects
Scene.prototype.Dispose = function () {
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].Dispose();
	}

	this.shader.Dispose();
	this.solidShader.Dispose();
}


//change current object
Scene.prototype.ChangeObject = function () {
	this.currentObject = (this.currentObject + 1) % this.objects.length;
}

