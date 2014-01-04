#ifdef GL_ES
  precision mediump float;
#endif

attribute vec4 VertexPosition;
attribute vec4 VertexNormal;
attribute vec4 VertexTexture;
    
uniform mat4 ModelViewMatrix;
uniform mat4 MVP;
uniform mat4 NormalMatrix;
      
varying vec4 Position;
varying vec4 Normal;
varying vec4 Texture;

void main(void) {
  gl_Position = MVP * VertexPosition;
  Position = ModelViewMatrix * VertexPosition;
  Normal = NormalMatrix * VertexNormal;
  Texture = VertexTexture;
}