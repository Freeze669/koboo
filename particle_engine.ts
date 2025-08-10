/**
 * Advanced Particle Engine TypeScript pour Mayu & Jack Studio
 * Système de particules GPU-accelerated avec WebGL et rendu optimisé
 */

import { ShaderManager } from './shader_manager';
import { ColorPalette } from './color_palette';

interface ParticleConfig {
    count: number;
    lifetime: number;
    speed: { min: number; max: number };
    size: { min: number; max: number };
    colors: string[];
    gravity: number;
    turbulence: number;
    emissionRate: number;
    blendMode: 'normal' | 'additive' | 'multiply' | 'screen';
    shape: 'circle' | 'square' | 'triangle' | 'star' | 'heart';
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: Float32Array;
    rotation: number;
    rotationSpeed: number;
    alpha: number;
    shape: string;
}

interface ParticleSystem {
    particles: Particle[];
    config: ParticleConfig;
    emitter: { x: number; y: number };
    active: boolean;
    time: number;
}

export class AdvancedParticleEngine {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private shaderManager: ShaderManager;
    private colorPalette: ColorPalette;
    private systems: Map<string, ParticleSystem>;
    private animationId: number | null = null;
    private performance: {
        fps: number;
        frameTime: number;
        particleCount: number;
        drawCalls: number;
    };
    private uniformBuffer: WebGLBuffer | null = null;
    private particleTexture: WebGLTexture | null = null;

    // Buffers pour rendu en batch optimisé
    private vertexBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;
    private instanceBuffer: WebGLBuffer | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // Initialiser WebGL2 avec options optimisées
        const gl = canvas.getContext('webgl2', {
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
            desynchronized: true
        });

        if (!gl) {
            throw new Error('WebGL2 non supporté');
        }

        this.gl = gl;
        this.shaderManager = new ShaderManager(gl);
        this.colorPalette = new ColorPalette();
        this.systems = new Map();
        this.performance = { fps: 0, frameTime: 0, particleCount: 0, drawCalls: 0 };

        this.initializeWebGL();
        this.setupBuffers();
        this.createParticleTexture();
        
        console.log('🎆 Advanced Particle Engine initialisé avec WebGL2');
    }

    private initializeWebGL(): void {
        const gl = this.gl;

        // Configuration WebGL optimisée
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        
        // Support des extensions WebGL2
        gl.getExtension('EXT_color_buffer_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('WEBGL_debug_renderer_info');

        // Configuration du viewport
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private setupBuffers(): void {
        const gl = this.gl;

        // Buffer pour les vertices (quad de base)
        const vertices = new Float32Array([
            -0.5, -0.5, 0.0, 0.0,  // bottom left
             0.5, -0.5, 1.0, 0.0,  // bottom right
             0.5,  0.5, 1.0, 1.0,  // top right
            -0.5,  0.5, 0.0, 1.0   // top left
        ]);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Buffer pour les indices
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Buffer d'instances pour le rendu en batch
        this.instanceBuffer = gl.createBuffer();

        // Uniform Buffer Object pour les données partagées
        this.uniformBuffer = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.uniformBuffer);
        gl.bufferData(gl.UNIFORM_BUFFER, 256, gl.DYNAMIC_DRAW); // 256 bytes
    }

    private createParticleTexture(): void {
        const gl = this.gl;
        const size = 64;
        const data = new Uint8Array(size * size * 4);

        // Générer une texture de particule radiale
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = (x - size / 2) / (size / 2);
                const dy = (y - size / 2) / (size / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const alpha = Math.max(0, 1 - distance);
                
                const index = (y * size + x) * 4;
                data[index] = 255;     // R
                data[index + 1] = 255; // G
                data[index + 2] = 255; // B
                data[index + 3] = Math.floor(alpha * 255); // A
            }
        }

        this.particleTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.particleTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    public createSystem(id: string, config: Partial<ParticleConfig>): void {
        const defaultConfig: ParticleConfig = {
            count: 1000,
            lifetime: 3.0,
            speed: { min: 50, max: 150 },
            size: { min: 2, max: 8 },
            colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
            gravity: 0.1,
            turbulence: 0.05,
            emissionRate: 100,
            blendMode: 'additive',
            shape: 'circle'
        };

        const finalConfig = { ...defaultConfig, ...config };
        
        const system: ParticleSystem = {
            particles: [],
            config: finalConfig,
            emitter: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
            active: true,
            time: 0
        };

        // Pré-allouer les particules pour éviter les allocations pendant le rendu
        for (let i = 0; i < finalConfig.count; i++) {
            system.particles.push(this.createParticle(system));
        }

        this.systems.set(id, system);
        console.log(`✨ Système de particules '${id}' créé avec ${finalConfig.count} particules`);
    }

    private createParticle(system: ParticleSystem): Particle {
        const config = system.config;
        const colorIndex = Math.floor(Math.random() * config.colors.length);
        const color = this.hexToFloat32Array(config.colors[colorIndex]);

        return {
            x: system.emitter.x + (Math.random() - 0.5) * 20,
            y: system.emitter.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
            vy: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
            life: config.lifetime,
            maxLife: config.lifetime,
            size: config.size.min + Math.random() * (config.size.max - config.size.min),
            color: color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            alpha: 1.0,
            shape: config.shape
        };
    }

    private hexToFloat32Array(hex: string): Float32Array {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new Float32Array([r, g, b, 1.0]);
    }

    public updateSystem(id: string, deltaTime: number): void {
        const system = this.systems.get(id);
        if (!system || !system.active) return;

        system.time += deltaTime;
        const config = system.config;

        // Mettre à jour les particules existantes
        for (let i = 0; i < system.particles.length; i++) {
            const particle = system.particles[i];
            
            if (particle.life <= 0) {
                // Réinitialiser la particule
                Object.assign(particle, this.createParticle(system));
                continue;
            }

            // Physique des particules
            particle.vx += (Math.random() - 0.5) * config.turbulence;
            particle.vy += config.gravity + (Math.random() - 0.5) * config.turbulence;
            
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            particle.rotation += particle.rotationSpeed;
            particle.life -= deltaTime;
            
            // Fade out basé sur la vie restante
            particle.alpha = Math.max(0, particle.life / particle.maxLife);
            
            // Boundaries - rebondir ou wraparound
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
        }
    }

    public renderSystem(id: string): void {
        const system = this.systems.get(id);
        if (!system || !system.active) return;

        const gl = this.gl;
        const config = system.config;

        // Préparer les données d'instance
        const instanceData = new Float32Array(system.particles.length * 12); // 12 floats par particule
        let aliveParticles = 0;

        for (let i = 0; i < system.particles.length; i++) {
            const particle = system.particles[i];
            if (particle.life <= 0 || particle.alpha <= 0) continue;

            const offset = aliveParticles * 12;
            
            // Position et taille
            instanceData[offset] = particle.x;
            instanceData[offset + 1] = particle.y;
            instanceData[offset + 2] = particle.size;
            instanceData[offset + 3] = particle.rotation;
            
            // Couleur avec alpha
            instanceData[offset + 4] = particle.color[0];
            instanceData[offset + 5] = particle.color[1];
            instanceData[offset + 6] = particle.color[2];
            instanceData[offset + 7] = particle.alpha;
            
            // Données supplémentaires (pour effets avancés)
            instanceData[offset + 8] = particle.life / particle.maxLife; // Normalized life
            instanceData[offset + 9] = particle.vx / 100; // Velocity pour motion blur
            instanceData[offset + 10] = particle.vy / 100;
            instanceData[offset + 11] = 0; // Reserved

            aliveParticles++;
        }

        if (aliveParticles === 0) return;

        // Upload des données d'instance
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, instanceData.subarray(0, aliveParticles * 12), gl.DYNAMIC_DRAW);

        // Configurer le blend mode
        this.setBlendMode(config.blendMode);

        // Utiliser le shader approprié
        const shaderProgram = this.shaderManager.getProgram('particle');
        gl.useProgram(shaderProgram);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.particleTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'u_texture'), 0);

        // Matrices de projection
        const projectionMatrix = this.getProjectionMatrix();
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'u_projection'), false, projectionMatrix);

        // Rendu instancié
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, aliveParticles);

        this.performance.drawCalls++;
        this.performance.particleCount += aliveParticles;
    }

    private setBlendMode(mode: string): void {
        const gl = this.gl;
        
        switch (mode) {
            case 'additive':
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                break;
            case 'multiply':
                gl.blendFunc(gl.DST_COLOR, gl.ZERO);
                break;
            case 'screen':
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
                break;
            default: // normal
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    private getProjectionMatrix(): Float32Array {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Matrice de projection orthographique 2D
        return new Float32Array([
            2/width, 0, 0, 0,
            0, -2/height, 0, 0,
            0, 0, -1, 0,
            -1, 1, 0, 1
        ]);
    }

    public setEmitterPosition(systemId: string, x: number, y: number): void {
        const system = this.systems.get(systemId);
        if (system) {
            system.emitter.x = x;
            system.emitter.y = y;
        }
    }

    public createMouseTrailSystem(): void {
        this.createSystem('mouseTrail', {
            count: 500,
            lifetime: 1.5,
            speed: { min: 10, max: 30 },
            size: { min: 3, max: 12 },
            colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
            gravity: -0.05,
            turbulence: 0.02,
            emissionRate: 200,
            blendMode: 'additive',
            shape: 'circle'
        });

        // Suivre la souris
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.setEmitterPosition('mouseTrail', x, y);
        });
    }

    public createBackgroundAmbient(): void {
        this.createSystem('ambient', {
            count: 200,
            lifetime: 10.0,
            speed: { min: 5, max: 15 },
            size: { min: 1, max: 4 },
            colors: ['#3b82f6', '#1e293b', '#0f172a'],
            gravity: 0.01,
            turbulence: 0.01,
            emissionRate: 20,
            blendMode: 'normal',
            shape: 'circle'
        });

        // Émetteurs multiples pour l'ambiance
        const system = this.systems.get('ambient');
        if (system) {
            setInterval(() => {
                system.emitter.x = Math.random() * this.canvas.width;
                system.emitter.y = Math.random() * this.canvas.height;
            }, 2000);
        }
    }

    public start(): void {
        if (this.animationId !== null) return;

        let lastTime = performance.now();
        let frameCount = 0;
        let fpsTime = 0;

        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Reset performance counters
            this.performance.drawCalls = 0;
            this.performance.particleCount = 0;
            this.performance.frameTime = deltaTime * 1000;

            // Clear canvas
            const gl = this.gl;
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Mettre à jour et rendre tous les systèmes
            for (const [id, system] of this.systems) {
                this.updateSystem(id, deltaTime);
                this.renderSystem(id);
            }

            // Calculer FPS
            frameCount++;
            fpsTime += deltaTime;
            if (fpsTime >= 1.0) {
                this.performance.fps = frameCount / fpsTime;
                frameCount = 0;
                fpsTime = 0;
            }

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
        console.log('🚀 Particle Engine démarré');
    }

    public stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    public getPerformanceStats() {
        return { ...this.performance };
    }

    public toggleSystem(id: string): void {
        const system = this.systems.get(id);
        if (system) {
            system.active = !system.active;
        }
    }

    public removeSystem(id: string): void {
        this.systems.delete(id);
    }

    private resizeCanvas(): void {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    public dispose(): void {
        this.stop();
        
        // Nettoyer les ressources WebGL
        const gl = this.gl;
        if (this.vertexBuffer) gl.deleteBuffer(this.vertexBuffer);
        if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
        if (this.instanceBuffer) gl.deleteBuffer(this.instanceBuffer);
        if (this.uniformBuffer) gl.deleteBuffer(this.uniformBuffer);
        if (this.particleTexture) gl.deleteTexture(this.particleTexture);
        
        this.shaderManager.dispose();
        this.systems.clear();
    }
}

// Factory pour créer des effets prédéfinis
export class ParticleEffects {
    private engine: AdvancedParticleEngine;

    constructor(engine: AdvancedParticleEngine) {
        this.engine = engine;
    }

    public createFireworks(x: number, y: number): void {
        this.engine.createSystem(`firework_${Date.now()}`, {
            count: 300,
            lifetime: 2.0,
            speed: { min: 100, max: 300 },
            size: { min: 2, max: 6 },
            colors: ['#ff6b35', '#f7931e', '#ffd700', '#ff1744'],
            gravity: 0.3,
            turbulence: 0.1,
            emissionRate: 1000,
            blendMode: 'additive',
            shape: 'star'
        });
        this.engine.setEmitterPosition(`firework_${Date.now() - 1}`, x, y);
    }

    public createMagicSparkles(): void {
        this.engine.createSystem('sparkles', {
            count: 150,
            lifetime: 4.0,
            speed: { min: 20, max: 60 },
            size: { min: 2, max: 8 },
            colors: ['#ffffff', '#f0f9ff', '#dbeafe', '#bfdbfe'],
            gravity: -0.02,
            turbulence: 0.03,
            emissionRate: 30,
            blendMode: 'additive',
            shape: 'star'
        });
    }

    public createColorWave(colors: string[]): void {
        this.engine.createSystem('colorWave', {
            count: 800,
            lifetime: 5.0,
            speed: { min: 30, max: 100 },
            size: { min: 4, max: 12 },
            colors: colors,
            gravity: 0.05,
            turbulence: 0.08,
            emissionRate: 150,
            blendMode: 'screen',
            shape: 'circle'
        });
    }
}

// Export des types pour utilisation externe
export type { ParticleConfig, Particle, ParticleSystem };
