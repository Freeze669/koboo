// =====================================================
// SHADERS GLSL AVANCÉS - MAYU & JACK STUDIO
// Effets visuels GPU-accelerated pour particules et animations
// =====================================================

// ===== VERTEX SHADER POUR PARTICULES =====
#version 300 es

// Attributs des vertices
in vec2 a_position;
in vec2 a_texCoord;

// Attributs d'instance (par particule)
in vec2 a_instancePosition;
in float a_instanceSize;
in float a_instanceRotation;
in vec4 a_instanceColor;
in float a_instanceLife;
in vec2 a_instanceVelocity;

// Uniformes
uniform mat4 u_projection;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

// Varyings vers le fragment shader
out vec2 v_texCoord;
out vec4 v_color;
out float v_life;
out vec2 v_velocity;
out float v_size;

// Fonctions utilitaires
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
    // Calculer la position de la particule avec rotation
    vec2 rotatedPosition = rotate2D(a_instanceRotation) * a_position * a_instanceSize;
    vec2 worldPosition = a_instancePosition + rotatedPosition;
    
    // Animation de pulsation basée sur la vie
    float pulse = 1.0 + 0.3 * sin(u_time * 10.0 + a_instancePosition.x * 0.01) * a_instanceLife;
    worldPosition = a_instancePosition + rotatedPosition * pulse;
    
    // Transformation finale
    gl_Position = u_projection * vec4(worldPosition, 0.0, 1.0);
    
    // Passer les données au fragment shader
    v_texCoord = a_texCoord;
    v_life = a_instanceLife;
    v_velocity = a_instanceVelocity;
    v_size = a_instanceSize;
    
    // Couleur avec variation dynamique
    float hueShift = sin(u_time * 2.0 + a_instancePosition.x * 0.005) * 0.1;
    vec3 hsv = vec3(atan(a_instanceColor.g, a_instanceColor.r) / 6.28318 + hueShift, 
                    0.8 + 0.2 * a_instanceLife, 
                    a_instanceColor.b);
    v_color = vec4(hsv2rgb(hsv), a_instanceColor.a * a_instanceLife);
}

// ===== FRAGMENT SHADER POUR PARTICULES =====
#version 300 es
precision highp float;

// Varyings du vertex shader
in vec2 v_texCoord;
in vec4 v_color;
in float v_life;
in vec2 v_velocity;
in float v_size;

// Uniformes
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_blurIntensity;
uniform float u_glowIntensity;

// Output
out vec4 fragColor;

// Fonctions d'effets avancés
float smoothCircle(vec2 coord, float radius, float softness) {
    float dist = length(coord - 0.5);
    return 1.0 - smoothstep(radius - softness, radius + softness, dist);
}

vec3 rainbow(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Motion blur effect
vec4 motionBlur(vec2 texCoord, vec2 velocity, int samples) {
    vec4 color = vec4(0.0);
    float step = 1.0 / float(samples);
    
    for(int i = 0; i < samples; i++) {
        float t = float(i) * step;
        vec2 offset = velocity * t * 0.01;
        color += texture(u_texture, texCoord + offset);
    }
    
    return color / float(samples);
}

void main() {
    vec2 coord = v_texCoord;
    
    // Base texture
    vec4 texColor = texture(u_texture, coord);
    
    // Motion blur basé sur la vélocité
    if(length(v_velocity) > 0.1) {
        texColor = motionBlur(coord, v_velocity, 8);
    }
    
    // Effet de lueur (glow)
    float glow = smoothCircle(coord, 0.3, 0.4) * u_glowIntensity;
    
    // Effet de scintillement (sparkle)
    float sparkle = noise(coord * 20.0 + u_time) * v_life;
    sparkle = pow(sparkle, 3.0) * 0.5;
    
    // Effet arc-en-ciel pour les particules spéciales
    vec3 rainbowColor = rainbow(v_life + u_time * 0.5);
    
    // Combinaison des couleurs
    vec3 finalColor = v_color.rgb;
    finalColor += glow * v_color.rgb * 2.0;
    finalColor += sparkle * rainbowColor;
    
    // Alpha avec fade out
    float alpha = texColor.a * v_color.a;
    alpha *= smoothstep(0.0, 0.1, v_life); // Fade in
    alpha *= smoothstep(0.0, 0.3, 1.0 - v_life); // Fade out
    
    fragColor = vec4(finalColor, alpha);
}

// ===== VERTEX SHADER POUR FOND ANIMÉ =====
#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform mat4 u_projection;

out vec2 v_texCoord;
out vec2 v_screenCoord;

void main() {
    gl_Position = u_projection * vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
    v_screenCoord = a_position;
}

// ===== FRAGMENT SHADER POUR FOND ANIMÉ =====
#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec2 v_screenCoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

out vec4 fragColor;

// Fonctions de bruit avancées
float hash(vec2 p) {
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float noise2D(in vec2 x) {
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
    float frequency = 0.0;
    
    for(int i = 0; i < 6; i++) {
        value += amplitude * noise2D(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Effet de plasma avancé
vec3 plasma(vec2 uv, float time) {
    vec2 p = uv * 4.0;
    
    float noise1 = fbm(p + time * 0.2);
    float noise2 = fbm(p * 2.0 - time * 0.15);
    float noise3 = fbm(p * 3.0 + time * 0.1);
    
    float combined = noise1 + noise2 * 0.5 + noise3 * 0.25;
    
    // Couleurs basées sur les harmoniques
    vec3 color1 = vec3(0.2, 0.4, 0.8);  // Bleu Mayu & Jack
    vec3 color2 = vec3(0.8, 0.3, 0.6);  // Violet
    vec3 color3 = vec3(0.1, 0.8, 0.4);  // Vert
    
    vec3 finalColor = mix(color1, color2, sin(combined * 3.14159 + time) * 0.5 + 0.5);
    finalColor = mix(finalColor, color3, sin(combined * 6.28318 + time * 1.5) * 0.3 + 0.5);
    
    return finalColor;
}

// Effet de distorsion basé sur la souris
vec2 mouseDistortion(vec2 uv, vec2 mouse, float strength) {
    vec2 delta = uv - mouse;
    float dist = length(delta);
    float influence = exp(-dist * 3.0) * strength;
    
    return uv + delta * influence * sin(u_time * 4.0);
}

// Effet de vagues énergétiques
float energyWaves(vec2 uv, float time) {
    float wave1 = sin(uv.x * 10.0 + time * 3.0) * 0.1;
    float wave2 = sin(uv.y * 8.0 + time * 2.5) * 0.1;
    float wave3 = sin((uv.x + uv.y) * 6.0 + time * 4.0) * 0.05;
    
    return wave1 + wave2 + wave3;
}

void main() {
    vec2 uv = v_texCoord;
    vec2 normalizedMouse = u_mouse / u_resolution;
    
    // Distorsion interactive
    uv = mouseDistortion(uv, normalizedMouse, 0.1);
    
    // Effet de plasma avec animation
    vec3 plasmaColor = plasma(uv, u_time);
    
    // Vagues énergétiques
    float waves = energyWaves(uv, u_time);
    plasmaColor += waves * 0.3;
    
    // Effet de respiration (breathing effect)
    float breathing = sin(u_time * 1.5) * 0.1 + 0.9;
    plasmaColor *= breathing;
    
    // Dégradé radial centré
    float radial = 1.0 - length(uv - 0.5) * 1.5;
    radial = smoothstep(0.0, 1.0, radial);
    
    // Intensité finale
    plasmaColor *= u_intensity * radial;
    
    // Effet de bloom subtil
    float bloom = exp(-length(uv - 0.5) * 2.0) * 0.2;
    plasmaColor += bloom * vec3(0.3, 0.5, 1.0);
    
    fragColor = vec4(plasmaColor, 0.3); // Alpha pour transparence
}

// ===== COMPUTE SHADER POUR SIMULATION PHYSIQUE =====
#version 310 es

layout(local_size_x = 64, local_size_y = 1, local_size_z = 1) in;

// Buffer de particules
layout(std430, binding = 0) restrict buffer ParticleBuffer {
    vec4 positions[];  // xyz = position, w = life
    vec4 velocities[]; // xyz = velocity, w = size
    vec4 colors[];     // rgba = color
};

// Uniformes
uniform float u_deltaTime;
uniform float u_time;
uniform vec2 u_gravity;
uniform float u_turbulence;
uniform vec4 u_bounds; // xmin, ymin, xmax, ymax

// Générateur de nombres aléatoires
uint hash(uint x) {
    x += (x << 10u);
    x ^= (x >> 6u);
    x += (x << 3u);
    x ^= (x >> 11u);
    x += (x << 15u);
    return x;
}

float random(uint seed) {
    return float(hash(seed)) / 4294967295.0;
}

void main() {
    uint index = gl_GlobalInvocationID.x;
    if (index >= positions.length()) return;
    
    // Lire les données actuelles
    vec4 pos = positions[index];
    vec4 vel = velocities[index];
    vec4 col = colors[index];
    
    // Vérifier si la particule est vivante
    if (pos.w <= 0.0) {
        // Réinitialiser la particule
        pos = vec4(0.0, 0.0, 0.0, 3.0); // Reset au centre avec vie = 3.0
        vel = vec4(
            (random(index * 2u + uint(u_time * 1000.0)) - 0.5) * 200.0,
            (random(index * 3u + uint(u_time * 1000.0)) - 0.5) * 200.0,
            0.0,
            2.0 + random(index * 4u) * 6.0 // Taille aléatoire
        );
        
        // Couleur aléatoire dans la palette Mayu & Jack
        float hue = random(index * 5u + uint(u_time * 100.0));
        if (hue < 0.33) {
            col = vec4(0.23, 0.51, 0.96, 1.0); // Bleu accent
        } else if (hue < 0.66) {
            col = vec4(0.55, 0.36, 0.96, 1.0); // Violet
        } else {
            col = vec4(0.06, 0.71, 0.51, 1.0); // Vert
        }
    }
    
    // Physique des particules
    vec2 turbulenceForce = vec2(
        (random(index * 6u + uint(u_time * 500.0)) - 0.5) * u_turbulence,
        (random(index * 7u + uint(u_time * 500.0)) - 0.5) * u_turbulence
    );
    
    vel.xy += u_gravity * u_deltaTime;
    vel.xy += turbulenceForce;
    
    // Intégration de Verlet pour plus de stabilité
    pos.xy += vel.xy * u_deltaTime;
    
    // Gestion des collisions avec les bords
    if (pos.x < u_bounds.x || pos.x > u_bounds.z) {
        vel.x *= -0.8;
        pos.x = clamp(pos.x, u_bounds.x, u_bounds.z);
    }
    if (pos.y < u_bounds.y || pos.y > u_bounds.w) {
        vel.y *= -0.8;
        pos.y = clamp(pos.y, u_bounds.y, u_bounds.w);
    }
    
    // Diminuer la vie
    pos.w -= u_deltaTime;
    
    // Fade alpha basé sur la vie
    col.a = pos.w / 3.0;
    
    // Écrire les nouvelles données
    positions[index] = pos;
    velocities[index] = vel;
    colors[index] = col;
}

// ===== FRAGMENT SHADER POUR POST-PROCESSING =====
#version 300 es
precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_sceneTexture;
uniform sampler2D u_bloomTexture;
uniform float u_exposure;
uniform float u_bloomStrength;
uniform float u_time;

out vec4 fragColor;

// Tone mapping
vec3 aces(vec3 color) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
}

// Color grading
vec3 colorGrade(vec3 color) {
    // Augmenter la saturation des couleurs Mayu & Jack
    vec3 weights = vec3(0.299, 0.587, 0.114);
    float luminance = dot(color, weights);
    color = mix(vec3(luminance), color, 1.2); // Saturation +20%
    
    // Contraste légèrement augmenté
    color = pow(color, vec3(0.9));
    
    return color;
}

void main() {
    vec3 scene = texture(u_sceneTexture, v_texCoord).rgb;
    vec3 bloom = texture(u_bloomTexture, v_texCoord).rgb;
    
    // Appliquer l'exposition
    scene *= u_exposure;
    
    // Ajouter le bloom
    scene += bloom * u_bloomStrength;
    
    // Tone mapping
    scene = aces(scene);
    
    // Color grading
    scene = colorGrade(scene);
    
    // Vignetting subtil
    vec2 uv = v_texCoord;
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    vignette = smoothstep(0.3, 1.0, vignette);
    scene *= vignette;
    
    // Film grain léger
    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5) * 0.02;
    scene += grain;
    
    fragColor = vec4(scene, 1.0);
}
