// ===== PREMIUM JAVASCRIPT - MAYU & JACK STUDIO =====

// Initialisation AOS (Animate On Scroll)
AOS.init({
    duration: 1200,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
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
                embeds: [embed]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ Formulaire envoyé au webhook Discord');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi au webhook Discord:', error);
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
    
    // Créer plus de particules avec différentes tailles et couleurs
    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const colors = ['var(--accent-color)', 'rgba(139, 92, 246, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: float-particle ${Math.random() * 15 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Animation des particules
const particleAnimation = `
@keyframes float-particle {
    0% {
        transform: translateY(100vh) rotate(0deg) scale(0);
        opacity: 0;
    }
    10% {
        opacity: 1;
        transform: translateY(90vh) rotate(36deg) scale(1);
    }
    90% {
        opacity: 1;
        transform: translateY(10vh) rotate(324deg) scale(1);
    }
    100% {
        transform: translateY(-100px) rotate(360deg) scale(0);
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

// Debounce pour les événements de scroll
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

// Optimisation du scroll
const optimizedScrollHandler = debounce(() => {
    // Code de scroll optimisé
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Créer les particules
    createParticles();
    
    // Initialiser les animations
    initializeAnimations();
    
    // Masquer le curseur sur mobile
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
});

function initializeAnimations() {
    // Animation des éléments au chargement
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
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
    console.log('Event tracked:', eventName, data);
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
console.log('🎨 Mayu & Jack Studio - Site Premium Loaded');
console.log('✨ Animations et effets visuels activés');
console.log('🚀 Performance optimisée'); 