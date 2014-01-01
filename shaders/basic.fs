#ifdef GL_ES
  precision mediump float;
#endif

varying vec4 Position;
varying vec4 Color;
varying vec4 Normal;
varying vec4 Texture;

struct LightInfo {
  vec4 Position;  // Light position in eye coords.
  vec3 Intensity; // A,D,S intensity
};
uniform LightInfo Light[8];

struct SpotLightInfo {
  vec4 position;    // Gposition in eye coords
  vec3 intensity;   // Amb., Diff., and Specular intensity
  vec3 direction;   // Direction of the spotlight in eye coords.
  float exponent;   // Angular attenuation exponent
  float cutoff;     // Cutoff angle (between 0 and 90)
};
uniform SpotLightInfo Spot[1];

struct MaterialInfo {
  vec3 Ka;            // Ambient reflectivity
  vec3 Kd;            // Diffuse reflectivity
  vec3 Ks;            // Specular reflectivity
  float Shininess;    // Specular shininess factor
};
uniform MaterialInfo Material;
uniform sampler2D TextureID;

vec3 phongModel( vec3 pos, vec3 norm ) {
    vec3 light_sum;
    for(int i = 0; i < 8; i++) {
        vec3 s = normalize(vec3(Light[i].Position) - pos);
        vec3 v = normalize(-pos.xyz);
        vec3 r = reflect( -s, norm );
        vec3 ambient = Light[i].Intensity * Material.Ka;
        float sDotN = max( dot(s,norm), 0.0 );
        vec3 diffuse = Light[i].Intensity * Material.Kd * sDotN;
        vec3 spec = vec3(0.0);
        if( sDotN > 0.0 )
            spec = Light[i].Intensity * Material.Ks *
                   pow( max( dot(r,v), 0.0 ), Material.Shininess );
        light_sum += ambient + diffuse + spec;
    }
    return light_sum;
}
      
void main(void) {
    vec3 phong = phongModel(vec3(Position), vec3(Normal));
    vec4 t_color = texture2D(TextureID, vec2(Texture));
    gl_FragColor = Color * vec4(phong, 1.0) * t_color;
}