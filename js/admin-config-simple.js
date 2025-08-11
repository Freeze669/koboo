// Configuration simplifiée pour test
const ADMIN_CONFIG = {
    security: {
        adminCode: "DF505",
        maxLoginAttempts: 3,
        lockoutDuration: 30000
    }
};

const AdminUtils = {
    validateAdminCode: function(code) {
        return code === ADMIN_CONFIG.security.adminCode;
    }
};

// Rendre disponible globalement
window.ADMIN_CONFIG = ADMIN_CONFIG;
window.AdminUtils = AdminUtils;

console.log('✅ Configuration simple chargée');
console.log('Code admin:', ADMIN_CONFIG.security.adminCode);
