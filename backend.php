<?php
/**
 * Backend PHP pour Mayu & Jack Studio
 * Gestion des formulaires, API et fonctionnalités serveur
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration de la base de données
class Database {
    private $host = 'localhost';
    private $dbname = 'mayu_jack_studio';
    private $username = 'root';
    private $password = '';
    private $pdo;

    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            // Utiliser SQLite comme fallback
            $this->pdo = new PDO('sqlite:mayu_jack_studio.db');
            $this->initializeTables();
        }
    }

    public function getPDO() {
        return $this->pdo;
    }

    private function initializeTables() {
        $sql = "
        CREATE TABLE IF NOT EXISTS contact_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            project_type TEXT NOT NULL,
            details TEXT NOT NULL,
            deadline DATE NOT NULL,
            budget TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS portfolio_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            image_url TEXT,
            tags TEXT,
            is_featured BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            client_company TEXT,
            rating INTEGER DEFAULT 5,
            message TEXT NOT NULL,
            is_approved BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        ";
        
        $this->pdo->exec($sql);
    }
}

// Gestionnaire de formulaires de contact
class ContactFormHandler {
    private $db;

    public function __construct(Database $database) {
        $this->db = $database->getPDO();
    }

    public function handleContactForm($data) {
        try {
            // Validation des données
            $errors = $this->validateContactData($data);
            if (!empty($errors)) {
                return [
                    'success' => false,
                    'errors' => $errors
                ];
            }

            // Sanitisation des données
            $cleanData = $this->sanitizeData($data);

            // Insertion en base de données
            $sql = "INSERT INTO contact_requests (name, email, project_type, details, deadline, budget) 
                    VALUES (:name, :email, :project_type, :details, :deadline, :budget)";
            
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([
                ':name' => $cleanData['name'],
                ':email' => $cleanData['email'],
                ':project_type' => $cleanData['projectType'],
                ':details' => $cleanData['details'],
                ':deadline' => $cleanData['deadline'],
                ':budget' => $cleanData['budget'] ?? null
            ]);

            if ($result) {
                $requestId = $this->db->lastInsertId();
                
                // Envoyer les notifications
                $this->sendNotifications($cleanData, $requestId);
                
                return [
                    'success' => true,
                    'message' => 'Votre demande a été envoyée avec succès!',
                    'request_id' => $requestId,
                    'tracking_info' => $this->generateTrackingInfo($requestId)
                ];
            }

        } catch (Exception $e) {
            error_log("Erreur formulaire de contact: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Une erreur est survenue. Veuillez réessayer.'
            ];
        }
    }

    private function validateContactData($data) {
        $errors = [];

        if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
            $errors['name'] = 'Le nom doit contenir au moins 2 caractères';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email invalide';
        }

        if (empty($data['projectType'])) {
            $errors['projectType'] = 'Veuillez sélectionner un type de projet';
        }

        if (empty($data['details']) || strlen(trim($data['details'])) < 10) {
            $errors['details'] = 'Veuillez décrire votre projet (minimum 10 caractères)';
        }

        if (empty($data['deadline'])) {
            $errors['deadline'] = 'Veuillez indiquer une deadline';
        } else {
            $deadline = DateTime::createFromFormat('Y-m-d', $data['deadline']);
            if (!$deadline || $deadline < new DateTime()) {
                $errors['deadline'] = 'La deadline doit être dans le futur';
            }
        }

        return $errors;
    }

    private function sanitizeData($data) {
        return [
            'name' => htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'),
            'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
            'projectType' => htmlspecialchars($data['projectType'], ENT_QUOTES, 'UTF-8'),
            'details' => htmlspecialchars(trim($data['details']), ENT_QUOTES, 'UTF-8'),
            'deadline' => $data['deadline'],
            'budget' => isset($data['budget']) ? htmlspecialchars($data['budget'], ENT_QUOTES, 'UTF-8') : null
        ];
    }

    private function sendNotifications($data, $requestId) {
        // Email aux créateurs
        $this->sendEmailToCreators($data, $requestId);
        
        // Email de confirmation au client
        $this->sendConfirmationEmail($data, $requestId);
        
        // Notification Discord (webhook)
        $this->sendDiscordNotification($data, $requestId);
    }

    private function sendEmailToCreators($data, $requestId) {
        $to = 'jackandmayu@gmail.com';
        $subject = '[Mayu & Jack Studio] Nouvelle demande de projet #' . $requestId;
        
        $message = "
        <html>
        <head>
            <title>Nouvelle demande de projet</title>
        </head>
        <body style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                <h2 style='color: #3b82f6; margin-bottom: 20px;'>🎨 Nouvelle demande de projet</h2>
                
                <div style='background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;'>
                    <h3 style='margin-top: 0; color: #1e293b;'>Informations client</h3>
                    <p><strong>Nom:</strong> {$data['name']}</p>
                    <p><strong>Email:</strong> {$data['email']}</p>
                    <p><strong>Type de projet:</strong> {$data['projectType']}</p>
                    <p><strong>Deadline:</strong> {$data['deadline']}</p>
                    " . ($data['budget'] ? "<p><strong>Budget:</strong> {$data['budget']}</p>" : "") . "
                </div>
                
                <div style='background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;'>
                    <h3 style='margin-top: 0; color: #92400e;'>Description du projet</h3>
                    <p style='line-height: 1.6;'>{$data['details']}</p>
                </div>
                
                <div style='text-align: center; margin-top: 30px;'>
                    <p style='color: #64748b;'>ID de la demande: #{$requestId}</p>
                </div>
            </div>
        </body>
        </html>
        ";

        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: noreply@mayujackstudio.com',
            'Reply-To: ' . $data['email']
        ];

        mail($to, $subject, $message, implode("\r\n", $headers));
    }

    private function sendConfirmationEmail($data, $requestId) {
        $to = $data['email'];
        $subject = '[Mayu & Jack Studio] Confirmation de votre demande #' . $requestId;
        
        $message = "
        <html>
        <head>
            <title>Confirmation de votre demande</title>
        </head>
        <body style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                <h2 style='color: #3b82f6; margin-bottom: 20px;'>✅ Demande reçue avec succès!</h2>
                
                <p>Bonjour <strong>{$data['name']}</strong>,</p>
                
                <p>Merci d'avoir choisi Mayu & Jack Studio pour votre projet <strong>{$data['projectType']}</strong>!</p>
                
                <div style='background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3 style='margin-top: 0; color: #1e40af;'>📋 Récapitulatif de votre demande</h3>
                    <p><strong>ID:</strong> #{$requestId}</p>
                    <p><strong>Type:</strong> {$data['projectType']}</p>
                    <p><strong>Deadline:</strong> {$data['deadline']}</p>
                </div>
                
                <div style='background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3 style='margin-top: 0; color: #065f46;'>🚀 Prochaines étapes</h3>
                    <ol style='color: #374151; line-height: 1.6;'>
                        <li>Nous étudions votre demande (sous 24h)</li>
                        <li>Contact via Discord ou email</li>
                        <li>Discussion détaillée du projet</li>
                        <li>Devis personnalisé</li>
                        <li>Début de la création!</li>
                    </ol>
                </div>
                
                <div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3 style='margin-top: 0; color: #374151;'>📞 Nous contacter</h3>
                    <p><strong>Discord:</strong> papy_jack / mamy_mayu</p>
                    <p><strong>Email:</strong> jackandmayu@gmail.com</p>
                    <p><strong>Instagram:</strong> @RideOrNine</p>
                </div>
                
                <p style='text-align: center; color: #64748b; font-style: italic; margin-top: 30px;'>
                    L'équipe Mayu & Jack Studio 🎨✨
                </p>
            </div>
        </body>
        </html>
        ";

        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: noreply@mayujackstudio.com'
        ];

        mail($to, $subject, $message, implode("\r\n", $headers));
    }

    private function sendDiscordNotification($data, $requestId) {
        $webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL'; // À configurer
        
        $embed = [
            'title' => '🎨 Nouvelle demande de projet',
            'description' => "**Client:** {$data['name']}\n**Email:** {$data['email']}\n**Type:** {$data['projectType']}",
            'color' => 3447003, // Bleu
            'fields' => [
                [
                    'name' => '📝 Description',
                    'value' => substr($data['details'], 0, 200) . (strlen($data['details']) > 200 ? '...' : ''),
                    'inline' => false
                ],
                [
                    'name' => '📅 Deadline',
                    'value' => $data['deadline'],
                    'inline' => true
                ],
                [
                    'name' => '💰 Budget',
                    'value' => $data['budget'] ?? 'Non spécifié',
                    'inline' => true
                ]
            ],
            'footer' => [
                'text' => "ID: #{$requestId} • " . date('d/m/Y H:i')
            ]
        ];

        $payload = [
            'embeds' => [$embed]
        ];

        // Envoyer via cURL si le webhook est configuré
        if ($webhookUrl !== 'YOUR_DISCORD_WEBHOOK_URL') {
            $ch = curl_init($webhookUrl);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_exec($ch);
            curl_close($ch);
        }
    }

    private function generateTrackingInfo($requestId) {
        return [
            'id' => $requestId,
            'status' => 'received',
            'estimated_response_time' => '24 heures',
            'next_step' => 'Contact par notre équipe',
            'created_at' => date('Y-m-d H:i:s')
        ];
    }
}

// Gestionnaire de portfolio
class PortfolioManager {
    private $db;

    public function __construct(Database $database) {
        $this->db = $database->getPDO();
    }

    public function getPortfolioItems($category = null, $featured = false) {
        $sql = "SELECT * FROM portfolio_items WHERE 1=1";
        $params = [];

        if ($category) {
            $sql .= " AND category = :category";
            $params[':category'] = $category;
        }

        if ($featured) {
            $sql .= " AND is_featured = 1";
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }

    public function addPortfolioItem($data) {
        $sql = "INSERT INTO portfolio_items (title, description, category, image_url, tags, is_featured) 
                VALUES (:title, :description, :category, :image_url, :tags, :is_featured)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':category' => $data['category'],
            ':image_url' => $data['image_url'],
            ':tags' => json_encode($data['tags'] ?? []),
            ':is_featured' => $data['is_featured'] ?? 0
        ]);
    }
}

// Gestionnaire d'analytics
class AnalyticsManager {
    private $db;

    public function __construct(Database $database) {
        $this->db = $database->getPDO();
    }

    public function getStats() {
        $stats = [];

        // Nombre total de demandes
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM contact_requests");
        $stats['total_requests'] = $stmt->fetch()['total'];

        // Demandes par mois
        $stmt = $this->db->query("
            SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count 
            FROM contact_requests 
            GROUP BY strftime('%Y-%m', created_at) 
            ORDER BY month DESC 
            LIMIT 12
        ");
        $stats['requests_by_month'] = $stmt->fetchAll();

        // Types de projets populaires
        $stmt = $this->db->query("
            SELECT project_type, COUNT(*) as count 
            FROM contact_requests 
            GROUP BY project_type 
            ORDER BY count DESC
        ");
        $stats['popular_project_types'] = $stmt->fetchAll();

        return $stats;
    }
}

// Router principal
class Router {
    private $db;
    private $contactHandler;
    private $portfolioManager;
    private $analyticsManager;

    public function __construct() {
        $this->db = new Database();
        $this->contactHandler = new ContactFormHandler($this->db);
        $this->portfolioManager = new PortfolioManager($this->db);
        $this->analyticsManager = new AnalyticsManager($this->db);
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $data = $method === 'POST' ? json_decode(file_get_contents('php://input'), true) : $_GET;

        switch ($path) {
            case '/api/contact':
                if ($method === 'POST') {
                    return $this->contactHandler->handleContactForm($data);
                }
                break;

            case '/api/portfolio':
                if ($method === 'GET') {
                    $category = $_GET['category'] ?? null;
                    $featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
                    return $this->portfolioManager->getPortfolioItems($category, $featured);
                }
                break;

            case '/api/stats':
                if ($method === 'GET') {
                    return $this->analyticsManager->getStats();
                }
                break;

            default:
                http_response_code(404);
                return ['error' => 'Endpoint non trouvé'];
        }

        http_response_code(405);
        return ['error' => 'Méthode non autorisée'];
    }
}

// Point d'entrée principal
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Gestion des requêtes preflight CORS
    http_response_code(200);
    exit();
}

try {
    $router = new Router();
    $response = $router->handleRequest();
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
