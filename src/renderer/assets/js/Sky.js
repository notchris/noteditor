/* eslint-disable no-console */
import { Mesh, SphereBufferGeometry, DoubleSide, Color, Vector3 } from 'three';
import ShaderToyMaterial from 'three-shadertoy-material';

export default class Sky {
    constructor (size) {
        const box = new Mesh(
            new SphereBufferGeometry(size, 32, 32),
            new ShaderToyMaterial(`
                uniform vec3 colorSky;
                uniform vec3 colorScatter;
                uniform vec3 colorSun;
                vec3 getSky(vec2 uv, vec3 colorSky, vec3 colorScatter, vec3 colorSun) {
                    float atmosphere = sqrt(1.0-uv.y);
                    float scatter = pow(1.0 / iResolution.y,1.0 / 10.0);
                    scatter = 0.0 - clamp(scatter,0.4, 0.8);
                    vec3 scatterColor = mix(vec3(1.0),vec3(colorScatter) * 1.5,scatter);
                    return mix(vec3(colorSky),vec3(scatterColor),atmosphere / 1.3);
                }
                vec3 getSun(vec2 uv) {
                    float sun = 1.0 - distance(uv,iMouse.xy / iResolution.y);
                    sun = clamp(sun,0.0,1.0);
                    
                    float glow = sun;
                    glow = clamp(glow,0.0,1.0);
                    
                    sun = pow(sun,200.0);
                    sun *= 200.0;
                    sun = clamp(sun,0.0,1.0);
                    
                    glow = pow(glow,6.0) * 1.0;
                    glow = pow(glow,(uv.y));
                    glow = clamp(glow,0.0,1.0);
                    
                    sun *= pow(dot(uv.y, uv.y), 1.0 / 1.65);
                    
                    glow *= pow(dot(uv.y, uv.y), 1.0 / 2.0);
                    
                    sun += glow;
                    
                    vec3 sunColor = vec3(colorSun) * sun;
                    
                    return vec3(sunColor);
                }
    
                void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                    vec2 uv = fragCoord.xy / iResolution.y;
                    
                    vec3 sky = getSky(uv,colorSky,colorScatter, colorSun);
                    vec3 sun = getSun(uv);
                    
                    fragColor = vec4(sky + sun,1.0);
                }
            `)
        );
        box.material.side = DoubleSide;
        box.material.uniforms.colorSky = {type: 'vec3', value: new Color(0x4052E2)};
        box.material.uniforms.colorScatter = {type: 'vec3', value: new Color(0xFFFFFF)};
        box.material.uniforms.colorSun = {type: 'vec3', value: new Color(1.0, 1.0, 0.9)};
        return box;
    }
}