//Planet class


function Planet(texture, size, position, rotationSpeed) {

	//position, rotation, scale, and orbit information
	if(!size) size = 1;
	this.size = size;

	if(!position) position = vec3.create();
	this.position = position;

	if(!rotationSpeed) rotationSpeed = 0.1;
	this.rotationSpeed = rotationSpeed;
	this.rotation = 0;

	this.orbitTarget = null;
	this.orbitDistance = 10.0;
	this.orbitRotation = 0;
	this.orbitSpeed = 1.0;

	//Mesh information
	if(!texture) texture = "img/mars.jpg";
	this.texture = texture;

	this.mesh = null;
}

Planet.prototype.Orbit = function(orbitTarget, distance, speed) {
	this.orbitTarget = orbitTarget;
	this.orbitDistance = distance;
	this.orbitSpeed = speed;
}

Planet.prototype.Initialize = function() {

	var sphere = new Mesh();
	sphere.Sphere(20, 20);
	sphere.Init(20, 20);
	sphere.LoadTexture(this.texture);
	sphere.BuildNormalVisualizationGeometry();
	
	this.mesh = sphere;
}

Planet.prototype.Update = function(deltaTime) {
	if(this.orbitTarget) {
		this.orbitRotation += this.orbitSpeed * deltaTime;

		var pos = vec3.clone(this.orbitTarget.position);
		var radius = vec3.fromValues(0, 0, this.orbitDistance);
		var rot = mat4.create();
		mat4.rotateY(rot, rot, this.orbitRotation); 
		vec3.transformMat4(radius, radius, rot);
		vec3.add(pos, pos, radius);

		this.position = pos;
	}
	else {
		this.rotation += this.rotationSpeed * deltaTime;
	}
}

Planet.prototype.Draw = function (shader, solidShader, modelview, projection, size, lights) {
	var mv = mat4.create();
	mat4.translate(mv, modelview, this.position);

	var rotationAxis = vec3.fromValues(0, 1, 0);
	mat4.rotate(mv, mv, this.rotation, rotationAxis);

	var scale = vec3.fromValues(this.size, this.size, this.size);
	mat4.scale(mv, mv, scale);

	this.mesh.Draw(shader, solidShader, mv, projection, size, lights);
}

Planet.prototype.Dispose = function() {
	this.mesh.Dispose();
}