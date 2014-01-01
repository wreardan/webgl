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
//??
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

		float wave_pos = 1.0;
		vec4 texColor = texture2D(TextureID, pos);

		texColor.r = texture2D(TextureID, pos).r;
		texColor.g = texture2D(TextureID, pos + 0.004).g;
		texColor.b = texture2D(TextureID, pos - 0.004).b;

		gl_FragColor = mix(vec4(0,0,0,0), texColor, wave_pos);

	} else {

		vec4 texColor = texture2D(TextureID, pos);
		texColor.r = texture2D(TextureID, pos + 0.008).r;
		texColor.g = texture2D(TextureID, pos + 0.004).g;
		texColor.b = texture2D(TextureID, pos - 0.004).b;
		texColor = texColor * fract(sin(dot((pos + uRandom).xy, vec2(12.9898,78.233))) * 43758.5453) * 4.0;
		//texColor = texColor * pos.x;
		gl_FragColor = texColor;

	}
}