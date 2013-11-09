
attribute vec4 VertexPosition;
attribute vec4 VertexColor;
attribute vec4 VertexNormal;
attribute vec4 VertexTexture;
    
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 NormalMatrix;
      
varying lowp vec4 Position;
varying lowp vec4 Color;
varying lowp vec4 Normal;
varying lowp vec4 Texture;

void main(void) {
    gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
    Color = VertexColor;
    Position = VertexPosition;
    Normal = NormalMatrix * VertexNormal;
    Texture = VertexTexture;
}