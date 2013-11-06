var canvas;
var gl;
var squareVerticesBuffer;
var squareVerticesColorBuffer;
var mvMatrix;
var perspectiveMatrix;
var squareRotation = 0.0;

function doKeyDown(e) {
    if (e.keyCode == 87) {  // && e.ctrlKey
        mesh.wireframe_mode = (mesh.wireframe_mode == 0 ? 1 : 0);
    }
}
document.addEventListener("keydown", doKeyDown, true);

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
  canvas = document.getElementById("glcanvas");

  initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    
    initShaders();
    
    // Here's where we call the routine that builds all the objects
    // we'll be drawing.

    mesh = new Mesh();
    mesh.Init(20, 20);
    
    // Set up to draw the scene periodically.
    
    setInterval(drawScene, 15);
  }
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  gl = null;
  
  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }
  
  // If we don't have a GL context, give up now
  
  if (!gl) {
    throw("Unable to initialize WebGL. Your browser may not support it.");
  }
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  
  perspectiveMatrix = makePerspective(45, 800.0/600.0, 0.1, 100.0);
  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  
  // Now move the drawing position a bit to where we want to start
  // drawing the square.
  
  mvMatrix = makeLookAt(
      0, 0, 3,  //Camera Position
      0, 0, 0,  //Pointing Towards
      0, 1, 0); //Up Vector

  mesh.Draw(shader, mvMatrix, perspectiveMatrix);
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    
    shader = new Shader();
	
    shader.Init("shader-vs", "shader-fs");
  
    shader.EnableAttribute("VertexPosition");
    shader.EnableAttribute("VertexColor");
    shader.EnableAttribute("VertexNormal");
    shader.EnableAttribute("VertexTexture");

    shader.SetUniform("Material.Ka", [0.1, 0.1, 0.1]);
    shader.SetUniform("Material.Kd", [0.9, 0.9, 0.9]);
    shader.SetUniform("Material.Ks", [0.4, 0.4, 0.4]);
    shader.SetUniform("Material.Shininess", 50.0);

    shader.SetUniform("Light[0].Position", [1, 1, 1, 1]);
    shader.SetUniform("Light[0].Intensity", [0.8, 0.8, 0.8]);
    shader.SetUniform("Light[1].Position", [-1, -1, 1, 1]);
    shader.SetUniform("Light[1].Intensity", [0.6, 0.6, 0.6]);
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}