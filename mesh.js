function Mesh() {
    this.vertices = [];	//vec3 Position, vec3 Color, vec3 Normal, vec2 TexturePosition
    this.vertex_indices = [];
    this.wireframe_indices = [];
    this.textures = [];
    this.vboHandle = null;
    this.vboIndex = null;
    this.vboWireframe = null;
    this.wireframe_mode = 0;
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

Mesh.prototype.Init = function(width, height) {
    var y_one = 1.0 / (height-1);
    var x_one = 1.0 / (width - 1);

    //Create mesh vertices
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var vertex = this.vertices[y * width + x] = {};
            vertex.position = [2.0 * x_one * x - 1.0, 2*y_one * y - 1, 0.0, 1.0];
            vertex.color = [1.0, 1.0, 1.0, 1.0];
            vertex.normal = [0.0, 0.0, 1.0, 0.0];
            vertex.tex = [x_one * x, y_one * y, 1337.0, 1337.0];
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


Mesh.prototype.Draw = function (shader, modelview, projection, size, lights) {
    shader.Use();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboHandle);
    shader.BindAttribute("VertexPosition", 4, 16 * 4, 16*0);
    shader.BindAttribute("VertexColor", 4, 16 * 4, 16*1);
    shader.BindAttribute("VertexNormal", 4, 16 * 4, 16*2);
    shader.BindAttribute("VertexTexture", 4, 16 * 4, 16*3);
    shader.SetUniform("ProjectionMatrix", projection);
    shader.SetUniform("ModelViewMatrix", modelview);
    shader.SetUniform("NormalMatrix", modelview.transpose().inverse());
    if (this.wireframe_mode == 0) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndex);
        gl.drawElements(gl.TRIANGLES, this.vertex_indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (this.wireframe_mode == 1) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboWireframe);
        gl.drawElements(gl.LINES, this.wireframe_indices.length, gl.UNSIGNED_SHORT, 0);
    }
}


Mesh.prototype.TakeDown = function () {
    
}