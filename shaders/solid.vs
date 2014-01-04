#ifdef GL_ES
  precision mediump float;
#endif

attribute vec4 VertexPosition;
    
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;

void main(void) {
  gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
}