// ===== PREMIUM JAVASCRIPT - MAYU & JACK STUDIO =====

// Initialisation AOS (Animate On Scroll)
AOS.init({
    duration: 1200,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// ===== NAVIGATION FLUIDE ET SECTIONS FIXES =====
document.addEventListener('DOMContentLoaded', () => {
    // Gestion de la navigation pour tous les liens sauf Accueil
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            
            // Si c'est le lien Accueil, laisser le comportement par défaut
            if (targetId === 'accueil') {
                return;
            }
            
            e.preventDefault();
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Défilement fluide vers la section cible
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fermer le menu mobile si ouvert
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    const spans = hamburger.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            }
        });
    });
    
    // Gestion de l'état actif des liens de navigation
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Observer le scroll pour mettre à jour la navigation active
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
    
    // Mise à jour initiale
    updateActiveNavLink();
    
    // Fixer les sections du bas (Mentions et Footer)
    const mentionsSection = document.getElementById('mentions');
    const footerSection = document.querySelector('.footer');
    
    if (mentionsSection) {
        mentionsSection.style.position = 'relative';
        mentionsSection.style.zIndex = '10';
    }
    
    if (footerSection) {
        footerSection.style.position = 'relative';
        footerSection.style.zIndex = '5';
    }
    
    // Amélioration de l'expérience de navigation
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Ajouter une classe pour indiquer le scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// ===== LOADER PREMIUM =====
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const steps = document.querySelectorAll('.step');
    const loadingText = document.querySelector('.loading-text');
    
    let currentProgress = 0;
    let currentStep = 1;
    
    // Créer des particules pour le loader
    createLoaderParticles();
    
    // Simulation de chargement réaliste
    const loadingSteps = [
        { progress: 25, text: "Initialisation du design", duration: 800 },
        { progress: 50, text: "Chargement des animations", duration: 1000 },
        { progress: 75, text: "Préparation de l'expérience", duration: 1200 },
        { progress: 100, text: "Lancement du site", duration: 600 }
    ];
    
    function updateProgress(targetProgress, stepText, duration) {
        return new Promise((resolve) => {
            const startProgress = currentProgress;
            const progressDiff = targetProgress - startProgress;
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fonction d'easing pour un mouvement plus naturel
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                
                currentProgress = startProgress + (progressDiff * easeOutQuart);
                
                progressFill.style.width = currentProgress + '%';
                progressPercentage.textContent = Math.round(currentProgress) + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            }
            
            animate();
        });
    }
    
    function updateStep(stepNumber) {
        // Désactiver l'étape précédente
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) < stepNumber) {
                step.classList.add('completed');
            }
        });
        
        // Activer la nouvelle étape
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    async function startLoading() {
        for (let i = 0; i < loadingSteps.length; i++) {
            const step = loadingSteps[i];
            
            // Mettre à jour le texte de chargement
            loadingText.textContent = step.text;
            
            // Mettre à jour l'étape active
            updateStep(i + 1);
            
            // Animer la progression
            await updateProgress(step.progress, step.text, step.duration);
            
            // Pause entre les étapes
            if (i < loadingSteps.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        // Animation finale
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Masquer le loader avec une animation de sortie
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
            
            // Animation d'entrée pour le contenu
            animateHeroContent();
        }, 800);
    }
    
    // Démarrer le chargement après un court délai
    setTimeout(startLoading, 500);
});

function createLoaderParticles() {
    const particlesContainer = document.querySelector('.loader-particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(139, 92, 246, 0.6)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// ===== CURSOR PERSONNALISÉ =====
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Effet hover sur les éléments interactifs
const interactiveElements = document.querySelectorAll('a, button, .btn, .service-card, .portfolio-item, .testimonial-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
        cursorFollower.style.opacity = '0.3';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.opacity = '0.5';
    });
});

// ===== NAVIGATION PREMIUM =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navigation mobile
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animation des barres du hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Fermer le menu en cliquant sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// Navbar background au scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }
});

// ===== ANIMATION HERO CONTENT =====
function animateHeroContent() {
    const titleLines = document.querySelectorAll('.title-line');
    const heroDescription = document.querySelector('.hero-description');
    const heroStats = document.querySelectorAll('.stat-item');
    const heroActions = document.querySelector('.hero-actions');
    const showcaseCards = document.querySelectorAll('.showcase-card');
    
    // Animation des lignes du titre avec effet de typewriter
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0) scale(1)';
            
            // Effet de typewriter pour le texte
            const text = line.textContent;
            line.textContent = '';
            line.style.overflow = 'hidden';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            typeWriter();
        }, index * 300);
    });
    
    // Animation de la description avec fade in
    setTimeout(() => {
        heroDescription.style.opacity = '1';
        heroDescription.style.transform = 'translateY(0)';
        heroDescription.style.filter = 'blur(0px)';
    }, 800);
    
    // Animation des statistiques avec bounce
    heroStats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0) scale(1)';
            stat.style.animation = 'bounceIn 0.8s ease';
            animateCounter(stat.querySelector('.stat-number'));
        }, 1200 + index * 250);
    });
    
    // Animation des boutons avec slide
    setTimeout(() => {
        heroActions.style.opacity = '1';
        heroActions.style.transform = 'translateY(0)';
        heroActions.style.animation = 'slideInUp 0.8s ease';
    }, 1800);
    
    // Animation des cartes showcase avec stagger
    showcaseCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
            card.style.animation = 'cardFloat 1s ease';
        }, 2000 + index * 300);
    });
}

// ===== COMPTEUR ANIMÉ =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500;
    const step = target / (duration / 16);
    let current = 0;
    
    // Effet de bounce sur le nombre
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--accent-color)';
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
            
            // Animation finale
            element.style.animation = 'numberPop 0.5s ease';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = 'var(--accent-color)';
            }, 500);
        } else {
            element.textContent = Math.floor(current);
            
            // Effet de pulse pendant l'animation
            if (Math.floor(current) % 10 === 0) {
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 100);
            }
        }
    }, 16);
}

// ===== FILTRES PORTFOLIO PREMIUM =====
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Animation de filtrage
        portfolioItems.forEach((item, index) => {
            setTimeout(() => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            }, index * 100);
        });
    });
});

// ===== EFFET PARALLAXE HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (hero && heroParticles) {
        const rate = scrolled * -0.5;
        heroParticles.style.transform = `translateY(${rate}px)`;
    }
});

// ===== ANIMATIONS AU CLIC =====
document.addEventListener('click', (e) => {
    // Animation des boutons au clic
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        
        // Animation de scale
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation du texte au clic
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        
        // Effet de brillance
        link.style.filter = 'brightness(1.2)';
        link.style.transition = 'filter 0.3s ease';
        
        setTimeout(() => {
            link.style.filter = 'brightness(1)';
        }, 300);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation des cartes au clic
    if (e.target.closest('.service-card, .portfolio-item, .testimonial-card')) {
        const card = e.target.closest('.service-card, .portfolio-item, .testimonial-card');
        
        // Effet de pulse
        card.style.transform = 'scale(1.02)';
        card.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation des filtres au clic
    if (e.target.closest('.filter-btn')) {
        const filterBtn = e.target.closest('.filter-btn');
        
        // Effet de bounce
        filterBtn.style.transform = 'scale(1.1) rotate(5deg)';
        filterBtn.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            filterBtn.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation des éléments admin au clic
    if (e.target.closest('.admin-btn, .discord-btn, .action-btn')) {
        const adminBtn = e.target.closest('.admin-btn, .discord-btn, .action-btn');
        
        // Effet de pulse avec rotation
        adminBtn.style.transform = 'scale(1.05) rotate(2deg)';
        adminBtn.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            adminBtn.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation des métriques au clic
    if (e.target.closest('.metric-card')) {
        const metricCard = e.target.closest('.metric-card');
        
        // Effet de bounce
        metricCard.style.transform = 'scale(1.03) translateY(-5px)';
        metricCard.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            metricCard.style.transform = 'scale(1) translateY(0)';
        }, 300);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
    
    // Animation du texte au clic
    if (e.target.tagName === 'H1' || e.target.tagName === 'H2' || e.target.tagName === 'H3' || e.target.tagName === 'H4' || e.target.tagName === 'H5' || e.target.tagName === 'H6') {
        const heading = e.target;
        
        // Effet de wave
        heading.style.transform = 'scale(1.05)';
        heading.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            heading.style.transform = 'scale(1)';
        }, 300);
        
        // Créer des particules au clic
        createClickParticles(e.clientX, e.clientY);
    }
});

// ===== ANIMATIONS DES FORMULAIRES =====
document.addEventListener('focusin', (e) => {
    // Animation des champs de formulaire au focus
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        const input = e.target;
        
        // Effet de lift
        input.style.transform = 'translateY(-3px)';
        input.style.transition = 'transform 0.3s ease';
        
        // Créer des particules d'info
        const rect = input.getBoundingClientRect();
        createInfoParticles(rect.left + rect.width / 2, rect.top);
    }
});

document.addEventListener('focusout', (e) => {
    // Reset des animations des champs de formulaire
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        const input = e.target;
        
        input.style.transform = 'translateY(0)';
        input.style.transition = 'transform 0.3s ease';
    }
});

// ===== ANIMATIONS DES NOTIFICATIONS =====
function animateNotification(notification) {
    // Animation d'entrée
    notification.style.transform = 'translateY(-20px) scale(0.9)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0) scale(1)';
        notification.style.opacity = '1';
    }, 100);
    
    // Animation de sortie après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px) scale(0.9)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== ANIMATIONS AU SCROLL =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Délai pour optimiser les performances
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Animation des éléments au scroll
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
                element.classList.add('animate-in');
            }
        });
    }, 16); // ~60fps
});

// ===== ANIMATIONS DES ICÔNES =====
function animateIcon(icon) {
    // Animation de rotation et scale
    icon.style.transform = 'rotate(360deg) scale(1.2)';
    icon.style.transition = 'transform 0.6s ease';
    
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg) scale(1)';
    }, 600);
}

// ===== ANIMATIONS DES CARTES =====
function animateCard(card) {
    // Animation de flip
    card.style.transform = 'rotateY(10deg) scale(1.02)';
    card.style.transition = 'transform 0.4s ease';
    
    setTimeout(() => {
        card.style.transform = 'rotateY(0deg) scale(1)';
    }, 400);
}

// ===== PARTICULES AU CLIC =====
function createClickParticles(x, y) {
    const particleCount = 8;
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        
        // Générer des directions aléatoires pour chaque particule
        const angle = (i / particleCount) * 2 * Math.PI;
        const distance = 20 + Math.random() * 40;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            --random-x: ${randomX}px;
            --random-y: ${randomY}px;
            --random-x2: ${randomX * 2}px;
            --random-y2: ${randomY * 2}px;
            --random-x3: ${randomX * 3}px;
            --random-y3: ${randomY * 3}px;
            --random-x4: ${randomX * 4}px;
            --random-y4: ${randomY * 4}px;
            animation: clickParticleAnimation 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
}

// ===== PARTICULES DE SUCCÈS =====
function createSuccessParticles() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const particleCount = 12;
    const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        
        // Générer des directions en cercle pour un effet de célébration
        const angle = (i / particleCount) * 2 * Math.PI;
        const distance = 30 + Math.random() * 50;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 6px;
            height: 6px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            --random-x: ${randomX}px;
            --random-y: ${randomY}px;
            --random-x2: ${randomX * 2}px;
            --random-y2: ${randomY * 2}px;
            --random-x3: ${randomX * 3}px;
            --random-y3: ${randomY * 3}px;
            --random-x4: ${randomX * 4}px;
            --random-y4: ${randomY * 4}px;
            animation: successParticleAnimation 1.2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1200);
    }
}

// ===== PARTICULES D'INFO =====
function createInfoParticles(x, y) {
    const particleCount = 6;
    const colors = ['#3b82f6', '#1d4ed8', '#60a5fa'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'info-particle';
        
        // Générer des directions aléatoires
        const angle = (i / particleCount) * 2 * Math.PI;
        const distance = 15 + Math.random() * 25;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 3px;
            height: 3px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            --random-x: ${randomX}px;
            --random-y: ${randomY}px;
            --random-x2: ${randomX * 2}px;
            --random-y2: ${randomY * 2}px;
            animation: infoParticleAnimation 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 600);
    }
}

// ===== ANIMATION DES CARTES =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== FORMULAIRES PREMIUM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation des champs
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        if (validateForm(data)) {
            // Animation de soumission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'Envoi en cours...';
            submitBtn.style.pointerEvents = 'none';
            
                    try {
            // Créer des particules de succès
            createSuccessParticles();
            
            // Tracker la soumission du formulaire avec le système de monitoring
            if (window.siteMonitor && typeof window.siteMonitor.trackUserActivity === 'function') {
                window.siteMonitor.trackUserActivity('form_submit', {
                    formId: 'contactForm',
                    formType: 'contact',
                    formData: {
                        name: data.name,
                        email: data.email,
                        projectType: data.projectType,
                        details: data.details ? data.details.substring(0, 100) + '...' : '',
                        deadline: data.deadline,
                        budget: data.budget || 'Non spécifié'
                    },
                    timestamp: Date.now(),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                });
            }
                
                // Envoyer directement au webhook Discord si le monitoring n'est pas disponible
                if (!window.siteMonitor) {
                    await sendFormToDiscord(data);
                }
                
                // Simuler l'envoi
                setTimeout(() => {
                    showNotification('Votre demande a été envoyée avec succès ! Nous vous contacterons sous 24h via Discord ou email.', 'success');
                    
                    // Afficher les informations de suivi
                    showOrderTrackingInfo();
                    
                    contactForm.reset();
                    
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                }, 2000);
                
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
                
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.pointerEvents = 'auto';
            }
        }
    });
}

/**
 * Envoyer le formulaire directement au webhook Discord (fallback)
 */
async function sendFormToDiscord(formData) {
    const webhookUrl = "https://discord.com/api/webhooks/1404106149908709537/P13SLEmuSEh5xcPtH9WCYd0ANluBicjSal-Xt3ESqzU7jJZ9jG3i31ENiNyLlZGQWBp1";
    
    const embed = {
        title: '📝 Nouveau Formulaire de Contact Soumis',
        description: 'Un nouveau client a soumis une demande de projet',
        color: 0xf39c12, // Orange
        fields: [
            {
                name: '👤 Nom',
                value: formData.name || 'Non spécifié',
                inline: true
            },
            {
                name: '📧 Email',
                value: formData.email || 'Non spécifié',
                inline: true
            },
            {
                name: '🎯 Type de Projet',
                value: formData.projectType || 'Non spécifié',
                inline: true
            },
            {
                name: '📝 Description',
                value: formData.details ? (formData.details.length > 200 ? formData.details.substring(0, 200) + '...' : formData.details) : 'Non spécifiée',
                inline: false
            },
            {
                name: '📅 Deadline',
                value: formData.deadline || 'Non spécifiée',
                inline: true
            },
            {
                name: '💰 Budget',
                value: formData.budget || 'Non spécifié',
                inline: true
            },
            {
                name: '🌐 Page Source',
                value: window.location.href,
                inline: false
            },
            {
                name: '📱 Appareil',
                value: getDeviceInfo(),
                inline: true
            },
            {
                name: '⏰ Heure de Soumission',
                value: new Date().toLocaleString('fr-FR'),
                inline: true
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Mayu & Jack Studio - Formulaire de Contact'
        }
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: '', // Plus de ping @everyone
                embeds: [embed]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ Formulaire envoyé au webhook Discord');
        
    } catch (error) {
        // Erreur silencieuse - pas de message dans le webhook
        throw error;
    }
}

/**
 * Obtenir les informations sur l'appareil
 */
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'Desktop';
    
    if (/Android/i.test(userAgent)) {
        deviceType = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = 'iOS';
    } else if (/Windows Phone/i.test(userAgent)) {
        deviceType = 'Windows Phone';
    } else if (/Mobile|Tablet/i.test(userAgent)) {
        deviceType = 'Mobile/Tablet';
    }
    
    return `${deviceType} - ${navigator.platform}`;
}

// Validation des formulaires
function validateForm(data) {
    const requiredFields = ['name', 'email', 'projectType', 'details', 'deadline'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'Ce champ est requis');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Validation email
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Email invalide');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (!existingError) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.5rem';
        formGroup.appendChild(errorElement);
    }
    
    input.style.borderColor = 'var(--error-color)';
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
}

// ===== SYSTÈME DE SUIVI DE COMMANDE =====
function showOrderTrackingInfo() {
    const trackingInfo = document.createElement('div');
    trackingInfo.className = 'order-tracking-info';
    trackingInfo.innerHTML = `
        <div class="tracking-content">
            <h4>Suivi de votre commande</h4>
            <div class="tracking-steps">
                <div class="tracking-step completed">
                    <div class="step-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="step-info">
                        <h5>Demande envoyée</h5>
                        <p>Votre demande a été reçue avec succès</p>
                    </div>
                </div>
                <div class="tracking-step active">
                    <div class="step-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="step-info">
                        <h5>Contact sous 24h</h5>
                        <p>Nous vous contacterons via Discord ou email</p>
                    </div>
                </div>
                <div class="tracking-step">
                    <div class="step-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="step-info">
                        <h5>Discussion du projet</h5>
                        <p>Échange détaillé sur vos besoins</p>
                    </div>
                </div>
                <div class="tracking-step">
                    <div class="step-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div class="step-info">
                        <h5>Développement</h5>
                        <p>Création de votre projet</p>
                    </div>
                </div>
            </div>
            <div class="tracking-contact">
                <p><strong>Contact direct :</strong></p>
                <p>Discord : papy_jack / mamy_mayu</p>
                <p>Email : jackandmayu@gmail.com</p>
                <p>Instagram : @RideOrNine</p>
            </div>
        </div>
    `;
    
    // Ajouter les styles pour l'animation
    trackingInfo.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 23, 42, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        z-index: 10000;
        animation: slideInUp 0.5s ease;
    `;
    
    document.body.appendChild(trackingInfo);
    
    // Fermer après 8 secondes
    setTimeout(() => {
        trackingInfo.style.animation = 'slideOutDown 0.5s ease';
        setTimeout(() => {
            if (trackingInfo.parentNode) {
                trackingInfo.parentNode.removeChild(trackingInfo);
            }
        }, 500);
    }, 8000);
}

// ===== NOTIFICATIONS PREMIUM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--accent-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fermeture automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Fermeture manuelle
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// ===== EFFETS VISUELS AVANCÉS =====

// Effet de particules en arrière-plan
function createParticles() {
    // Toujours créer les particules pour un effet visuel optimal
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    // Nombre de particules adaptatif mais toujours visible
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 15));
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2; // Taille légèrement augmentée
        const colors = ['var(--accent-color)', 'rgba(139, 92, 246, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(59, 130, 246, 0.5)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${Math.random() * 0.4 + 0.2};
            animation: float-particle ${Math.random() * 25 + 20}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            will-change: transform;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Animation des particules optimisée pour les FPS
const particleAnimation = `
@keyframes float-particle {
    0% {
        transform: translateY(100vh) translateX(0px);
        opacity: 0;
    }
    15% {
        opacity: 1;
        transform: translateY(85vh) translateX(10px);
    }
    50% {
        opacity: 1;
        transform: translateY(50vh) translateX(-15px);
    }
    85% {
        opacity: 1;
        transform: translateY(15vh) translateX(20px);
    }
    100% {
        transform: translateY(-100px) translateX(0px);
        opacity: 0;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes slideInUp {
    0% {
        transform: translateY(30px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes cardFloat {
    0% {
        transform: translateY(30px) scale(0.9);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes numberPop {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
}
`;

// Ajouter l'animation au style
const style = document.createElement('style');
style.textContent = particleAnimation;
document.head.appendChild(style);

// ===== SMOOTH SCROLL PREMIUM =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== EFFET MAGNETIQUE SUR LES BOUTONS =====
document.querySelectorAll('.btn, .cta-button').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        button.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ===== ANIMATION DES ICÔNES =====
document.querySelectorAll('.card-icon, .service-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===== EFFET DE GLOW SUR LES CARTES =====
document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `
            0 0 30px rgba(59, 130, 246, 0.3),
            0 10px 25px -5px rgba(0, 0, 0, 0.3)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// ===== PERFORMANCE OPTIMISATIONS =====

// Lazy loading des images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Debounce pour les événements de scroll optimisé
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimisation du scroll avec throttling pour améliorer les FPS
const optimizedScrollHandler = debounce(() => {
    // Code de scroll optimisé - réduit pour améliorer les FPS
    requestAnimationFrame(() => {
        // Mise à jour minimale pour maintenir les FPS
    });
}, 32); // Augmenté à 32ms pour réduire la charge

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les animations avec délai pour améliorer les FPS
    requestIdleCallback(() => {
        createParticles();
        initializeAnimations();
    }, { timeout: 1000 });
    
    // Masquer le curseur sur mobile
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
        if (typeof cursor !== 'undefined') cursor.style.display = 'none';
        if (typeof cursorFollower !== 'undefined') cursorFollower.style.display = 'none';
    }
});

function initializeAnimations() {
    // Animation des éléments au chargement optimisée pour les FPS
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
    
    // Utiliser Intersection Observer pour les animations au lieu de setTimeout
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Arrêter d'observer une fois animé
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    showNotification('Une erreur est survenue. Veuillez rafraîchir la page.', 'error');
});

// ===== ACCESSIBILITÉ =====
document.addEventListener('keydown', (e) => {
    // Navigation au clavier
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('active')) {
            hamburger.click();
        }
    }
    
    // Navigation avec Tab
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== ANALYTICS SIMULÉ =====
function trackEvent(eventName, data = {}) {
    // Ici vous pourriez intégrer Google Analytics ou autre
}

// Tracker les interactions importantes
document.querySelectorAll('.btn, .cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: btn.textContent.trim(),
            button_type: btn.classList.contains('btn-primary') ? 'primary' : 'secondary'
        });
    });
});

// ===== FINALISATION =====
// Site optimisé et prêt 