//WebGL (C) Wesley Reardan 2013
function Mesh() {
    this.vertices = [];	//vec4 Position, vec4 Color, vec4 Normal, vec4 TexturePosition
    this.vertex_indices = [];
    this.wireframe_indices = [];
    this.textures = [];
    this.vboHandle = null;
    this.vboIndex = null;
    this.vboWireframe = null;
    this.wireframe_mode = 0;
    this.textureHandle = null;
    this.width = -1;
    this.height = -1;
    this.vboNormal = this.vboNormalIndex -1;
}

Mesh.prototype.LoadTexture = function (filename)
{
	var texture = gl.createTexture();
	var image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	image.src = filename;
	this.textureHandle = texture;
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
        data[index++] = vertex.color[0];
        data[index++] = vertex.color[1];
        data[index++] = vertex.color[2];
        data[index++] = vertex.color[3];
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

Mesh.prototype.BuildNormalGeometry = function () {
    var normalVertices = [];
    var normalIndices = [];
    var index = 0;
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var vertex = this.vertices[y*this.width+x] = {};
            vertex.position = [2.0 * x_one * x - 1.0, 2 * y_one * y - 1, 0.0, 1.0];
            vertex.color = [1.0, 1.0, 1.0, 1.0];
            vertex.normal = [0.0, 0.0, 1.0, 0.0];
            vertex.tex = [x_one * x, y_one * y, 1337.0, 1337.0];

            vertex = this.vertices[y*this.width+x+1] = {};
            vertex.position = this.vertices[index + 1];
            vertex.color = [1.0, 1.0, 1.0, 1.0];
            vertex.normal = [0.0, 0.0, 1.0, 0.0];
            vertex.tex = [x_one * x, y_one * y, 1337.0, 1337.0];

            index += 2;
        }
    }
}

Mesh.prototype.Init = function(width, height) {
	if(width * height > 65535)
		throw("Mesh.Init: WebGL 1.0 limited to 65535 (ushort) vertices/Model; However, I will get chunked Meshes working in a future version and this limitation will be removed.");
		
		this.width = width;
		this.height = height;
		
    var y_one = 1.0 / (height-1);
    var x_one = 1.0 / (width - 1);

		if(this.vertices.length == 0) {
			//Create planar-mesh vertices
			for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
							var vertex = this.vertices[y * width + x] = {};
							vertex.position = [2.0 * x_one * x - 1.0, 2*y_one * y - 1, 0.0, 1.0];
							vertex.color = [1.0, 1.0, 1.0, 1.0];
							vertex.normal = [0.0, 0.0, 1.0, 0.0];
							vertex.tex = [x_one * x, y_one * y, 1337.0, 1337.0];
					}
			}
    }

    //Create VBO
    this.vboHandle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboHandle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rawVertices()), gl.STATIC_DRAW);
	
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

    //Create VBO
    this.vboIndex = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndex);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), gl.STATIC_DRAW);

    //Create wireframe vertex indices
    index = 0;
    for (var y = 0; y < height-1; y++) {
        for (var x = 0; x < width-1; x++) {
            //Most verts
            this.wireframe_indices[index++] = y * width + x;
            this.wireframe_indices[index++] = y * width + x + 1;
            this.wireframe_indices[index++] = y * width + x;
            this.wireframe_indices[index++] = (y+1) * width + x;
        }
    }
    //edge cases
    for (var y = 0; y < height - 1; y++) {
        this.wireframe_indices[index++] = y * width + width-1;
        this.wireframe_indices[index++] = (y + 1) * width + width - 1;
    }
    for (var x = 0; x < width - 1; x++) {
        this.wireframe_indices[index++] = (height-1) * width + x;
        this.wireframe_indices[index++] = (height - 1) * width + x + 1;
    }

    //Create wireframe vertex indices VBO
    this.vboWireframe = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboWireframe);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.wireframe_indices), gl.STATIC_DRAW);
}

Mesh.prototype.Sphere = function(width, height) {
	var R = 1.0 / (height - 1);
	var S = 1.0 / (width - 1);
	var index;
	var circlePos = [0, 0, 0, 1];

	index = 0;
	for (var r = 0; r < height; ++r) {
		for (var c = 0; c < width; ++c) {
			var vertex = this.vertices[r * width + c] = {};
			var x = (Math.cos(2 * Math.PI * c * S) * Math.sin( Math.PI * r * R ));
			var y = (Math.sin( -Math.PI/2 + Math.PI * r * R ));
			var z = (Math.sin(2*Math.PI * c * S) * Math.sin( Math.PI * r * R ));
			vertex.position = [x * 1.0, y * 1.0, z * 1.0, 1.0];
			vertex.color = [1.0, 1.0, 1.0, 1.0];
			vertex.normal = vertex.position;
			vertex.tex = [S * r, R * c, 1337.0, 1337.0];
			index++;
		}
	}
}

Mesh.prototype.Cylinder = function(width, height) {
	var R = 1.0 / (height - 1);
	var S = 1.0 / (width - 1);
	var index;
	var circlePos = [0, 0, 0, 1];

	index = 0;
	for (var r = 0; r < height; ++r) {
		for (var c = 0; c < width; ++c) {
			var vertex = this.vertices[r * width + c] = {};
			var x = Math.cos(2 * Math.PI * c * S);
			var y = 1.0 - r * R * 2.0; //last term is height
			var z = Math.sin(2 * Math.PI * c * S);
			vertex.position = [x * 1.0, y * 1.0, z * 1.0, 1.0];
			vertex.color = [1.0, 1.0, 1.0, 1.0];
			vertex.normal = vertex.position;
			vertex.tex = [S * r, R * c, 1337.0, 1337.0];
			index++;
		}
	}
}

Mesh.prototype.Draw = function (shader, modelview, projection, size, lights) {
    shader.Use();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboHandle);
    shader.BindAttribute("VertexPosition", 4, 16 * 4, 16*0);
    shader.BindAttribute("VertexColor", 4, 16 * 4, 16*1);
    shader.BindAttribute("VertexNormal", 4, 16 * 4, 16*2);
    shader.BindAttribute("VertexTexture", 4, 16 * 4, 16*3);
    shader.SetUniform("ProjectionMatrix", projection);
    shader.SetUniform("ModelViewMatrix", modelview);
    var normalMatrix = mat4.create();
    mat4.transpose(normalMatrix, modelview);
    mat4.invert(normalMatrix, normalMatrix);
    shader.SetUniform("NormalMatrix", normalMatrix);
    if(this.textureHandle) {
			gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
			shader.SetUniform("TextureID", this.textureHandle);
		}
    if (this.wireframe_mode == 0) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndex);
        gl.drawElements(gl.TRIANGLES, this.vertex_indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (this.wireframe_mode == 1) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboWireframe);
        gl.drawElements(gl.LINES, this.wireframe_indices.length, gl.UNSIGNED_SHORT, 0);
    }
}


Mesh.prototype.TakeDown = function () {
    gl.deleteBuffer(vboHandle);
    gl.deleteBuffer(vboIndex);
    gl.deleteBuffer(vboWireframe);
}