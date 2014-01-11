//WebGL (C) Wesley Reardan 2013

function SceneSolarSystem () {
	Scene.call(this);	//Call the Parent Constructor

	this.cameraPosition = [0, 0, 10];
}

//inheritance
SceneSolarSystem.prototype = new Scene();
SceneSolarSystem.prototype.constructor = SceneSolarSystem;

Scene.prototype.Initialize = function () {
	this.InitializeShaders();

	//create post processing framebuffer
	this.fbo = new PostProcess();
	this.fbo.Initialize(1024, 768);

	//create sun
	var pos = vec3.fromValues(0, 0, 0);
	var sun = new Planet("img/sun4.jpg", 2, pos);
	sun.Initialize();
	this.objects.push(sun);

	//create stars
	var pos = vec3.fromValues(0, 0, 0);
	var stars = new Planet("img/stars6.jpg", 50, pos);
	stars.Initialize();
	stars.mesh.textureOnly = true;
	this.objects.push(stars);

	//create earth
	var earth = new Planet("img/earth.jpg", 2);
	earth.Initialize();
	earth.Orbit(sun, 5, 0.1);
	this.objects.push(earth);

	//create mars
}

Scene.prototype.InnerDraw = function () {
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].Draw(this.shader, this.solidShader, 
			this.modelviewMatrix, this.projectionMatrix);
	}
}