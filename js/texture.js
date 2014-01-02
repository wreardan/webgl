//WebGL (C) Wesley Reardan 2014
function Texture() {
	this.handle = null;
	this.textureUnit = 0;
}

Texture.prototype.Initialize = function (filename)
{
	var texture = gl.createTexture();
	var image = new Image();
	var parent = this;
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		//Set texture parameters for any size image
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.bindTexture(gl.TEXTURE_2D, null);
		
		parent.handle = texture;
	}
	image.src = filename;
}

Texture.prototype.InitializeBlank = function (width, height)
{
	var texture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
		gl.UNSIGNED_BYTE, null);

	//Set texture parameters for any size image

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


	gl.bindTexture(gl.TEXTURE_2D, null);
	
	this.handle = texture;
}

Texture.prototype.Bind = function (textureUnit) {
	if(this.handle == null)
		return false;

	if(!textureUnit)
		textureUnit = 0;

	this.textureUnit = textureUnit;

	gl.activeTexture(gl.TEXTURE0 + textureUnit);
	gl.bindTexture(gl.TEXTURE_2D, this.handle);

	return true;
}

Texture.prototype.Unbind = function () {
	gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture.prototype.Dispose = function () {
	gl.deleteTexture(this.handle);
	this.handle = null;
}

