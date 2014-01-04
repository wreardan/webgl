#ifdef GL_ES
  precision mediump float;
#endif

attribute vec3 VertexPosition;
    
uniform mat4 MVP;

void main(void) {
  gl_Position = MVP * vec4(VertexPosition, 1.0);
}