//WebGL (C) Wesley Reardan 2013
function Mesh() {
	this.vertices = [];	//vec4 Position, vec4 Normal, vec4 TexturePosition
	this.vertex_indices = [];
	this.wireframe_indices = [];
	this.textures = [];
	this.normalVertices = [];
	this.normalIndices = [];
	this.tangents = [];
	this.vboVertices = null;
	this.vboIndex = null;
	this.vboWireframe = null;
	this.vboNormals = null;
	this.vboTangents = null;
	this.width = -1;
	this.height = -1;
	this.textureOnly = false;
}

Mesh.prototype.LoadModel = function (modelFilename) {
	if(textureFilename)
		this.LoadTexture(textureFilename);

//Load Vertices from object
	var index = 0;
	for(var i = 0; i < model.metadata.vertices; i++) {
		var vertex = this.vertices[i] = {};
		vertex.position = [0,0,0,1];
		vertex.position[0] = model.vertices[index++];
		vertex.position[1] = model.vertices[index++];
		vertex.position[2] = model.vertices[index++];
		var normalIndex = i % mode.normals.length;
		vertex.normal = [0,0,0,0];
		vertex.normal[0] = model.normals[index-2];
		vertex.normal[0] = model.normals[index-1];
		vertex.normal[0] = model.normals[index];
	}
//Load Faces
}

Mesh.prototype.LoadTexture = function (filename, index)
{
	if(!index) index = 0;
	this.textures[index] = new Texture();
	this.textures[index].Initialize(filename);
}

Mesh.prototype.CalculateNormals = function () {
	//Initialize normals to 0
	for(var i = 0; i < this.vertices.length; i++) {
		this.vertices[i].normal = [0,0,0];
	}
	//Average Normals
	for(var i = 0; i < this.vertex_indices.length; i+=3) {
		var p1 = this.vertices[this.vertex_indices[i]].position;
		var p2 = this.vertices[this.vertex_indices[i+1]].position;
		var p3 = this.vertices[this.vertex_indices[i+2]].position;

		var a=[], b=[], n=[];
		vec3.subtract(a, p2, p1);
		vec3.subtract(b, p3, p1);
		vec3.cross(n, a, b);
		vec3.normalize(n, n);

		vec3.add(this.vertices[this.vertex_indices[i]].normal, this.vertices[this.vertex_indices[i]].normal, n);
		vec3.add(this.vertices[this.vertex_indices[i+1]].normal, this.vertices[this.vertex_indices[i+1]].normal, n);
		vec3.add(this.vertices[this.vertex_indices[i+2]].normal, this.vertices[this.vertex_indices[i+2]].normal, n);
	}
	//Normalize all Normals
	for(var i = 0; i < this.vertices.length; i++) {
		if(vec3.length(this.vertices[i].normal) > 0.0)
			vec3.normalize(this.vertices[i].normal,this.vertices[i].normal);
	}
}

Mesh.prototype.CalculateTangents = function() {
	var tan1accum = [];
	var tan2accum = [];

	//Initialize tangents to 0
	for(var i = 0; i < this.vertices.length; i++) {
		tan1accum[i] = vec3.create();
		tan2accum[i] = vec3.create();
		this.vertices[i].tangent = vec4.create();
	}
	//Average Tangentts
	for(var i = 0; i < this.vertex_indices.length; i+=3) {
		var p1 = this.vertices[this.vertex_indices[i]].position;
		var p2 = this.vertices[this.vertex_indices[i+1]].position;
		var p3 = this.vertices[this.vertex_indices[i+2]].position;

		var tc1 = this.vertices[this.vertex_indices[i]].tex;
		var tc2 = this.vertices[this.vertex_indices[i+1]].tex;
		var tc3 = this.vertices[this.vertex_indices[i+2]].tex;

		var q1 = vec3.create();
		var q2 = vec3.create();
		vec3.subtract(q1, p2, p1);
		vec3.subtract(q2, p3, p1);
		var s1 = tc2[0] - tc1[0];
		var s2 = tc3[0] - tc1[0];
		var t1 = tc2[1] - tc1[1];
		var t2 = tc3[1] - tc1[1];
		var r = 1.0 / (s1 * t2 - s2 * t1);

		var tan1 = vec3.fromValues(
			(t2*q1[0] - t1*q2[0]) * r,
			(t2*q1[1] - t1*q2[1]) * r,
			(t2*q1[2] - t1*q2[2]) * r);
		var tan2 = vec3.fromValues(
			(s1*q2[0] - s2*q1[0]) * r,
			(s1*q2[1] - s2*q1[1]) * r,
			(s1*q2[2] - s2*q1[2]) * r);

		vec3.add(tan1accum[this.vertex_indices[i]], tan1accum[this.vertex_indices[i]], tan1);
		vec3.add(tan1accum[this.vertex_indices[i+1]], tan1accum[this.vertex_indices[i+1]], tan1);
		vec3.add(tan1accum[this.vertex_indices[i+2]], tan1accum[this.vertex_indices[i+2]], tan1);

		vec3.add(tan2accum[this.vertex_indices[i]], tan2accum[this.vertex_indices[i]], tan2);
		vec3.add(tan2accum[this.vertex_indices[i+1]], tan2accum[this.vertex_indices[i+1]], tan2);
		vec3.add(tan2accum[this.vertex_indices[i+2]], tan2accum[this.vertex_indices[i+2]], tan2);
	}
	for(var i = 0; i < this.vertices.length; i++) {
		var n = this.vertices[i].normal;
		var t1 = tan1accum[i];
		var t2 = tan2accum[i];
		// Gram-Schmidt orthogonalize
		var gs;

		this.tangents[i] = vec4.fromValues()
	}
}

Mesh.prototype.BuildTangentVisualizationGeometry = function () {
	//solidShader.Use();
	var tangentScalar = 0.05;
	var tangentVertices = [];
	var tangentIndices = [];
	var index = 0;
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var vertex = this.vertices[y * this.width + x];
			var tangentVertex1 = {position: vec3.create()};
			var tangentVertex2 = {position: vec3.create()};
			var scaledTangent = vec3.create();
			vec3.scale(scaledTangent, vertex.tangent, tangentScalar);
			tangentVertex1.position = vec3.create();
			vec3.add(tangentVertex1.position, vertex.position, scaledTangent);
			vec3.sub(tangentVertex2.position, vertex.position, scaledTangent);
			tangentVertices.push(tangentVertex1);
			tangentVertices.push(tangentVertex2);
			tangentIndices.push(index++);
			tangentIndices.push(index++);
		}
	}
	this.tangentVertices = tangentVertices;
	this.tangentIndices = tangentIndices;
	//Create VBOs
	this.vboTangents = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTangents);
	gl.bufferData(gl.ARRAY_BUFFER, this.rawTangentVertices(tangentVertices), gl.STATIC_DRAW);

//	this.vboTangentIndices = gl.createBuffer();
//	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboTangentIndices);
//	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangentIndices), gl.STATIC_DRAW);
}


Mesh.prototype.rawTangentVertices = function (positions) {
	var data = new Float32Array(positions.length * 3);
	var index = 0;
	for (var i = 0; i < positions.length; i++) {
		var vertex = positions[i];
		data[index++] = vertex.position[0];
		data[index++] = vertex.position[1];
		data[index++] = vertex.position[2];
	}
	return data;
}


Mesh.prototype.rawVertices = function () {
	var data = [];
	var index = 0;
	for (var i = 0; i < this.vertices.length; i++) {
		var vertex = this.vertices[i];
		data[index++] = vertex.position[0];
		data[index++] = vertex.position[1];
		data[index++] = vertex.position[2];
		data[index++] = vertex.position[3];
		data[index++] = vertex.normal[0];
		data[index++] = vertex.normal[1];
		data[index++] = vertex.normal[2];
		data[index++] = vertex.normal[3];
		data[index++] = vertex.tex[0];
		data[index++] = vertex.tex[1];
		data[index++] = vertex.tex[2];
		data[index++] = vertex.tex[3];
	}
	return data;
}


Mesh.prototype.rawNormalVertices = function () {
	var data = [];
	var index = 0;
	for (var i = 0; i < this.normalVertices.length; i++) {
		var vertex = this.normalVertices[i];
		data[index++] = vertex.position[0];
		data[index++] = vertex.position[1];
		data[index++] = vertex.position[2];
	}
	return data;
}

Mesh.prototype.BuildNormalVisualizationGeometry = function () {
	//solidShader.Use();
	var normalScalar = 0.05;
	var normalVertices = [];
	var index = 0;
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var vertex = this.vertices[y * this.width + x];
			var normalVertex1 = {};
			var normalVertex2 = {position:[]};
			normalVertex1.position = vec3.clone(vertex.position);
			var scaledNormal = vec3.create();
			vec3.scale(scaledNormal, vertex.normal, normalScalar);
			vec3.add(normalVertex2.position, vertex.position, scaledNormal);
			normalVertices.push(normalVertex1);
			normalVertices.push(normalVertex2);
		}
	}
	this.normalVertices = normalVertices;
	//Create VBOs
	this.vboNormals = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboNormals);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rawNormalVertices()), gl.STATIC_DRAW);

}

Mesh.prototype.GenerateIndices = function(width, height) {
	//Create mesh vertex_indices
	var index = 0;
	for (var y = 0; y < height-1; y++) {
		for (var x = 0; x < width-1; x++) {
			this.vertex_indices[index++] = (y) * width + (x + 1);
			this.vertex_indices[index++] = (y) * width + (x);
			this.vertex_indices[index++] = (y + 1) * width + (x);

			this.vertex_indices[index++] = (y + 1) * width + (x);
			this.vertex_indices[index++] = (y + 1) * width + (x + 1);
			this.vertex_indices[index++] = (y) * width + (x + 1);
		}
	}

	//Create wireframe vertex indices
	index = 0;
	//Most verts
	for (var y = 0; y < height-1; y++) {
		for (var x = 0; x < width-1; x++) {
			//horizontal
			this.wireframe_indices[index++] = y * width + x;
			this.wireframe_indices[index++] = y * width + x + 1;
			//vertical
			this.wireframe_indices[index++] = y * width + x;
			this.wireframe_indices[index++] = (y+1) * width + x;
			//diagonal
			this.wireframe_indices[index++] = y * width + x;
			this.wireframe_indices[index++] = (y+1) * width + x+1;
		}
	}
	//edge cases
	for (var y = 0; y < height - 1; y++) {
		//vertical
		this.wireframe_indices[index++] = y * width + width-1;
		this.wireframe_indices[index++] = (y + 1) * width + width - 1;
	}
	for (var x = 0; x < width - 1; x++) {
		//horizontal
		this.wireframe_indices[index++] = (height-1) * width + x;
		this.wireframe_indices[index++] = (height - 1) * width + x + 1;
	}
}

Mesh.prototype.StoreIndices = function(width, height) {
	//Create VBO
	this.vboIndex = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndex);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), gl.STATIC_DRAW);

	//Create wireframe vertex indices VBO
	this.vboWireframe = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboWireframe);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.wireframe_indices), gl.STATIC_DRAW);
}

Mesh.prototype.StoreVertices = function(width, height) {
	//Create planar-mesh if no Vertex Mesh exists
	if(this.vertices.length == 0) {
		var y_one = 1.0 / (height-1);
		var x_one = 1.0 / (width - 1);

		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var vertex = this.vertices[y * width + x] = {};
				vertex.position = [2.0 * x_one * x - 1.0, 2*y_one * y - 1, 0.0, 1.0];
				vertex.normal = [0.0, 0.0, 1.0, 0.0];
				vertex.tex = [x_one * x, y_one * y, 1337.0, 1337.0];
			}
		}
	}

	//Create Vertices VBO
	this.vboVertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboVertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rawVertices()), gl.STATIC_DRAW);
}

Mesh.prototype.Init = function(width, height) {
	if(width * height > 65535)
		throw("Mesh.Init: WebGL 1.0 limited to 65535 (ushort) vertices/Model; You can use the uint extension to get larger indices");
		
	if(!width) width = 20;
	if(!height) height = 20;

	this.width = width;
	this.height = height;

	this.StoreVertices(width, height);
	this.GenerateIndices(width, height);
	this.StoreIndices(width, height);
}

Mesh.prototype.Sphere = function(width, height) {
	var R = 1.0 / (height - 1);
	var S = 1.0 / (width - 1);
	var index;

	index = 0;
	for (var r = 0; r < height; ++r) {
		for (var c = 0; c < width; ++c) {
			var vertex = this.vertices[r * width + c] = {};
			var x = (Math.cos(2 * Math.PI * c * S) * Math.sin( Math.PI * r * R ));
			var y = (Math.sin( -Math.PI/2 + Math.PI * r * R ));
			var z = (Math.sin(2*Math.PI * c * S) * Math.sin( Math.PI * r * R ));
			vertex.position = [x * 1.0, y * 1.0, z * 1.0, 1.0];
			vertex.normal = vertex.position;
			vertex.tex = [R * c, S * r, 1337.0, 1337.0];
			index++;
		}
	}
}

Mesh.prototype.Cylinder = function(width, height) {
	var R = 1.0 / (height - 1);
	var S = 1.0 / (width - 1);
	var index;

	index = 0;
	for (var r = 0; r < height; ++r) {
		for (var c = 0; c < width; ++c) {
			var vertex = this.vertices[r * width + c] = {};
			var x = Math.cos(2 * Math.PI * c * S);
			var y = 1.0 - r * R * 2.0; //last term is height
			var z = Math.sin(2 * Math.PI * c * S);
			vertex.position = [x * 1.0, y * 1.0, z * 1.0, 1.0];
			vertex.normal = vertex.position;
			vertex.tex = [S * r, R * c, 1337.0, 1337.0];
			index++;
		}
	}
}

Mesh.prototype.Draw = function (shader, solidShader, modelview, projection, size, lights) {
	shader.Use();
	if(shader.linked) {
		//Bind VBO
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboVertices);
		shader.BindAttribute("VertexPosition", 4, 16 * 3, 16*0);
		shader.BindAttribute("VertexNormal", 4, 16 * 3, 16*1);
		shader.BindAttribute("VertexTexture", 4, 16 * 3, 16*2);

		//Set Uniforms
		var MVP = mat4.create();
		mat4.multiply(MVP, projection, modelview);
		shader.SetUniform("MVP", MVP);
		shader.SetUniform("ModelViewMatrix", modelview);
		var normalMatrix = mat4.create();
		mat4.transpose(normalMatrix, modelview);
		mat4.invert(normalMatrix, normalMatrix);
		shader.SetUniform("NormalMatrix", normalMatrix);

		//Bind Texture(s)
		if(!this.textures[0].Bind(0))
			return;
		shader.SetUniform("TextureID", 0, true);

		if(this.textureOnly)
			shader.SetUniform("TextureOnly", 1, true);
		else
			shader.SetUniform("TextureOnly", 0, true);

		//Draw Wireframe
		if (drawWireframe) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboWireframe);
			gl.drawElements(gl.LINES, this.wireframe_indices.length, gl.UNSIGNED_SHORT, 0);
		}
		//Draw normal
		else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndex);
			gl.drawElements(gl.TRIANGLES, this.vertex_indices.length, gl.UNSIGNED_SHORT, 0);
		}

		//Draw normals
		if(drawNormals && this.vboNormals) {
			solidShader.Use();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vboNormals);
			solidShader.BindAttribute("VertexPosition", 3, 12, 0);
			solidShader.SetUniform("MVP", MVP);
			solidShader.SetUniform("Color", vec4.fromValues(1.0, 1.0, 1.0, 1.0));
			gl.drawArrays(gl.LINES, 0, this.normalVertices.length);
		}

		//Draw tangents
		if(drawTangents && this.vboTangents) {
			solidShader.Use();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTangents);
			solidShader.BindAttribute("VertexPosition", 3, 12, 0);
			solidShader.SetUniform("MVP", MVP);
			solidShader.SetUniform("Color", vec4.fromValues(1.0, 1.0, 1.0, 1.0));
			gl.drawArrays(gl.LINES, 0, this.tangentVertices.length);
		}
	}
}


Mesh.prototype.Dispose = function () {
	gl.deleteBuffer(this.vboVertices);
	gl.deleteBuffer(this.vboIndex);
	gl.deleteBuffer(this.vboWireframe);

	this.vboVertices = null;
	this.vboIndex = null;
	this.vboWireframe = null;

	if(this.vboNormals) {
		gl.deleteBuffer(this.vboNormals);
		this.vboNormals = null;
	}

	if(this.vboTangents) {
		gl.deleteBuffer(this.vboTangents);
		this.vboTangents = null;
	}
}