var canvas;
var gl;
var squareVerticesBuffer;
var squareVerticesColorBuffer;
var mvMatrix;
var perspectiveMatrix;
var squareRotation = 0.0;
var cameraPosition = [0, 0, 3];
var cameraTarget = [0, 0, 0];
var cameraUp = [0, 1, 0];

function doKeyDown(e) {
	switch(e.keyCode) {
	case 87:// && e.ctrlKey
		mesh.wireframe_mode = (mesh.wireframe_mode == 0 ? 1 : 0);
		sphere.wireframe_mode = (mesh.wireframe_mode == 0 ? 1 : 0);
		break;
	case 37: //left arrow
		cameraPosition[0]--;
		cameraTarget[0]--;
		break;
	case 39: //right arrow
		cameraPosition[0]++;
		cameraTarget[0]++;
		break;
	case 38: //up arrow
		cameraPosition[1]++;
		cameraTarget[1]++;
		break;
	case 40: //down arrow
		cameraPosition[1]--;
		cameraTarget[1]--;
		break;
	case 109: //subtract
		cameraPosition[2]++;
		cameraTarget[2]++;
		break;
	case 107: //add
		cameraPosition[2]--;
		cameraTarget[2]--;
		break;
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
    mesh.LoadTexture('img/mars.jpg');
    
    sphere = new Mesh();
    sphere.Sphere(20, 20);
    sphere.LoadTexture('img/mars.jpg');
    
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
      cameraPosition[0], cameraPosition[1], cameraPosition[2],  //Camera Position
      cameraTarget[0], cameraTarget[1], cameraTarget[2],  //Camera Target
      cameraUp[0], cameraUp[1], cameraUp[2]);  //Up Vector

  //mesh.Draw(shader, mvMatrix, perspectiveMatrix);
  sphere.Draw(shader, mvMatrix, perspectiveMatrix);
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
    shader.SetUniform("Light[0].Intensity", [0.8, 0.8, 1.0]);
    shader.SetUniform("Light[1].Position", [-1, -1, 1, 1]);
    shader.SetUniform("Light[1].Intensity", [0.6, 1.0, 0.6]);
}