# 🚀 Performance Bridge Go - Mayu & Jack Studio

## Description
Bridge de performance ultra-rapide pour le traitement d'images et l'analyse de couleurs, optimisé pour les applications web haute performance.

## 🎯 Fonctionnalités

### Traitement d'Images
- **Optimisation automatique** avec compression JPEG/PNG
- **Redimensionnement intelligent** avec protection des limites
- **Cache en mémoire** pour les performances maximales
- **Traitement multi-workers** pour la parallélisation

### Analyse de Couleurs
- **Extraction de palettes** avec clustering K-means
- **Génération de couleurs** complémentaires, analogues, triadiques
- **Conversion RGB ↔ HSV** pour l'analyse avancée
- **Gradients automatiques** avec variations de luminosité

### Serveur Web
- **API REST** pour le traitement d'images
- **WebSocket** pour la communication temps réel
- **Métriques de performance** en temps réel
- **Gestion d'erreurs robuste**

## 🛠️ Installation

### Prérequis
- Go 1.19+ installé
- Dépendances automatiquement installées via `go mod`

### Démarrage
```bash
# Initialiser le module Go
go mod init performance-bridge

# Installer les dépendances
go get github.com/gorilla/mux github.com/gorilla/websocket

# Compiler
go build -o performance_bridge.exe performance_bridge.go

# Exécuter
./performance_bridge.exe
```

## 📊 Configuration

Le fichier `go_config.json` permet de personnaliser :
- **max_workers**: Nombre de workers parallèles (défaut: CPU cores × 2)
- **cache_size**: Taille du cache en mémoire (défaut: 200MB)
- **server_port**: Port du serveur HTTP (défaut: 8080)
- **compression_level**: Niveau de compression JPEG (défaut: 6)

## 🔌 API Endpoints

### POST /api/process-image
Traitement d'image avec options :
```json
{
  "quality": 85,
  "max_width": 1920,
  "max_height": 1080
}
```

### GET /api/metrics
Métriques de performance en temps réel

### GET /api/status
Statut du serveur et informations système

### WebSocket /ws
Communication temps réel pour les mises à jour

## 🚨 Corrections Apportées

### Erreurs de Script Corrigées
1. **Dépendances manquantes** : Ajout de `go.mod` et installation des packages
2. **Imports inutilisés** : Suppression de `compress/gzip`, `image/color`, `image/draw`
3. **Protection des limites** : Vérification des indices dans le redimensionnement
4. **Gestion d'erreurs** : Amélioration des messages d'erreur et validation
5. **Optimisations** : Pré-calcul des indices pour le redimensionnement
6. **Clustering sécurisé** : Protection contre les nombres de clusters invalides

### Améliorations de Performance
- Redimensionnement d'image optimisé avec pré-calcul des indices
- Protection contre les accès mémoire hors limites
- Gestion robuste des erreurs de fichiers
- Configuration centralisée via JSON

## 📈 Utilisation

### Traitement d'Image
```bash
curl -X POST -F "image=@photo.jpg" -F "quality=90" -F "max_width=1920" \
     http://localhost:8080/api/process-image
```

### Vérification des Métriques
```bash
curl http://localhost:8080/api/metrics
```

## 🔧 Développement

### Structure du Code
- `FastImageProcessor` : Traitement d'images optimisé
- `ColorAnalyzer` : Analyse et génération de couleurs
- `PerformanceMetrics` : Suivi des performances
- Handlers HTTP : API REST et WebSocket

### Tests
```bash
# Test de compilation
go build -o performance_bridge.exe performance_bridge.go

# Test des fonctions de base
go run test_bridge.go
```

## 📝 Logs et Debug

Le serveur affiche :
- 🚀 Messages de démarrage
- 📊 Métriques de performance
- ⚠️ Avertissements et erreurs
- 🔍 Informations de debug

## 🎨 Exemples d'Utilisation

### Interface Web
Le serveur peut servir des fichiers statiques depuis `./static/`

### Intégration
- **Frontend** : Utiliser l'API REST pour le traitement
- **Backend** : Intégrer via HTTP client
- **Temps réel** : WebSocket pour les mises à jour live

---

**Version** : 1.0.0  
**Auteur** : Mayu & Jack Studio  
**Performance** : Optimisé pour la production  
**Support** : Go 1.19+, Multi-plateforme
