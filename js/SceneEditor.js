//WebGL (C) Wesley Reardan 2013

function SceneEditor () {
	Scene.call(this);	//Call the Parent Constructor

	this.cameraPosition = [0, 0, 2];

	this.fboEnabled = false;
}

//inheritance
SceneEditor.prototype = new Scene();
SceneEditor.prototype.constructor = SceneEditor;

SceneEditor.prototype.Initialize = function () {
	this.InitializeShaders();

	//Create starter object
	var mesh = new Mesh();
	mesh.Init(20, 20);
	mesh.LoadTexture('img/metal.jpg');
	mesh.BuildNormalVisualizationGeometry();
	this.objects.push(mesh);
}

SceneEditor.prototype.InnerDraw = function () {
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].Draw(this.shader, this.solidShader, 
			this.modelviewMatrix, this.projectionMatrix);
	}
}