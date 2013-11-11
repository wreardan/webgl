//WebGL (C) Wesley Reardan 2013
var canvas;
var gl;
var cameraPosition = [0, 0, 3];
var cameraTarget = [0, 0, 0];
var cameraUp = [0, 1, 0];
var marsRotation = mat4.create();
var drawMode = 0;
var lastTime = Date.now();
var drawNormals = false;

//Handle Keyboard Input
function doKeyDown(e) {
	switch(e.keyCode) {
	case 87://W key, for + Ctrl= && e.ctrlKey
		mesh.wireframe_mode = (mesh.wireframe_mode == 0 ? 1 : 0);
		sphere.wireframe_mode = mesh.wireframe_mode;
		cylinder.wireframe_mode = mesh.wireframe_mode;
		mars.wireframe_mode = mesh.wireframe_mode;
		break;
	case 78://N key
		drawNormals = ! drawNormals;
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
	case 115: //change mode
		drawMode++;
		if(drawMode > 3) drawMode = 0;
		break;
	}
}
document.addEventListener("keydown", doKeyDown, true);

//Handle Mouse based input
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var moonRotationMatrix = mat4.create();
mat4.identity(moonRotationMatrix);

function handleMouseDown(event) {
	event.preventDefault();
	console.log("mouse down (" + event.x + "," + event.y + ")");
}

function handleMouseUp(event) {
	event.preventDefault();
	console.log("mouse up (" + event.x + "," + event.y + ")");
}

function handleMouseMove(event) {
	event.preventDefault();
	console.log("mouse move (" + event.x + "," + event.y + ")");
}
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;
//document.mousemove = handleMouseMove;

// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
function start() {
  canvas = document.getElementById("glcanvas");

  initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    initShaders();
    
    // This should go into a Scene, then Init Here.

    mesh = new Mesh();
    mesh.Init(20, 20);
    mesh.LoadTexture('img/mars.jpg');
    
    sphere = new Mesh();
    sphere.Sphere(20, 20);
		sphere.Init(20, 20);
    sphere.textureHandle = mesh.textureHandle;
    sphere.BuildNormalVisualizationGeometry();
    
    cylinder = new Mesh();
    cylinder.Cylinder(20, 20);
		cylinder.Init(20, 20);
    cylinder.LoadTexture('img/metal.jpg');
    
    mars = new Mars();
    mars.InitMars();
    mars.textureHandle = mesh.textureHandle;
    mars.BuildNormalVisualizationGeometry();
    
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

// Draw the scene.
function drawScene() {
 //update time
  var fps_div = document.getElementById("fps");
  var current_time = Date.now();
  var delta_time = (lastTime - current_time);
  fps_div.innerHTML = (1000.0 / delta_time) + " fps";
  lastTime = current_time;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, 45, 800.0 / 600.0, 0.1, 100.0);
  var mvMatrix = mat4.create();
  mat4.lookAt( mvMatrix, cameraPosition, cameraTarget, cameraUp);

	mat4.rotate(marsRotation, marsRotation, delta_time * 0.0001, vec3.fromValues(0,1,0));
	mat4.multiply(mvMatrix, mvMatrix, marsRotation);
	switch(drawMode)
	{
	case 0:
		mars.Draw(shader, mvMatrix, perspectiveMatrix);
		break;
	case 1:
		sphere.Draw(shader, mvMatrix, perspectiveMatrix);
		break;
	case 2:
		cylinder.Draw(shader, mvMatrix, perspectiveMatrix);
		break;
	default: //case 0:
		mesh.Draw(shader, mvMatrix, perspectiveMatrix);
		break;
  }
}

// Initialize the shaders, so WebGL knows how to light our scene.
function initShaders() {
    
    shader = new Shader();
	
    shader.Init("shader-vs", "shader-fs");
    //shader.InitFromFiles("shaders/basic.vs", "shaders/basic.fs");
  
    /*shader.EnableAttribute("VertexPosition");
    shader.EnableAttribute("VertexColor");
    shader.EnableAttribute("VertexNormal");
    shader.EnableAttribute("VertexTexture");*/

    shader.SetUniform("Material.Ka", [0.1, 0.1, 0.1]);
    shader.SetUniform("Material.Kd", [0.9, 0.9, 0.9]);
    shader.SetUniform("Material.Ks", [0.4, 0.4, 0.4]);
    shader.SetUniform("Material.Shininess", 50.0);

    shader.SetUniform("Light[0].Position", [1, 1, 1, 1]);
    shader.SetUniform("Light[0].Intensity", [0.8, 0.8, 1.0]);
    shader.SetUniform("Light[1].Position", [-1, -1, 1, 1]);
    shader.SetUniform("Light[1].Intensity", [0.6, 1.0, 0.6]);

    solidShader = new Shader();
    solidShader.Init("solid-vs", "solid-fs");

}