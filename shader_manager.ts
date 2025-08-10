/**
 * Shader Manager pour Mayu & Jack Studio
 * Gestion avancée des shaders WebGL avec compilation optimisée
 */

interface ShaderSource {
    vertex: string;
    fragment: string;
    compute?: string;
}

interface ShaderProgram {
    program: WebGLProgram;
    uniforms: Map<string, WebGLUniformLocation>;
    attributes: Map<string, number>;
}

export class ShaderManager {
    private gl: WebGL2RenderingContext;
    private programs: Map<string, ShaderProgram>;
    private shaderCache: Map<string, WebGLShader>;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.programs = new Map();
        this.shaderCache = new Map();
        
        this.initializeDefaultShaders();
    }

    private initializeDefaultShaders(): void {
        // Shader de particules avancé
        this.createProgram('particle', {
            vertex: `#version 300 es
                in vec2 a_position;
                in vec2 a_texCoord;
                in vec2 a_instancePosition;
                in float a_instanceSize;
                in float a_instanceRotation;
                in vec4 a_instanceColor;
                in float a_instanceLife;
                in vec2 a_instanceVelocity;

                uniform mat4 u_projection;
                uniform float u_time;
                uniform vec2 u_resolution;

                out vec2 v_texCoord;
                out vec4 v_color;
                out float v_life;
                out vec2 v_velocity;

                mat2 rotate2D(float angle) {
                    float s = sin(angle);
                    float c = cos(angle);
                    return mat2(c, -s, s, c);
                }

                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    vec2 rotatedPos = rotate2D(a_instanceRotation) * a_position * a_instanceSize;
                    float pulse = 1.0 + 0.2 * sin(u_time * 8.0 + a_instancePosition.x * 0.01) * a_instanceLife;
                    vec2 worldPos = a_instancePosition + rotatedPos * pulse;
                    
                    gl_Position = u_projection * vec4(worldPos, 0.0, 1.0);
                    
                    v_texCoord = a_texCoord;
                    v_life = a_instanceLife;
                    v_velocity = a_instanceVelocity;
                    
                    float hue = atan(a_instanceColor.g, a_instanceColor.r) / 6.28318;
                    hue += sin(u_time * 3.0 + a_instancePosition.x * 0.01) * 0.1;
                    vec3 hsv = vec3(hue, 0.8, a_instanceColor.b);
                    v_color = vec4(hsv2rgb(hsv), a_instanceColor.a * a_instanceLife);
                }`,
            
            fragment: `#version 300 es
                precision highp float;
                
                in vec2 v_texCoord;
                in vec4 v_color;
                in float v_life;
                in vec2 v_velocity;

                uniform sampler2D u_texture;
                uniform float u_time;
                uniform float u_glowIntensity;

                out vec4 fragColor;

                float smoothCircle(vec2 coord, float radius, float softness) {
                    float dist = length(coord - 0.5);
                    return 1.0 - smoothstep(radius - softness, radius + softness, dist);
                }

                float noise(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                vec3 rainbow(float t) {
                    return 0.5 + 0.5 * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67)));
                }

                void main() {
                    vec2 coord = v_texCoord;
                    vec4 texColor = texture(u_texture, coord);
                    
                    // Effet de lueur
                    float glow = smoothCircle(coord, 0.3, 0.4) * u_glowIntensity;
                    
                    // Scintillement
                    float sparkle = noise(coord * 15.0 + u_time * 2.0) * v_life;
                    sparkle = pow(sparkle, 4.0) * 0.8;
                    
                    // Couleur arc-en-ciel pour les effets spéciaux
                    vec3 rainbowColor = rainbow(v_life + u_time * 0.3);
                    
                    vec3 finalColor = v_color.rgb;
                    finalColor += glow * v_color.rgb * 1.5;
                    finalColor += sparkle * rainbowColor * 0.5;
                    
                    // Motion blur basé sur la vélocité
                    float motionBlur = length(v_velocity) * 0.01;
                    finalColor *= (1.0 + motionBlur);
                    
                    float alpha = texColor.a * v_color.a;
                    alpha *= smoothstep(0.0, 0.2, v_life);
                    
                    fragColor = vec4(finalColor, alpha);
                }`
        });

        // Shader de fond animé
        this.createProgram('background', {
            vertex: `#version 300 es
                in vec2 a_position;
                in vec2 a_texCoord;

                uniform mat4 u_projection;

                out vec2 v_texCoord;
                out vec2 v_screenCoord;

                void main() {
                    gl_Position = u_projection * vec4(a_position, 0.0, 1.0);
                    v_texCoord = a_texCoord;
                    v_screenCoord = a_position;
                }`,
            
            fragment: `#version 300 es
                precision highp float;
                
                in vec2 v_texCoord;
                in vec2 v_screenCoord;

                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                uniform float u_intensity;

                out vec4 fragColor;

                float hash(vec2 p) {
                    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
                }

                float noise2D(vec2 x) {
                    vec2 i = floor(x);
                    vec2 f = fract(x);
                    
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    
                    for(int i = 0; i < 5; i++) {
                        value += amplitude * noise2D(p);
                        p *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                vec3 plasma(vec2 uv, float time) {
                    vec2 p = uv * 3.0;
                    
                    float noise1 = fbm(p + time * 0.2);
                    float noise2 = fbm(p * 1.5 - time * 0.15);
                    
                    float combined = noise1 + noise2 * 0.5;
                    
                    // Couleurs Mayu & Jack
                    vec3 color1 = vec3(0.23, 0.51, 0.96); // Bleu accent
                    vec3 color2 = vec3(0.55, 0.36, 0.96); // Violet
                    vec3 color3 = vec3(0.06, 0.71, 0.51); // Vert
                    
                    vec3 finalColor = mix(color1, color2, sin(combined * 3.14159 + time) * 0.5 + 0.5);
                    finalColor = mix(finalColor, color3, sin(combined * 6.28318 + time * 1.2) * 0.3 + 0.5);
                    
                    return finalColor;
                }

                vec2 mouseDistortion(vec2 uv, vec2 mouse, float strength) {
                    vec2 delta = uv - mouse;
                    float dist = length(delta);
                    float influence = exp(-dist * 4.0) * strength;
                    return uv + delta * influence * sin(u_time * 5.0);
                }

                void main() {
                    vec2 uv = v_texCoord;
                    vec2 mouse = u_mouse / u_resolution;
                    
                    // Distorsion interactive
                    uv = mouseDistortion(uv, mouse, 0.05);
                    
                    // Effet plasma
                    vec3 color = plasma(uv, u_time);
                    
                    // Respiration
                    float breathing = sin(u_time * 1.2) * 0.1 + 0.9;
                    color *= breathing;
                    
                    // Dégradé radial
                    float radial = 1.0 - length(uv - 0.5) * 1.2;
                    radial = smoothstep(0.0, 1.0, radial);
                    
                    color *= u_intensity * radial;
                    
                    // Bloom subtil
                    float bloom = exp(-length(uv - 0.5) * 3.0) * 0.15;
                    color += bloom * vec3(0.4, 0.6, 1.0);
                    
                    fragColor = vec4(color, 0.25);
                }`
        });

        // Shader de post-processing
        this.createProgram('postprocess', {
            vertex: `#version 300 es
                in vec2 a_position;
                in vec2 a_texCoord;

                out vec2 v_texCoord;

                void main() {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                    v_texCoord = a_texCoord;
                }`,
            
            fragment: `#version 300 es
                precision highp float;
                
                in vec2 v_texCoord;

                uniform sampler2D u_sceneTexture;
                uniform sampler2D u_bloomTexture;
                uniform float u_exposure;
                uniform float u_bloomStrength;
                uniform float u_time;

                out vec4 fragColor;

                vec3 aces(vec3 color) {
                    const float a = 2.51;
                    const float b = 0.03;
                    const float c = 2.43;
                    const float d = 0.59;
                    const float e = 0.14;
                    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
                }

                vec3 colorGrade(vec3 color) {
                    vec3 weights = vec3(0.299, 0.587, 0.114);
                    float luminance = dot(color, weights);
                    color = mix(vec3(luminance), color, 1.3); // Saturation
                    color = pow(color, vec3(0.85)); // Contraste
                    return color;
                }

                void main() {
                    vec3 scene = texture(u_sceneTexture, v_texCoord).rgb;
                    vec3 bloom = texture(u_bloomTexture, v_texCoord).rgb;
                    
                    scene *= u_exposure;
                    scene += bloom * u_bloomStrength;
                    scene = aces(scene);
                    scene = colorGrade(scene);
                    
                    // Vignetting
                    float vignette = 1.0 - length(v_texCoord - 0.5) * 0.6;
                    vignette = smoothstep(0.4, 1.0, vignette);
                    scene *= vignette;
                    
                    // Film grain
                    float grain = (fract(sin(dot(v_texCoord, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
                    scene += grain;
                    
                    fragColor = vec4(scene, 1.0);
                }`
        });

        console.log('🎨 Shaders par défaut initialisés');
    }

    private compileShader(source: string, type: number): WebGLShader | null {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        if (!shader) {
            console.error('Impossible de créer le shader');
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Erreur de compilation du shader:', error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const gl = this.gl;
        const program = gl.createProgram();
        
        if (!program) {
            console.error('Impossible de créer le programme');
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            console.error('Erreur de liaison du programme:', error);
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    public createProgram(name: string, sources: ShaderSource): boolean {
        const gl = this.gl;

        // Compiler les shaders
        const vertexShader = this.compileShader(sources.vertex, gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(sources.fragment, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) {
            return false;
        }

        // Lier le programme
        const program = this.linkProgram(vertexShader, fragmentShader);
        if (!program) {
            return false;
        }

        // Collecter les uniformes et attributs
        const uniforms = new Map<string, WebGLUniformLocation>();
        const attributes = new Map<string, number>();

        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const uniform = gl.getActiveUniform(program, i);
            if (uniform) {
                const location = gl.getUniformLocation(program, uniform.name);
                if (location) {
                    uniforms.set(uniform.name, location);
                }
            }
        }

        const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttributes; i++) {
            const attribute = gl.getActiveAttrib(program, i);
            if (attribute) {
                const location = gl.getAttribLocation(program, attribute.name);
                attributes.set(attribute.name, location);
            }
        }

        // Stocker le programme
        this.programs.set(name, {
            program,
            uniforms,
            attributes
        });

        // Nettoyer les shaders
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        console.log(`✅ Programme shader '${name}' créé avec succès`);
        return true;
    }

    public getProgram(name: string): WebGLProgram | null {
        const shaderProgram = this.programs.get(name);
        return shaderProgram ? shaderProgram.program : null;
    }

    public useProgram(name: string): boolean {
        const program = this.getProgram(name);
        if (program) {
            this.gl.useProgram(program);
            return true;
        }
        return false;
    }

    public setUniform(programName: string, uniformName: string, value: any): boolean {
        const shaderProgram = this.programs.get(programName);
        if (!shaderProgram) return false;

        const location = shaderProgram.uniforms.get(uniformName);
        if (!location) return false;

        const gl = this.gl;

        // Déterminer le type et appeler la bonne fonction
        if (typeof value === 'number') {
            gl.uniform1f(location, value);
        } else if (Array.isArray(value)) {
            switch (value.length) {
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
                case 16:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
            }
        } else if (value instanceof Float32Array) {
            if (value.length === 16) {
                gl.uniformMatrix4fv(location, false, value);
            }
        }

        return true;
    }

    public getAttributeLocation(programName: string, attributeName: string): number {
        const shaderProgram = this.programs.get(programName);
        if (!shaderProgram) return -1;

        return shaderProgram.attributes.get(attributeName) ?? -1;
    }

    public createComputeShader(name: string, source: string): boolean {
        // WebGL 2.0 ne supporte pas les compute shaders natifs
        // Cette méthode pourrait être étendue pour WebGPU à l'avenir
        console.warn('Compute shaders non supportés en WebGL 2.0');
        return false;
    }

    public recompileProgram(name: string, sources: ShaderSource): boolean {
        // Supprimer l'ancien programme
        const oldProgram = this.programs.get(name);
        if (oldProgram) {
            this.gl.deleteProgram(oldProgram.program);
            this.programs.delete(name);
        }

        // Recompiler
        return this.createProgram(name, sources);
    }

    public validateProgram(name: string): boolean {
        const program = this.getProgram(name);
        if (!program) return false;

        const gl = this.gl;
        gl.validateProgram(program);
        
        const valid = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
        if (!valid) {
            const error = gl.getProgramInfoLog(program);
            console.error(`Validation échouée pour le programme '${name}':`, error);
        }

        return valid;
    }

    public getProgramInfo(name: string): any {
        const shaderProgram = this.programs.get(name);
        if (!shaderProgram) return null;

        const gl = this.gl;
        const program = shaderProgram.program;

        return {
            uniforms: Array.from(shaderProgram.uniforms.keys()),
            attributes: Array.from(shaderProgram.attributes.keys()),
            linked: gl.getProgramParameter(program, gl.LINK_STATUS),
            validated: gl.getProgramParameter(program, gl.VALIDATE_STATUS)
        };
    }

    public dispose(): void {
        // Nettoyer tous les programmes
        for (const [name, shaderProgram] of this.programs) {
            this.gl.deleteProgram(shaderProgram.program);
        }
        this.programs.clear();

        // Nettoyer le cache des shaders
        for (const [name, shader] of this.shaderCache) {
            this.gl.deleteShader(shader);
        }
        this.shaderCache.clear();

        console.log('🧹 ShaderManager nettoyé');
    }
}

// Classe utilitaire pour les couleurs
export class ColorPalette {
    private static readonly MAYU_JACK_COLORS = {
        primary: [0.06, 0.09, 0.16, 1.0],     // #0f172a
        secondary: [0.12, 0.16, 0.23, 1.0],   // #1e293b
        accent: [0.23, 0.51, 0.96, 1.0],      // #3b82f6
        accent2: [0.55, 0.36, 0.96, 1.0],     // #8b5cf6
        success: [0.06, 0.71, 0.51, 1.0],     // #10b981
        warning: [0.96, 0.62, 0.04, 1.0],     // #f59e0b
        error: [0.94, 0.27, 0.27, 1.0]        // #ef4444
    };

    public static getColor(name: keyof typeof ColorPalette.MAYU_JACK_COLORS): Float32Array {
        return new Float32Array(ColorPalette.MAYU_JACK_COLORS[name]);
    }

    public static getAllColors(): Float32Array[] {
        return Object.values(ColorPalette.MAYU_JACK_COLORS).map(color => new Float32Array(color));
    }

    public static hexToFloat32Array(hex: string): Float32Array {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new Float32Array([r, g, b, 1.0]);
    }

    public static interpolateColors(color1: Float32Array, color2: Float32Array, t: number): Float32Array {
        const result = new Float32Array(4);
        for (let i = 0; i < 4; i++) {
            result[i] = color1[i] + (color2[i] - color1[i]) * t;
        }
        return result;
    }
}
