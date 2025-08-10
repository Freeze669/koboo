#!/usr/bin/env ruby
# frozen_string_literal: true

##
# Color Animation Engine pour Mayu & Jack Studio
# Gestion avancée des couleurs, animations et rendus visuels
# Optimisation des performances et génération de palettes dynamiques
##

require 'json'
require 'colorize'
require 'chunky_png'
require 'colorscore'
require 'concurrent-ruby'
require 'fileutils'
require 'benchmark'

##
# Moteur principal de gestion des couleurs et animations
##
class ColorAnimationEngine
  VERSION = '2.0.0'
  
  # Palettes de couleurs prédéfinies pour Mayu & Jack Studio
  BRAND_COLORS = {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#3b82f6',
    accent_secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  }.freeze

  # Animations prédéfinies
  ANIMATION_PRESETS = {
    smooth: { duration: 0.3, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    bounce: { duration: 0.6, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    elastic: { duration: 0.8, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    instant: { duration: 0.1, easing: 'linear' },
    dramatic: { duration: 1.2, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
  }.freeze

  attr_reader :config, :palette_cache, :animation_cache, :performance_metrics

  def initialize(config = {})
    @config = default_config.merge(config)
    @palette_cache = Concurrent::Hash.new
    @animation_cache = Concurrent::Hash.new
    @performance_metrics = {
      colors_generated: 0,
      animations_created: 0,
      processing_time: 0.0,
      cache_hits: 0,
      cache_misses: 0
    }
    
    setup_directories
    log_info "🎨 Color Animation Engine v#{VERSION} initialisé"
  end

  ##
  # Génère une palette de couleurs harmonieuse
  ##
  def generate_color_palette(base_color, options = {})
    start_time = Time.now
    cache_key = "palette_#{base_color}_#{options.hash}"
    
    # Vérifier le cache
    if cached_palette = @palette_cache[cache_key]
      @performance_metrics[:cache_hits] += 1
      return cached_palette
    end

    @performance_metrics[:cache_misses] += 1
    
    # Analyser la couleur de base
    base_rgb = hex_to_rgb(base_color)
    base_hsl = rgb_to_hsl(*base_rgb)
    
    palette = {
      primary: base_color,
      lighter: generate_lighter_variant(base_hsl),
      darker: generate_darker_variant(base_hsl),
      complementary: generate_complementary(base_hsl),
      analogous: generate_analogous_colors(base_hsl),
      triadic: generate_triadic_colors(base_hsl),
      split_complementary: generate_split_complementary(base_hsl),
      gradient_steps: generate_gradient_steps(base_color, options[:steps] || 5)
    }

    # Optimiser les couleurs pour l'accessibilité
    palette = optimize_accessibility(palette) if options[:accessible]
    
    # Mettre en cache
    @palette_cache[cache_key] = palette
    
    @performance_metrics[:colors_generated] += palette.values.flatten.size
    @performance_metrics[:processing_time] += Time.now - start_time
    
    log_info "✅ Palette générée avec #{palette[:gradient_steps].size} nuances"
    palette
  end

  ##
  # Crée des animations CSS personnalisées
  ##
  def create_animation(name, keyframes, options = {})
    start_time = Time.now
    preset = ANIMATION_PRESETS[options[:preset]&.to_sym] || {}
    
    animation = {
      name: name,
      duration: options[:duration] || preset[:duration] || 0.3,
      easing: options[:easing] || preset[:easing] || 'ease',
      delay: options[:delay] || 0,
      iterations: options[:iterations] || 1,
      direction: options[:direction] || 'normal',
      fill_mode: options[:fill_mode] || 'both',
      keyframes: process_keyframes(keyframes),
      css: generate_css_animation(name, keyframes, options.merge(preset))
    }

    # Optimisations pour les performances
    animation[:optimizations] = {
      gpu_accelerated: add_gpu_acceleration(animation),
      will_change: generate_will_change_properties(keyframes),
      composite_layers: analyze_composite_layers(keyframes)
    }

    @animation_cache[name] = animation
    @performance_metrics[:animations_created] += 1
    @performance_metrics[:processing_time] += Time.now - start_time
    
    log_info "🎬 Animation '#{name}' créée (#{animation[:duration]}s)"
    animation
  end

  ##
  # Génère des dégradés complexes et harmonieux
  ##
  def create_gradient(colors, options = {})
    gradient_type = options[:type] || 'linear'
    direction = options[:direction] || '45deg'
    steps = options[:steps] || colors.size
    
    case gradient_type
    when 'linear'
      create_linear_gradient(colors, direction, steps)
    when 'radial'
      create_radial_gradient(colors, options[:shape] || 'circle', steps)
    when 'conic'
      create_conic_gradient(colors, options[:angle] || '0deg', steps)
    when 'mesh'
      create_mesh_gradient(colors, options[:complexity] || 3)
    else
      raise ArgumentError, "Type de dégradé non supporté: #{gradient_type}"
    end
  end

  ##
  # Analyse et optimise les couleurs d'une image
  ##
  def analyze_image_colors(image_path, max_colors = 8)
    return nil unless File.exist?(image_path)
    
    start_time = Time.now
    
    begin
      # Charger l'image
      image = ChunkyPNG::Image.from_file(image_path)
      
      # Extraire les couleurs dominantes
      color_extractor = ColorExtractor.new(image)
      dominant_colors = color_extractor.extract_colors(max_colors)
      
      # Analyser les propriétés
      analysis = {
        dominant_colors: dominant_colors,
        color_harmony: analyze_color_harmony(dominant_colors),
        brightness_distribution: analyze_brightness(dominant_colors),
        saturation_levels: analyze_saturation(dominant_colors),
        temperature: analyze_color_temperature(dominant_colors),
        accessibility_score: calculate_accessibility_score(dominant_colors),
        suggested_palette: generate_palette_from_colors(dominant_colors)
      }
      
      log_info "🖼️ Analyse d'image terminée en #{(Time.now - start_time).round(2)}s"
      analysis
      
    rescue => e
      log_error "Erreur lors de l'analyse de l'image: #{e.message}"
      nil
    end
  end

  ##
  # Génère du CSS optimisé pour les animations et couleurs
  ##
  def export_css(output_file = 'mayu_jack_styles.css')
    css_content = []
    
    # Variables CSS pour les couleurs
    css_content << generate_css_variables
    
    # Animations CSS
    css_content << generate_css_animations
    
    # Classes utilitaires pour les couleurs
    css_content << generate_color_utilities
    
    # Optimisations de performance
    css_content << generate_performance_optimizations
    
    # Responsive et accessibilité
    css_content << generate_responsive_styles
    
    full_css = css_content.join("\n\n")
    
    File.write(output_file, full_css)
    log_info "📄 CSS exporté vers #{output_file} (#{full_css.size} caractères)"
    
    # Générer aussi une version minifiée
    minified_file = output_file.sub('.css', '.min.css')
    File.write(minified_file, minify_css(full_css))
    
    { original: output_file, minified: minified_file, size: full_css.size }
  end

  ##
  # Crée des variations de couleur intelligentes
  ##
  def create_color_variations(base_color, count = 10)
    base_hsl = rgb_to_hsl(*hex_to_rgb(base_color))
    variations = []
    
    # Variations de luminosité
    lightness_step = 80.0 / count
    count.times do |i|
      new_lightness = [10 + (i * lightness_step), 90].min
      variations << hsl_to_hex(base_hsl[0], base_hsl[1], new_lightness)
    end
    
    # Variations de saturation
    saturation_variations = []
    saturation_step = 80.0 / (count / 2)
    (count / 2).times do |i|
      new_saturation = [20 + (i * saturation_step), 100].min
      saturation_variations << hsl_to_hex(base_hsl[0], new_saturation, base_hsl[2])
    end
    
    {
      lightness_variations: variations,
      saturation_variations: saturation_variations,
      temperature_variations: create_temperature_variations(base_color, count / 2),
      harmony_variations: create_harmony_variations(base_color)
    }
  end

  ##
  # Optimise les performances d'animation
  ##
  def optimize_animations_for_performance
    optimizations = {
      gpu_acceleration: {
        properties: %w[transform opacity filter],
        will_change: 'transform, opacity',
        backface_visibility: 'hidden',
        perspective: '1000px'
      },
      
      composite_layers: {
        force_layer: 'translateZ(0)',
        contain: 'layout style paint',
        isolation: 'isolate'
      },
      
      reduce_reflow: {
        avoid_properties: %w[width height top left margin padding],
        prefer_properties: %w[transform opacity filter]
      },
      
      timing_optimizations: {
        use_raf: true,
        debounce_scroll: '16ms',
        throttle_resize: '100ms'
      }
    }
    
    log_info "⚡ Optimisations de performance appliquées"
    optimizations
  end

  ##
  # Génère un rapport de performance
  ##
  def generate_performance_report
    cache_hit_rate = @performance_metrics[:cache_hits].to_f / 
                    (@performance_metrics[:cache_hits] + @performance_metrics[:cache_misses]) * 100
    
    report = {
      engine_version: VERSION,
      timestamp: Time.now.iso8601,
      metrics: @performance_metrics.merge(
        cache_hit_rate: cache_hit_rate.round(2),
        average_processing_time: (@performance_metrics[:processing_time] / 
                                 [@performance_metrics[:colors_generated] + @performance_metrics[:animations_created], 1].max).round(4)
      ),
      memory_usage: get_memory_usage,
      cache_sizes: {
        palette_cache: @palette_cache.size,
        animation_cache: @animation_cache.size
      },
      recommendations: generate_performance_recommendations
    }
    
    log_info "📊 Rapport de performance généré"
    report
  end

  private

  def default_config
    {
      cache_enabled: true,
      max_cache_size: 1000,
      performance_mode: :balanced, # :fast, :balanced, :quality
      accessibility_mode: true,
      gpu_acceleration: true,
      color_precision: 2,
      animation_precision: 3
    }
  end

  def setup_directories
    %w[output cache temp].each do |dir|
      FileUtils.mkdir_p(dir) unless Dir.exist?(dir)
    end
  end

  # Conversion de couleurs
  def hex_to_rgb(hex)
    hex = hex.gsub('#', '')
    [hex[0,2].to_i(16), hex[2,2].to_i(16), hex[4,2].to_i(16)]
  end

  def rgb_to_hsl(r, g, b)
    r, g, b = r/255.0, g/255.0, b/255.0
    max = [r, g, b].max
    min = [r, g, b].min
    delta = max - min
    
    l = (max + min) / 2.0
    
    if delta == 0
      h = s = 0
    else
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
      
      case max
      when r then h = (g - b) / delta + (g < b ? 6 : 0)
      when g then h = (b - r) / delta + 2
      when b then h = (r - g) / delta + 4
      end
      h /= 6
    end
    
    [h * 360, s * 100, l * 100]
  end

  def hsl_to_hex(h, s, l)
    h = h % 360
    s = s / 100.0
    l = l / 100.0
    
    c = (1 - (2 * l - 1).abs) * s
    x = c * (1 - ((h / 60.0) % 2 - 1).abs)
    m = l - c / 2
    
    r, g, b = case h.to_i / 60
    when 0 then [c, x, 0]
    when 1 then [x, c, 0]
    when 2 then [0, c, x]
    when 3 then [0, x, c]
    when 4 then [x, 0, c]
    when 5 then [c, 0, x]
    end
    
    r = ((r + m) * 255).round
    g = ((g + m) * 255).round
    b = ((b + m) * 255).round
    
    "#%02x%02x%02x" % [r, g, b]
  end

  # Génération de variations de couleur
  def generate_lighter_variant(hsl)
    new_lightness = [hsl[2] + 20, 95].min
    hsl_to_hex(hsl[0], hsl[1], new_lightness)
  end

  def generate_darker_variant(hsl)
    new_lightness = [hsl[2] - 20, 5].max
    hsl_to_hex(hsl[0], hsl[1], new_lightness)
  end

  def generate_complementary(hsl)
    complementary_hue = (hsl[0] + 180) % 360
    hsl_to_hex(complementary_hue, hsl[1], hsl[2])
  end

  def generate_analogous_colors(hsl)
    [
      hsl_to_hex((hsl[0] + 30) % 360, hsl[1], hsl[2]),
      hsl_to_hex((hsl[0] - 30) % 360, hsl[1], hsl[2])
    ]
  end

  def generate_triadic_colors(hsl)
    [
      hsl_to_hex((hsl[0] + 120) % 360, hsl[1], hsl[2]),
      hsl_to_hex((hsl[0] + 240) % 360, hsl[1], hsl[2])
    ]
  end

  def generate_split_complementary(hsl)
    [
      hsl_to_hex((hsl[0] + 150) % 360, hsl[1], hsl[2]),
      hsl_to_hex((hsl[0] + 210) % 360, hsl[1], hsl[2])
    ]
  end

  def generate_gradient_steps(base_color, steps)
    base_hsl = rgb_to_hsl(*hex_to_rgb(base_color))
    gradient_colors = []
    
    steps.times do |i|
      factor = i.to_f / (steps - 1)
      lightness = base_hsl[2] + (50 - base_hsl[2]) * factor
      gradient_colors << hsl_to_hex(base_hsl[0], base_hsl[1], lightness)
    end
    
    gradient_colors
  end

  # Génération CSS
  def generate_css_variables
    css = ":root {\n"
    css += "  /* Couleurs principales - Mayu & Jack Studio */\n"
    
    BRAND_COLORS.each do |name, color|
      css += "  --color-#{name.to_s.gsub('_', '-')}: #{color};\n"
    end
    
    css += "\n  /* Variables d'animation */\n"
    ANIMATION_PRESETS.each do |name, preset|
      css += "  --animation-#{name}-duration: #{preset[:duration]}s;\n"
      css += "  --animation-#{name}-easing: #{preset[:easing]};\n"
    end
    
    css += "}"
    css
  end

  def generate_css_animations
    css = "/* Animations optimisées pour Mayu & Jack Studio */\n"
    
    @animation_cache.each do |name, animation|
      css += animation[:css] + "\n\n"
    end
    
    css
  end

  def generate_color_utilities
    css = "/* Classes utilitaires de couleur */\n"
    
    BRAND_COLORS.each do |name, color|
      sanitized_name = name.to_s.gsub('_', '-')
      css += ".text-#{sanitized_name} { color: var(--color-#{sanitized_name}); }\n"
      css += ".bg-#{sanitized_name} { background-color: var(--color-#{sanitized_name}); }\n"
      css += ".border-#{sanitized_name} { border-color: var(--color-#{sanitized_name}); }\n"
    end
    
    css
  end

  def generate_performance_optimizations
    <<~CSS
      /* Optimisations de performance */
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      .will-animate {
        will-change: transform, opacity;
      }
      
      .composite-layer {
        contain: layout style paint;
        isolation: isolate;
      }
      
      /* Animations fluides */
      .smooth-transition {
        transition: all var(--animation-smooth-duration) var(--animation-smooth-easing);
      }
      
      .bounce-transition {
        transition: all var(--animation-bounce-duration) var(--animation-bounce-easing);
      }
    CSS
  end

  def generate_responsive_styles
    <<~CSS
      /* Styles responsives et accessibilité */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      @media (max-width: 768px) {
        .mobile-optimized {
          animation-duration: 0.2s !important;
        }
      }
      
      @media (prefers-color-scheme: dark) {
        :root {
          --adaptive-text: #f8fafc;
          --adaptive-bg: #0f172a;
        }
      }
    CSS
  end

  def minify_css(css)
    css.gsub(/\/\*.*?\*\//m, '')
       .gsub(/\s+/, ' ')
       .gsub(/;\s*}/, '}')
       .gsub(/\s*{\s*/, '{')
       .gsub(/;\s*/, ';')
       .strip
  end

  # Logging
  def log_info(message)
    puts "[INFO] #{Time.now.strftime('%H:%M:%S')} #{message}".colorize(:green)
  end

  def log_error(message)
    puts "[ERROR] #{Time.now.strftime('%H:%M:%S')} #{message}".colorize(:red)
  end

  def get_memory_usage
    `ps -o rss= -p #{Process.pid}`.to_i * 1024 rescue 0
  end

  def generate_performance_recommendations
    recommendations = []
    
    if @performance_metrics[:cache_hits] < @performance_metrics[:cache_misses]
      recommendations << "Augmenter la taille du cache pour améliorer les performances"
    end
    
    if @performance_metrics[:processing_time] > 1.0
      recommendations << "Considérer l'activation du mode performance rapide"
    end
    
    recommendations
  end
end

##
# Extracteur de couleurs dominantes d'une image
##
class ColorExtractor
  def initialize(image)
    @image = image
  end

  def extract_colors(max_colors = 8)
    color_counts = Hash.new(0)
    
    # Échantillonner l'image pour les performances
    sample_rate = [@image.width * @image.height / 10000, 1].max.to_i
    
    (0...@image.height).step(sample_rate) do |y|
      (0...@image.width).step(sample_rate) do |x|
        pixel = @image[x, y]
        color_counts[pixel] += 1
      end
    end
    
    # Trier par fréquence et convertir en hex
    color_counts.sort_by { |_, count| -count }
                .first(max_colors)
                .map { |pixel, _| pixel_to_hex(pixel) }
  end

  private

  def pixel_to_hex(pixel)
    r = (pixel >> 24) & 0xff
    g = (pixel >> 16) & 0xff
    b = (pixel >> 8) & 0xff
    "#%02x%02x%02x" % [r, g, b]
  end
end

##
# Adaptateurs pour intégration avec autres langages
##
class LanguageAdapters
  ##
  # Adaptateur pour JavaScript
  ##
  def self.to_javascript(color_data)
    js_code = <<~JS
      // Couleurs générées par Ruby Color Engine - Mayu & Jack Studio
      const MayuJackColors = {
        palette: #{color_data.to_json},
        
        // Fonction utilitaire pour appliquer une couleur
        applyColor: function(element, color, property = 'color') {
          if (typeof element === 'string') {
            element = document.querySelector(element);
          }
          if (element) {
            element.style[property] = color;
          }
        },
        
        // Génère un dégradé CSS
        generateGradient: function(colors, direction = '45deg') {
          return `linear-gradient(${direction}, ${colors.join(', ')})`;
        }
      };
      
      // Export pour modules
      if (typeof module !== 'undefined' && module.exports) {
        module.exports = MayuJackColors;
      }
    JS
    
    js_code
  end

  ##
  # Adaptateur pour PHP
  ##
  def self.to_php(color_data)
    php_code = <<~PHP
      <?php
      /**
       * Couleurs générées par Ruby Color Engine - Mayu & Jack Studio
       */
      class MayuJackColors {
          const PALETTE = #{color_data.to_json.gsub('"', "'")};
          
          public static function getColor($name) {
              return self::PALETTE[$name] ?? null;
          }
          
          public static function generateCSS($colors) {
              $css = '';
              foreach ($colors as $name => $color) {
                  $css .= ".color-{$name} { color: {$color}; }\\n";
                  $css .= ".bg-{$name} { background-color: {$color}; }\\n";
              }
              return $css;
          }
      }
      ?>
    PHP
    
    php_code
  end

  ##
  # Adaptateur pour Python
  ##
  def self.to_python(color_data)
    python_code = <<~PYTHON
      # Couleurs générées par Ruby Color Engine - Mayu & Jack Studio
      import json
      
      class MayuJackColors:
          PALETTE = #{color_data.to_json}
          
          @classmethod
          def get_color(cls, name):
              return cls.PALETTE.get(name)
          
          @classmethod
          def to_rgb(cls, hex_color):
              hex_color = hex_color.lstrip('#')
              return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
          
          @classmethod
          def generate_matplotlib_colors(cls):
              return [cls.get_color(name) for name in cls.PALETTE.keys()]
    PYTHON
    
    python_code
  end
end

# Point d'entrée principal
if __FILE__ == $0
  puts "🎨 Démarrage du Color Animation Engine - Mayu & Jack Studio".colorize(:cyan)
  puts "=" * 60
  
  # Initialiser le moteur
  engine = ColorAnimationEngine.new(
    performance_mode: :quality,
    accessibility_mode: true,
    gpu_acceleration: true
  )
  
  # Générer une palette basée sur la couleur de marque
  base_color = ColorAnimationEngine::BRAND_COLORS[:accent]
  palette = engine.generate_color_palette(base_color, accessible: true, steps: 8)
  
  puts "✅ Palette générée avec #{palette[:gradient_steps].size} variations".colorize(:green)
  
  # Créer des animations
  bounce_animation = engine.create_animation('bounceIn', {
    '0%' => { transform: 'scale(0.3)', opacity: '0' },
    '50%' => { transform: 'scale(1.05)' },
    '70%' => { transform: 'scale(0.9)' },
    '100%' => { transform: 'scale(1)', opacity: '1' }
  }, preset: :bounce)
  
  # Créer un dégradé mesh complexe
  gradient = engine.create_gradient(
    [palette[:primary], palette[:complementary], palette[:analogous].first],
    type: 'mesh',
    complexity: 4
  )
  
  # Exporter le CSS
  css_files = engine.export_css('mayu_jack_enhanced.css')
  puts "📄 CSS exporté: #{css_files[:original]} (#{css_files[:size]} octets)".colorize(:blue)
  
  # Générer les adaptateurs
  js_adapter = LanguageAdapters.to_javascript(palette)
  File.write('mayu_jack_colors.js', js_adapter)
  
  php_adapter = LanguageAdapters.to_php(palette)
  File.write('mayu_jack_colors.php', php_adapter)
  
  python_adapter = LanguageAdapters.to_python(palette)
  File.write('mayu_jack_colors.py', python_adapter)
  
  puts "🔗 Adaptateurs générés pour JS, PHP et Python".colorize(:yellow)
  
  # Rapport de performance
  report = engine.generate_performance_report
  puts "\n📊 Rapport de performance:".colorize(:magenta)
  puts "   • Couleurs générées: #{report[:metrics][:colors_generated]}"
  puts "   • Animations créées: #{report[:metrics][:animations_created]}"
  puts "   • Taux de cache: #{report[:metrics][:cache_hit_rate]}%"
  puts "   • Temps moyen: #{report[:metrics][:average_processing_time]}s"
  
  puts "\n🚀 Color Animation Engine terminé avec succès!".colorize(:green)
end
