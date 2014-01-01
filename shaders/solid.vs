#ifdef GL_ES
  precision mediump float;
#endif

attribute vec4 VertexPosition;
attribute vec4 VertexColor;
    
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;
      
varying vec4 Color;

void main(void) {
  gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
  Color = VertexColor;
}