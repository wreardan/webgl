#ifdef GL_ES
  precision mediump float;
#endif

attribute vec4 VertexPosition;
    
uniform mat4 MVP;

void main(void) {
  gl_Position = MVP * VertexPosition;
}