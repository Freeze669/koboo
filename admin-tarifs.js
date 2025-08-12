/**
 * Gestion des Tarifs - Panel Admin - Mayu & Jack Studio
 * Interface d'administration des prix et services
 */

class AdminTarifs {
    constructor() {
        this.tarifsConfig = window.tarifsConfig;
        this.currentEditing = null;
        this.init();
    }
    
    /**
     * Initialisation
     */
    init() {
        console.log('🚀 Initialisation du module de gestion des tarifs...');
        this.renderTarifsPanel();
        this.setupEventListeners();
    }
    
    /**
     * Rendu du panel des tarifs
     */
    renderTarifsPanel() {
        const container = document.getElementById('tarifs-management');
        if (!container) return;
        
        container.innerHTML = `
            <div class="tarifs-header">
                <h3><i class="fas fa-euro-sign"></i> Gestion des Tarifs</h3>
                <div class="tarifs-actions">
                    <button class="btn btn-primary" onclick="adminTarifs.exportConfig()">
                        <i class="fas fa-download"></i> Exporter
                    </button>
                    <button class="btn btn-secondary" onclick="adminTarifs.importConfig()">
                        <i class="fas fa-upload"></i> Importer
                    </button>
                    <button class="btn btn-success" onclick="adminTarifs.addNewService()">
                        <i class="fas fa-plus"></i> Nouveau Service
                    </button>
                </div>
            </div>
            
            <div class="tarifs-content">
                <div class="tarifs-section">
                    <h4><i class="fas fa-cogs"></i> Services</h4>
                    <div id="services-list" class="tarifs-list"></div>
                </div>
                
                <div class="tarifs-section">
                    <h4><i class="fas fa-box"></i> Forfaits</h4>
                    <div id="forfaits-list" class="tarifs-list"></div>
                </div>
                
                <div class="tarifs-section">
                    <h4><i class="fas fa-puzzle-piece"></i> Options Additionnelles</h4>
                    <div id="options-list" class="tarifs-list"></div>
                </div>
            </div>
            
            <!-- Modal d'édition -->
            <div id="tarif-edit-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title">Éditer le Tarif</h3>
                        <span class="close" onclick="adminTarifs.closeModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="tarif-edit-form">
                            <div class="form-group">
                                <label for="tarif-nom">Nom du service</label>
                                <input type="text" id="tarif-nom" required>
                            </div>
                            <div class="form-group">
                                <label for="tarif-description">Description</label>
                                <textarea id="tarif-description" rows="3"></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="tarif-prix">Prix</label>
                                    <input type="number" id="tarif-prix" min="0" step="0.01" required>
                                </div>
                                <div class="form-group">
                                    <label for="tarif-devise">Devise</label>
                                    <select id="tarif-devise">
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tarif-duree">Durée estimée</label>
                                <input type="text" id="tarif-duree" placeholder="ex: 2-3 semaines">
                            </div>
                            <div class="form-group">
                                <label for="tarif-categorie">Catégorie</label>
                                <input type="text" id="tarif-categorie" placeholder="ex: web, design, branding">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="adminTarifs.closeModal()">Annuler</button>
                        <button class="btn btn-primary" onclick="adminTarifs.saveTarif()">Sauvegarder</button>
                    </div>
                </div>
            </div>
            
            <!-- Modal d'import -->
            <div id="import-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Importer la Configuration</h3>
                        <span class="close" onclick="adminTarifs.closeImportModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="import-json">Configuration JSON</label>
                            <textarea id="import-json" rows="10" placeholder="Collez votre configuration JSON ici..."></textarea>
                        </div>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Attention : L'import remplacera complètement la configuration actuelle !
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="adminTarifs.closeImportModal()">Annuler</button>
                        <button class="btn btn-primary" onclick="adminTarifs.confirmImport()">Importer</button>
                    </div>
                </div>
            </div>
        `;
        
        this.renderTarifsLists();
    }
    
    /**
     * Rendu des listes de tarifs
     */
    renderTarifsLists() {
        this.renderServicesList();
        this.renderForfaitsList();
        this.renderOptionsList();
    }
    
    /**
     * Rendu de la liste des services
     */
    renderServicesList() {
        const container = document.getElementById('services-list');
        if (!container) return;
        
        const services = this.tarifsConfig.getAllTarifs().services;
        let html = '';
        
        Object.entries(services).forEach(([id, service]) => {
            html += `
                <div class="tarif-item" data-id="${id}" data-type="services">
                    <div class="tarif-info">
                        <h5>${service.nom}</h5>
                        <p>${service.description}</p>
                        <div class="tarif-details">
                            <span class="price">${service.prix} ${service.devise}</span>
                            <span class="duration">${service.duree}</span>
                            <span class="category">${service.categorie}</span>
                        </div>
                    </div>
                    <div class="tarif-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminTarifs.editTarif('services', '${id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminTarifs.deleteTarif('services', '${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="no-tarifs">Aucun service configuré</p>';
    }
    
    /**
     * Rendu de la liste des forfaits
     */
    renderForfaitsList() {
        const container = document.getElementById('forfaits-list');
        if (!container) return;
        
        const forfaits = this.tarifsConfig.getAllTarifs().forfaits;
        let html = '';
        
        Object.entries(forfaits).forEach(([id, forfait]) => {
            const prixCalcule = this.tarifsConfig.calculateForfaitPrix(id);
            html += `
                <div class="tarif-item" data-id="${id}" data-type="forfaits">
                    <div class="tarif-info">
                        <h5>${forfait.nom}</h5>
                        <p>${forfait.description}</p>
                        <div class="tarif-details">
                            <span class="price">${forfait.prix} ${forfait.devise}</span>
                            <span class="reduction">-${forfait.reduction}%</span>
                            <span class="calculated-price">Prix calculé: ${prixCalcule.toFixed(2)} ${forfait.devise}</span>
                        </div>
                        <div class="forfait-services">
                            <small>Services inclus: ${forfait.services.join(', ')}</small>
                        </div>
                    </div>
                    <div class="tarif-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminTarifs.editTarif('forfaits', '${id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminTarifs.deleteTarif('forfaits', '${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="no-tarifs">Aucun forfait configuré</p>';
    }
    
    /**
     * Rendu de la liste des options
     */
    renderOptionsList() {
        const container = document.getElementById('options-list');
        if (!container) return;
        
        const options = this.tarifsConfig.getAllTarifs().options;
        let html = '';
        
        Object.entries(options).forEach(([id, option]) => {
            html += `
                <div class="tarif-item" data-id="${id}" data-type="options">
                    <div class="tarif-info">
                        <h5>${option.nom}</h5>
                        <p>${option.description}</p>
                        <div class="tarif-details">
                            <span class="price">${option.prix} ${option.devise}</span>
                        </div>
                    </div>
                    <div class="tarif-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminTarifs.editTarif('options', '${id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminTarifs.deleteTarif('options', '${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="no-tarifs">Aucune option configurée</p>';
    }
    
    /**
     * Éditer un tarif
     */
    editTarif(type, id) {
        const tarif = this.tarifsConfig.getTarif(type, id);
        if (!tarif) return;
        
        this.currentEditing = { type, id };
        
        // Remplir le formulaire
        document.getElementById('tarif-nom').value = tarif.nom || '';
        document.getElementById('tarif-description').value = tarif.description || '';
        document.getElementById('tarif-prix').value = tarif.prix || '';
        document.getElementById('tarif-devise').value = tarif.devise || 'EUR';
        document.getElementById('tarif-duree').value = tarif.duree || '';
        document.getElementById('tarif-categorie').value = tarif.categorie || '';
        
        // Ajuster le formulaire selon le type
        this.adjustFormForType(type);
        
        // Afficher le modal
        document.getElementById('tarif-edit-modal').style.display = 'block';
        document.getElementById('modal-title').textContent = `Éditer ${tarif.nom}`;
    }
    
    /**
     * Ajuster le formulaire selon le type
     */
    adjustFormForType(type) {
        const dureeField = document.getElementById('tarif-duree').parentNode;
        const categorieField = document.getElementById('tarif-categorie').parentNode;
        
        if (type === 'options') {
            dureeField.style.display = 'none';
            categorieField.style.display = 'none';
        } else {
            dureeField.style.display = 'block';
            categorieField.style.display = 'block';
        }
    }
    
    /**
     * Sauvegarder un tarif
     */
    saveTarif() {
        if (!this.currentEditing) return;
        
        const formData = {
            nom: document.getElementById('tarif-nom').value,
            description: document.getElementById('tarif-description').value,
            prix: parseFloat(document.getElementById('tarif-prix').value),
            devise: document.getElementById('tarif-devise').value,
            duree: document.getElementById('tarif-duree').value,
            categorie: document.getElementById('tarif-categorie').value
        };
        
        // Validation
        if (!formData.nom || !formData.prix) {
            alert('Le nom et le prix sont obligatoires');
            return;
        }
        
        // Sauvegarder
        const success = this.tarifsConfig.updateTarif(
            this.currentEditing.type, 
            this.currentEditing.id, 
            formData
        );
        
        if (success) {
            this.closeModal();
            this.renderTarifsLists();
            this.showNotification('Tarif sauvegardé avec succès', 'success');
            
            // Notifier tous les utilisateurs
            this.notifyAllUsers();
        } else {
            alert('Erreur lors de la sauvegarde');
        }
    }
    
    /**
     * Supprimer un tarif
     */
    deleteTarif(type, id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) return;
        
        const success = this.tarifsConfig.removeTarif(type, id);
        
        if (success) {
            this.renderTarifsLists();
            this.showNotification('Tarif supprimé avec succès', 'success');
            
            // Notifier tous les utilisateurs
            this.notifyAllUsers();
        } else {
            alert('Erreur lors de la suppression');
        }
    }
    
    /**
     * Ajouter un nouveau service
     */
    addNewService() {
        this.currentEditing = { type: 'services', id: 'new_' + Date.now() };
        
        // Vider le formulaire
        document.getElementById('tarif-edit-form').reset();
        
        // Afficher le modal
        document.getElementById('tarif-edit-modal').style.display = 'block';
        document.getElementById('modal-title').textContent = 'Nouveau Service';
    }
    
    /**
     * Fermer le modal d'édition
     */
    closeModal() {
        document.getElementById('tarif-edit-modal').style.display = 'none';
        this.currentEditing = null;
    }
    
    /**
     * Exporter la configuration
     */
    exportConfig() {
        const config = this.tarifsConfig.exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tarifs-config.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Configuration exportée', 'info');
    }
    
    /**
     * Importer la configuration
     */
    importConfig() {
        document.getElementById('import-modal').style.display = 'block';
    }
    
    /**
     * Confirmer l'import
     */
    confirmImport() {
        const jsonData = document.getElementById('import-json').value;
        
        if (!jsonData.trim()) {
            alert('Veuillez entrer une configuration JSON valide');
            return;
        }
        
        const success = this.tarifsConfig.importConfig(jsonData);
        
        if (success) {
            this.closeImportModal();
            this.renderTarifsLists();
            this.showNotification('Configuration importée avec succès', 'success');
            
            // Notifier tous les utilisateurs
            this.notifyAllUsers();
        } else {
            alert('Erreur lors de l\'import. Vérifiez le format JSON.');
        }
    }
    
    /**
     * Fermer le modal d'import
     */
    closeImportModal() {
        document.getElementById('import-modal').style.display = 'none';
        document.getElementById('import-json').value = '';
    }
    
    /**
     * Notifier tous les utilisateurs
     */
    notifyAllUsers() {
        // Envoyer une notification Discord
        if (window.notificationsGrouped) {
            window.notificationsGrouped.addNotification('tarifs_updated', {
                message: 'Les tarifs ont été mis à jour par l\'administrateur',
                timestamp: new Date().toISOString(),
                admin: 'Admin Panel'
            }, 'high');
        }
        
        // Notification locale
        this.showNotification('Tous les utilisateurs ont été notifiés des changements', 'info');
    }
    
    /**
     * Afficher une notification
     */
    showNotification(message, type = 'info') {
        // Créer une notification toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Afficher
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Masquer après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Obtenir l'icône pour le type de notification
     */
    getIconForType(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    /**
     * Configuration des événements
     */
    setupEventListeners() {
        // Fermer les modals en cliquant à l'extérieur
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeImportModal();
            }
        });
    }
}

// Instance globale
window.adminTarifs = null;
