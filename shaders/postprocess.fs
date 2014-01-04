#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D TextureID;
uniform vec2 WindowSize;
uniform int Mode;
uniform float uRandom;
    	
void main(void) {
	vec2 pos = vec2(gl_FragCoord) / WindowSize;
	if(Mode == 0) {
//dream vision post effect 
//http://www.geeks3d.com/20091112/shader-library-dream-vision-post-processing-filter-glsl/
		vec4 texColor = texture2D(TextureID, pos);

		texColor += texture2D(TextureID, pos + 0.001);
		texColor += texture2D(TextureID, pos + 0.003);
		texColor += texture2D(TextureID, pos + 0.005);
		texColor += texture2D(TextureID, pos + 0.007);
		texColor += texture2D(TextureID, pos + 0.009);
		texColor += texture2D(TextureID, pos + 0.011);

		texColor += texture2D(TextureID, pos - 0.001);
		texColor += texture2D(TextureID, pos - 0.003);
		texColor += texture2D(TextureID, pos - 0.005);
		texColor += texture2D(TextureID, pos - 0.007);
		texColor += texture2D(TextureID, pos - 0.009);
		texColor += texture2D(TextureID, pos - 0.011);

		texColor.rgb = vec3((texColor.r + texColor.g + texColor.b) / 3.0);
		texColor = texColor / 9.5;

		gl_FragColor = texColor;
	} else if (Mode == 1) {
//Basic blur
		float wave_pos = 1.0;
		vec4 texColor = texture2D(TextureID, pos);

		texColor.r = texture2D(TextureID, pos).r;
		texColor.g = texture2D(TextureID, pos + 0.004).g;
		texColor.b = texture2D(TextureID, pos - 0.004).b;

		gl_FragColor = mix(vec4(0,0,0,0), texColor, wave_pos);

	} else if (Mode == 2) {
//Noise
		vec4 texColor = texture2D(TextureID, pos);
		texColor.r = texture2D(TextureID, pos + 0.008).r;
		texColor.g = texture2D(TextureID, pos + 0.004).g;
		texColor.b = texture2D(TextureID, pos - 0.004).b;
		texColor = texColor * fract(sin(dot((pos + uRandom).xy, vec2(12.9898,78.233))) * 43758.5453) * 4.0;
		//texColor = texColor * pos.x;
		gl_FragColor = texColor;

	} else if (Mode == 3) {
//toony, posterize post effect adapted from:
//http://www.geeks3d.com/20091027/shader-library-posterization-post-processing-effect-glsl/
		float numColors = 5.0;
		vec4 texColor = texture2D( TextureID, pos);
		vec3 c = texColor.xyz;
		c = pow(c, vec3(0.6, 0.6, 0.6));
		c = c * numColors;
		c = floor(c);
		c = c / numColors;
		c = pow(c, vec3(1.0/0.6));
		texColor = vec4(c.x, c.y, c.z, 1.0);
		gl_FragColor = texColor;

	} else if (Mode == 4) {
//predator vision post effect adapted from:
//http://www.geeks3d.com/20101123/shader-library-predators-thermal-vision-post-processing-filter-glsl/
//play with colors[] for different variations
		vec4 texColor = texture2D( TextureID, pos);
		vec3 tc = vec3(1.0, 1.0, 1.0);

		vec3 c = texColor.xyz;
		vec3 colors[3];
		colors[0] = vec3(0.0, 0.0, 1.0);
		colors[1] = vec3(1.0, 1.0, 1.0);
		colors[2] = vec3(1.0, 0.0, 0.0);
		float lum = dot(vec3(0.30, 0.59, 0.11), c.rgb); //(c.r + c.g + c.b) / 3.0;
//		int ix = (lum < 0.5) ? 0:1;
//		tc = mix(colors[ix], colors[ix + 1], (lum - float(ix) * 0.5) / 0.5);
		if(lum < 0.5)
			tc = mix(colors[0], colors[1], (lum - float(0) * 0.5) / 0.5);
		else
			tc = mix(colors[1], colors[2], (lum - float(1) * 0.5) / 0.5);

	    gl_FragColor = vec4(tc, 1.0);

	} else if (Mode == 5) {
//scan lines and faked chromatic aberration 
//inpiration/methods used from: 
//http://blog.jahfer.com/2012/04/02/experimenting-shaders-openframeworks/
//http://cpansearch.perl.org/src/CORION/App-VideoMixer-0.02/filters/scanlines.glsl
		vec4 texColor = texture2D( TextureID, pos);

		float global_pos = (pos.y + 0.2) * 300.0;
		float wave_pos = cos((fract( global_pos ) - 0.5)*3.14159);

		texColor.r = texture2D(TextureID, pos).r;
		texColor.g = texture2D(TextureID, pos + 0.004).g;
		texColor.b = texture2D(TextureID, pos - 0.004).b;

		gl_FragColor = mix(vec4(0,0,0,0), texColor, wave_pos);
	} else if (Mode == 6) {
//Gaussian Blur, inspired by:
//http://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm
		vec4 texColor = texture2D(TextureID, pos) * 41.0;

		texColor += texture2D(TextureID, pos + vec2(0.001, 0.0)) * 26.0;
		texColor += texture2D(TextureID, pos + vec2(-0.001, 0.0)) * 26.0;
		texColor += texture2D(TextureID, pos + vec2(0.0, 0.001)) * 26.0;
		texColor += texture2D(TextureID, pos + vec2(0.0, -0.001)) * 26.0;

		texColor += texture2D(TextureID, pos + vec2(-0.001, 0.001)) * 16.0;
		texColor += texture2D(TextureID, pos + vec2(-0.001, -0.001)) * 16.0;
		texColor += texture2D(TextureID, pos + vec2(0.001, -0.001)) * 16.0;
		texColor += texture2D(TextureID, pos + vec2(0.001, 0.001)) * 16.0;

		texColor += texture2D(TextureID, pos + vec2(0.003, 0.0)) * 7.0;
		texColor += texture2D(TextureID, pos + vec2(-0.003, 0.0)) * 7.0;
		texColor += texture2D(TextureID, pos + vec2(0.0, 0.003)) * 7.0;
		texColor += texture2D(TextureID, pos + vec2(0.0, -0.003)) * 7.0;

		texColor += texture2D(TextureID, pos + vec2(-0.003, 0.001)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(-0.003, -0.001)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(-0.001, -0.003)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(0.001, -0.003)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(0.003, -0.001)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(0.003, 0.001)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(0.001, 0.003)) * 4.0;
		texColor += texture2D(TextureID, pos + vec2(-0.001, 0.003)) * 4.0;

		texColor += texture2D(TextureID, pos + vec2(-0.003, 0.003)) * 1.0;
		texColor += texture2D(TextureID, pos + vec2(-0.003, -0.003)) * 1.0;
		texColor += texture2D(TextureID, pos + vec2(0.003, -0.003)) * 1.0;
		texColor += texture2D(TextureID, pos + vec2(0.003, 0.003)) * 1.0;

		gl_FragColor = texColor / 273.0;

	} else if (Mode == 7) {
//home grown inverse effect
		vec4 texColor = texture2D( TextureID, pos);

		texColor.r = 1.0 - texColor.r;
		texColor.g = 1.0 - texColor.g;
		texColor.b = 1.0 - texColor.b;

		gl_FragColor = texColor;

	} else if (Mode == 8) {
//swap r,g,b values
		vec4 texColor = texture2D( TextureID, pos);

		gl_FragColor = texColor.gbra;

	} else if (Mode == 9) {
//swap r,g,b values
		vec4 texColor = texture2D( TextureID, pos);

		gl_FragColor = texColor.brga;


	} else {
//Unfiltered image
		vec4 texColor = texture2D(TextureID, pos);
		gl_FragColor = texColor;
	}
}