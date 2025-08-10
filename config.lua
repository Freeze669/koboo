-- =====================================================
-- CONFIGURATION DYNAMIQUE - MAYU & JACK STUDIO
-- Fichier Lua pour la gestion des paramètres du site
-- =====================================================

-- Configuration principale
local config = {}

-- ===== CONFIGURATION DU SITE =====
config.site = {
    name = "Mayu & Jack Studio",
    tagline = "Studio Créatif Premium",
    description = "Duo créatif d'exception spécialisé dans la création d'expériences visuelles et digitales",
    version = "2.0.0",
    environment = "production", -- development, staging, production
    
    -- Informations de contact
    contact = {
        email = "jackandmayu@gmail.com",
        discord = {
            server = "https://discord.gg/kobo",
            users = {"papy_jack", "mamy_mayu"}
        },
        instagram = "@RideOrNine",
        phone = nil -- Optionnel
    },
    
    -- URLs et domaines
    urls = {
        primary = "https://mayujackstudio.com",
        cdn = "https://cdn.mayujackstudio.com",
        api = "https://api.mayujackstudio.com",
        assets = "/assets"
    }
}

-- ===== CONFIGURATION DES ANIMATIONS =====
config.animations = {
    -- Durées globales
    durations = {
        fast = 0.2,
        normal = 0.3,
        slow = 0.5,
        very_slow = 1.0
    },
    
    -- Fonctions d'easing
    easing = {
        default = "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce = "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic = "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        smooth = "ease-in-out"
    },
    
    -- Animations du loader
    loader = {
        enabled = true,
        duration = 3000, -- millisecondes
        steps = {
            {progress = 25, text = "Initialisation du design", duration = 800},
            {progress = 50, text = "Chargement des animations", duration = 1000},
            {progress = 75, text = "Préparation de l'expérience", duration = 1200},
            {progress = 100, text = "Lancement du site", duration = 600}
        },
        particles = {
            count = 20,
            colors = {"#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"}
        }
    },
    
    -- Système de particules
    particles = {
        background = {
            enabled = true,
            count = 80,
            speed_min = 10,
            speed_max = 25,
            size_min = 1,
            size_max = 4,
            colors = {"var(--accent-color)", "rgba(139, 92, 246, 0.6)", "rgba(16, 185, 129, 0.6)", "rgba(245, 158, 11, 0.6)"}
        },
        interactive = {
            enabled = true,
            hover_scale = 2.0,
            click_effect = true
        }
    },
    
    -- Optimisations performances
    performance = {
        reduce_on_mobile = true,
        gpu_acceleration = true,
        will_change_enabled = true,
        frame_rate_target = 60
    }
}

-- ===== CONFIGURATION DES COULEURS =====
config.theme = {
    -- Mode sombre par défaut
    default_mode = "dark",
    
    -- Palette de couleurs
    colors = {
        primary = "#0f172a",
        secondary = "#1e293b",
        accent = "#3b82f6",
        
        -- Couleurs de texte
        text = {
            primary = "#f8fafc",
            secondary = "#cbd5e1",
            muted = "#64748b"
        },
        
        -- Couleurs d'état
        success = "#10b981",
        warning = "#f59e0b",
        error = "#ef4444",
        info = "#06b6d4",
        
        -- Dégradés
        gradients = {
            primary = "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            hero = "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(15, 23, 42, 0.85) 100%)",
            card = "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)"
        }
    },
    
    -- Configuration des effets visuels
    effects = {
        glassmorphism = {
            enabled = true,
            blur = "20px",
            opacity = 0.05,
            border_opacity = 0.1
        },
        
        shadows = {
            sm = "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            md = "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            lg = "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            xl = "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            xxl = "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        },
        
        glow = {
            enabled = true,
            colors = {
                primary = "rgba(59, 130, 246, 0.4)",
                secondary = "rgba(139, 92, 246, 0.4)"
            }
        }
    }
}

-- ===== CONFIGURATION DU PORTFOLIO =====
config.portfolio = {
    -- Catégories disponibles
    categories = {
        {id = "graphisme", name = "Graphisme", icon = "fas fa-palette"},
        {id = "developpement", name = "Développement", icon = "fas fa-code"},
        {id = "branding", name = "Branding", icon = "fas fa-copyright"},
        {id = "ui_ux", name = "UI/UX", icon = "fas fa-mobile-alt"}
    },
    
    -- Paramètres d'affichage
    display = {
        items_per_page = 6,
        grid_columns = {
            desktop = 3,
            tablet = 2,
            mobile = 1
        },
        show_filters = true,
        show_tags = true,
        lazy_loading = true
    },
    
    -- Formats d'images supportés
    image_formats = {
        "jpg", "jpeg", "png", "webp", "svg"
    },
    
    -- Optimisation des images
    image_optimization = {
        auto_webp = true,
        lazy_loading = true,
        progressive_jpg = true,
        quality = {
            thumbnail = 80,
            full_size = 90
        }
    }
}

-- ===== CONFIGURATION DES SERVICES =====
config.services = {
    -- Services de Mayu (Graphisme)
    mayu = {
        name = "Mayu",
        role = "Directeur Artistique",
        icon = "fas fa-palette",
        description = "Créations visuelles qui racontent votre histoire",
        specialties = {"Branding", "UI/UX", "Motion"},
        
        services = {
            {
                id = "logos",
                name = "Logos & Identités visuelles",
                icon = "fas fa-paint-brush",
                description = "Création de logos uniques et identités de marque cohérentes",
                pricing = {min = 50, max = 300},
                features = {
                    "Logos vectoriels personnalisés",
                    "Charte graphique complète",
                    "Identité de marque cohérente"
                }
            },
            {
                id = "print",
                name = "Affiches / Flyers / Menus",
                icon = "fas fa-file-image",
                description = "Supports de communication print et digital",
                pricing = {min = 30, max = 80},
                features = {
                    "Affiches événementielles",
                    "Flyers promotionnels",
                    "Menus et cartes de visite"
                }
            },
            {
                id = "social",
                name = "Habillages réseaux sociaux",
                icon = "fas fa-share-alt",
                description = "Bannières, stories, posts personnalisés",
                pricing = {min = 100, max = 250},
                features = {
                    "Bannières de profil",
                    "Stories Instagram",
                    "Posts réseaux sociaux"
                }
            }
        }
    },
    
    -- Services de Jack (Développement)
    jack = {
        name = "Jack",
        role = "Lead Développeur",
        icon = "fas fa-code",
        description = "Solutions techniques innovantes et architectures robustes",
        specialties = {"Full-Stack", "API", "DevOps"},
        
        services = {
            {
                id = "discord_bots",
                name = "Bots Discord",
                icon = "fab fa-discord",
                description = "Systèmes métiers et automatisations avancées",
                pricing = {min = 150, max = 1000},
                features = {
                    "Systèmes de tickets",
                    "Menus interactifs",
                    "Boutiques automatisées"
                }
            },
            {
                id = "web_dev",
                name = "Développement Web",
                icon = "fas fa-globe",
                description = "Sites web et applications sur mesure",
                pricing = {min = 300, max = 2000},
                features = {
                    "Sites vitrines & e-commerce",
                    "Applications web dynamiques",
                    "Plateformes personnalisées"
                }
            },
            {
                id = "devops",
                name = "DevOps & Cloud",
                icon = "fas fa-cloud",
                description = "Infrastructure cloud scalable",
                pricing = {min = 500, max = 2500},
                features = {
                    "CI/CD pipelines",
                    "Monitoring avancé",
                    "Scalabilité"
                }
            }
        }
    }
}

-- ===== CONFIGURATION SEO =====
config.seo = {
    -- Métadonnées par défaut
    default = {
        title = "Mayu & Jack Studio - Studio Créatif Premium",
        description = "Studio créatif premium spécialisé en graphisme et développement web. Créations sur mesure pour des projets d'exception.",
        keywords = "studio créatif, graphisme, développement web, logo, identité visuelle, discord bot, UI/UX",
        author = "Mayu & Jack Studio",
        robots = "index, follow",
        
        -- Open Graph
        og = {
            type = "website",
            locale = "fr_FR",
            site_name = "Mayu & Jack Studio",
            image = "/assets/og-image.jpg"
        },
        
        -- Twitter Card
        twitter = {
            card = "summary_large_image",
            site = "@RideOrNine",
            creator = "@RideOrNine"
        }
    },
    
    -- Pages spécifiques
    pages = {
        services = {
            title = "Nos Services - Mayu & Jack Studio",
            description = "Découvrez nos services premium en graphisme et développement web"
        },
        portfolio = {
            title = "Portfolio - Nos Réalisations",
            description = "Explorez notre portfolio de créations graphiques et projets de développement"
        },
        contact = {
            title = "Contact - Démarrer un Projet",
            description = "Contactez-nous pour démarrer votre projet créatif"
        }
    }
}

-- ===== CONFIGURATION FORMULAIRES =====
config.forms = {
    contact = {
        -- Champs requis
        required_fields = {"name", "email", "projectType", "details", "deadline"},
        
        -- Validation
        validation = {
            name = {min_length = 2, max_length = 50},
            email = {pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"},
            details = {min_length = 10, max_length = 1000},
            deadline = {future_date = true}
        },
        
        -- Notifications
        notifications = {
            email = {
                enabled = true,
                to_clients = true,
                to_studio = true,
                templates = {
                    client_confirmation = "confirmation_template.html",
                    studio_notification = "new_request_template.html"
                }
            },
            discord = {
                enabled = true,
                webhook_url = "YOUR_DISCORD_WEBHOOK_URL"
            }
        },
        
        -- Anti-spam
        security = {
            rate_limit = {
                requests_per_minute = 5,
                requests_per_hour = 20
            },
            honeypot = true,
            csrf_protection = true
        }
    }
}

-- ===== CONFIGURATION PERFORMANCE =====
config.performance = {
    -- Cache
    cache = {
        enabled = true,
        ttl = {
            static_assets = 31536000, -- 1 an
            api_responses = 3600,      -- 1 heure
            images = 2592000          -- 30 jours
        }
    },
    
    -- Compression
    compression = {
        gzip = true,
        brotli = true,
        css_minification = true,
        js_minification = true
    },
    
    -- Images
    images = {
        lazy_loading = true,
        webp_conversion = true,
        responsive_images = true,
        progressive_jpeg = true
    },
    
    -- Monitoring
    monitoring = {
        performance_budget = {
            load_time = 3.0,     -- secondes
            bundle_size = 500,   -- KB
            image_weight = 200   -- KB
        },
        analytics = {
            enabled = true,
            track_performance = true,
            track_errors = true
        }
    }
}

-- ===== CONFIGURATION ACCESSIBILITÉ =====
config.accessibility = {
    -- Standards
    standards = {
        wcag_level = "AA",
        color_contrast_ratio = 4.5,
        font_size_min = 16
    },
    
    -- Fonctionnalités
    features = {
        skip_navigation = true,
        alt_text_required = true,
        keyboard_navigation = true,
        screen_reader_support = true,
        reduced_motion_respect = true
    },
    
    -- Couleurs et contrastes
    high_contrast = {
        enabled = false,
        colors = {
            background = "#000000",
            text = "#ffffff",
            accent = "#ffff00"
        }
    }
}

-- ===== CONFIGURATION RÉSEAUX SOCIAUX =====
config.social_media = {
    platforms = {
        discord = {
            enabled = true,
            server_invite = "https://discord.gg/kobo",
            usernames = {"papy_jack", "mamy_mayu"}
        },
        instagram = {
            enabled = true,
            username = "RideOrNine",
            url = "https://instagram.com/RideOrNine"
        },
        twitter = {
            enabled = false,
            username = "",
            url = ""
        },
        linkedin = {
            enabled = false,
            url = ""
        }
    },
    
    -- Partage
    sharing = {
        enabled = true,
        platforms = {"discord", "instagram", "twitter"},
        default_text = "Découvrez Mayu & Jack Studio - Créations premium"
    }
}

-- ===== FONCTIONS UTILITAIRES =====

-- Fonction pour obtenir une configuration
function config.get(path)
    local keys = {}
    for key in string.gmatch(path, "([^.]+)") do
        table.insert(keys, key)
    end
    
    local value = config
    for _, key in ipairs(keys) do
        if type(value) == "table" and value[key] ~= nil then
            value = value[key]
        else
            return nil
        end
    end
    
    return value
end

-- Fonction pour définir une configuration
function config.set(path, new_value)
    local keys = {}
    for key in string.gmatch(path, "([^.]+)") do
        table.insert(keys, key)
    end
    
    local current = config
    for i = 1, #keys - 1 do
        local key = keys[i]
        if type(current[key]) ~= "table" then
            current[key] = {}
        end
        current = current[key]
    end
    
    current[keys[#keys]] = new_value
end

-- Fonction pour valider la configuration
function config.validate()
    local errors = {}
    
    -- Vérifier les champs obligatoires
    if not config.site.name or config.site.name == "" then
        table.insert(errors, "site.name est requis")
    end
    
    if not config.site.contact.email or config.site.contact.email == "" then
        table.insert(errors, "site.contact.email est requis")
    end
    
    -- Vérifier les URLs
    for name, url in pairs(config.site.urls) do
        if url and not string.match(url, "^https?://") and not string.match(url, "^/") then
            table.insert(errors, "URL invalide pour " .. name .. ": " .. url)
        end
    end
    
    -- Vérifier les couleurs
    for name, color in pairs(config.theme.colors) do
        if type(color) == "string" and not string.match(color, "^#[0-9a-fA-F]+$") and not string.match(color, "^rgb") then
            -- Avertissement seulement pour les couleurs custom
        end
    end
    
    return errors
end

-- Fonction pour charger la configuration depuis un fichier JSON
function config.load_from_json(json_string)
    local json = require("json") -- Nécessite une lib JSON pour Lua
    local data = json.decode(json_string)
    
    for key, value in pairs(data) do
        config[key] = value
    end
end

-- Fonction pour exporter la configuration en JSON
function config.to_json()
    local json = require("json")
    return json.encode(config)
end

-- Fonction d'initialisation
function config.init()
    -- Valider la configuration
    local errors = config.validate()
    if #errors > 0 then
        print("Erreurs de configuration détectées:")
        for _, error in ipairs(errors) do
            print("- " .. error)
        end
        return false
    end
    
    print("Configuration Mayu & Jack Studio chargée avec succès!")
    print("Version: " .. config.site.version)
    print("Environnement: " .. config.site.environment)
    
    return true
end

-- Fonction pour obtenir des statistiques sur la configuration
function config.stats()
    local function count_table(t)
        local count = 0
        for _ in pairs(t) do
            count = count + 1
        end
        return count
    end
    
    return {
        total_services = count_table(config.services.mayu.services) + count_table(config.services.jack.services),
        animation_count = count_table(config.animations.loader.steps),
        color_palette_size = count_table(config.theme.colors),
        social_platforms = count_table(config.social_media.platforms),
        seo_pages = count_table(config.seo.pages)
    }
end

-- Retourner la configuration pour utilisation
return config
