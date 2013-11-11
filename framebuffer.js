//WebGL (C) Wesley Reardan 2013
function Framebuffer() {
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

Framebuffer.prototype.Initialize = function () {
}

Framebuffer.prototype.Use = function () {
}

Framebuffer.prototype.Disable = function () {
}

Framebuffer.prototype.TakeDown = function () {
}


