
varying lowp vec4 Position;
varying lowp vec4 Color;
varying lowp vec4 Normal;
varying lowp vec4 Texture;

struct LightInfo {
  lowp vec4 Position;  // Light position in eye coords.
  lowp vec3 Intensity; // A,D,S intensity
};
uniform LightInfo Light[8];

struct MaterialInfo {
  lowp vec3 Ka;            // Ambient reflectivity
  lowp vec3 Kd;            // Diffuse reflectivity
  lowp vec3 Ks;            // Specular reflectivity
  mediump float Shininess;    // Specular shininess factor
};
uniform MaterialInfo Material;
uniform sampler2D TextureID;

lowp vec3 phongModel( lowp vec3 pos, lowp vec3 norm ) {
    lowp vec3 light_sum;
    for(int i = 0; i < 8; i++) {
        lowp vec3 s = normalize(vec3(Light[i].Position) - pos);
        lowp vec3 v = normalize(-pos.xyz);
        lowp vec3 r = reflect( -s, norm );
        lowp vec3 ambient = Light[i].Intensity * Material.Ka;
        lowp float sDotN = max( dot(s,norm), 0.0 );
        lowp vec3 diffuse = Light[i].Intensity * Material.Kd * sDotN;
        lowp vec3 spec = vec3(0.0);
        if( sDotN > 0.0 )
            spec = Light[i].Intensity * Material.Ks *
                   pow( max( dot(r,v), 0.0 ), Material.Shininess );
        light_sum += ambient + diffuse + spec;
    }
    return light_sum;
}
    	
void main(void) {
    lowp vec3 phong = phongModel(vec3(Position), vec3(Normal));
    lowp vec4 t_color = texture2D(TextureID, vec2(Texture));
    gl_FragColor = Color * vec4(phong, 1.0) * t_color;
}