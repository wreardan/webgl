//WebGL (C) Wesley Reardan 2013
var canvas;
var gl;

//var scene = new Scene();
var scenes = [];
scenes.push(new SceneSolarSystem() );
scenes.push(new SceneEditor() );
var currentScene = 0;
var scene = scenes[currentScene];

var lastTime = Date.now();
var drawNormals = false;
var drawTangents = false;
var drawWireframe = false;

//Handle Keyboard Input
function doKeyDown(e) {
	switch(e.keyCode) {
	case 87://W key, for + Ctrl= && e.ctrlKey
		drawWireframe = ! drawWireframe;
		break;
	case 70: //F key
		scene.fbo.ChangeEffect();
		break;
	case 78://N key
		drawNormals = ! drawNormals;
		break;
	case 84://t key
		drawTangents = ! drawTangents;
		break;
	case 37: //left arrow
		break;
	case 39: //right arrow
		break;
	case 38: //up arrow
		break;
	case 40: //down arrow
		break;
	case 109: //subtract
		break;
	case 107: //add
		scene.Dispose();
		currentScene = (currentScene + 1) % scenes.length;
		scene = scenes[currentScene];
    	scene.Resize(1024, 768);
		scene.Initialize();
		break;
	case 112: //f1 - change mode
	case 113: //f2 - change mode
		e.preventDefault();
		scene.ChangeObject();
		return false;
	}
}
document.addEventListener("keydown", doKeyDown, true);

//Handle Mouse based input
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

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
/*
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);
*/

// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
function start() {
  canvas = document.getElementById("glcanvas");

  initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {

    scene.Resize(1024, 768);
    scene.Initialize();
    
    // Set up to draw the scene periodically.
    requestAnimationFrame(drawScene);
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
function drawScene(deltaTime) {

	scene.Draw();

	requestAnimationFrame(drawScene);
}

var updateInterval = 15;
function UpdateScene() {
	var deltaTime = updateInterval / 1000.0;
	scene.Update(deltaTime);
}
setInterval(UpdateScene, updateInterval);