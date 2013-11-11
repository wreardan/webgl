//WebGL (C) Wesley Reardan 2013
// Define Child Class
function Mars() {
	//Call the Parent Constructor
	Mesh.call(this);
}
//Inherits Mesh
Mars.prototype = new Mesh();
Mars.prototype.constructor = Mars;

Mars.prototype.InitMars = function(){
	this.width = width;
	this.height = height;

	var scalar = 0.1;
	var index = 0;
	//Read in coordinates
	var width = mars_low_rez[index++];
	var height = mars_low_rez[index++];
	this.Sphere.call(this, width, height);
	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			var depthValue = mars_low_rez[index];
			//console.log(index);
			var position = this.vertices[index-2].position;
			vec4.scale(position, position, 1.0+depthValue*scalar);
			index++;
		}
	}

	this.GenerateIndices(width, height);
	this.CalculateNormals();

	this.StoreVertices(width, height);
  this.StoreIndices(width, height);
}