// Performance Bridge Go pour Mayu & Jack Studio
// Optimisations ultra-rapides et communication avec les autres langages

package main

import (
	"bytes"
	"crypto/md5"
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// Structures de données
type PerformanceConfig struct {
	MaxWorkers     int  `json:"max_workers"`
	CacheSize      int  `json:"cache_size"`
	CompressionLvl int  `json:"compression_level"`
	EnableMetrics  bool `json:"enable_metrics"`
	ServerPort     int  `json:"server_port"`
	WSEnabled      bool `json:"websocket_enabled"`
}

type ColorPalette struct {
	Primary       ColorRGBA   `json:"primary"`
	Secondary     ColorRGBA   `json:"secondary"`
	Accent        ColorRGBA   `json:"accent"`
	Complementary ColorRGBA   `json:"complementary"`
	Analogous     []ColorRGBA `json:"analogous"`
	Triadic       []ColorRGBA `json:"triadic"`
	Gradient      []ColorRGBA `json:"gradient"`
}

type ColorRGBA struct {
	R, G, B, A float64 `json:"r,g,b,a"`
}

type ProcessingResult struct {
	ID              string                 `json:"id"`
	Success         bool                   `json:"success"`
	ProcessingTime  time.Duration          `json:"processing_time"`
	InputSize       int64                  `json:"input_size"`
	OutputSize      int64                  `json:"output_size"`
	CompressionRate float64                `json:"compression_rate"`
	Metadata        map[string]interface{} `json:"metadata"`
	Error           string                 `json:"error,omitempty"`
}

type PerformanceMetrics struct {
	TotalRequests     int64         `json:"total_requests"`
	SuccessfulOps     int64         `json:"successful_ops"`
	FailedOps         int64         `json:"failed_ops"`
	AvgProcessingTime time.Duration `json:"avg_processing_time"`
	MemoryUsage       uint64        `json:"memory_usage"`
	CPUUsage          float64       `json:"cpu_usage"`
	CacheHitRate      float64       `json:"cache_hit_rate"`
	Uptime            time.Duration `json:"uptime"`
}

// Variables globales
var (
	config     PerformanceConfig
	metrics    PerformanceMetrics
	cache      = make(map[string][]byte)
	cacheMutex sync.RWMutex
	startTime  = time.Now()
	upgrader   = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
)

// Moteur de traitement d'images ultra-rapide
type FastImageProcessor struct {
	workers chan struct{}
	cache   map[string][]byte
	mutex   sync.RWMutex
}

func NewFastImageProcessor(maxWorkers int) *FastImageProcessor {
	return &FastImageProcessor{
		workers: make(chan struct{}, maxWorkers),
		cache:   make(map[string][]byte),
	}
}

func (fip *FastImageProcessor) ProcessImage(inputPath string, options map[string]interface{}) (*ProcessingResult, error) {
	start := time.Now()

	// Acquisition du worker
	fip.workers <- struct{}{}
	defer func() { <-fip.workers }()

	// Générer ID unique
	id := generateID(inputPath + fmt.Sprintf("%v", options))

	result := &ProcessingResult{
		ID:       id,
		Metadata: make(map[string]interface{}),
	}

	// Vérifier le cache
	cacheKey := fmt.Sprintf("img_%x", md5.Sum([]byte(inputPath)))
	if cached := fip.getFromCache(cacheKey); cached != nil {
		result.Success = true
		result.ProcessingTime = time.Since(start)
		result.OutputSize = int64(len(cached))
		result.Metadata["cache_hit"] = true
		return result, nil
	}

	// Charger l'image
	file, err := os.Open(inputPath)
	if err != nil {
		result.Error = fmt.Sprintf("erreur d'ouverture du fichier: %v", err)
		return result, err
	}
	defer file.Close()

	// Statistiques du fichier d'entrée
	stat, err := file.Stat()
	if err != nil {
		result.Error = fmt.Sprintf("erreur de lecture des statistiques: %v", err)
		return result, err
	}
	result.InputSize = stat.Size()

	// Décoder l'image selon le format
	var img image.Image
	ext := strings.ToLower(filepath.Ext(inputPath))

	switch ext {
	case ".jpg", ".jpeg":
		img, err = jpeg.Decode(file)
	case ".png":
		img, err = png.Decode(file)
	default:
		err = fmt.Errorf("format non supporté: %s", ext)
	}

	if err != nil {
		result.Error = err.Error()
		return result, err
	}

	// Traitement de l'image
	processedImg := fip.optimizeImage(img, options)

	// Compression optimisée
	var buf bytes.Buffer
	quality, _ := options["quality"].(float64)
	if quality == 0 {
		quality = 85
	}

	err = jpeg.Encode(&buf, processedImg, &jpeg.Options{Quality: int(quality)})
	if err != nil {
		result.Error = err.Error()
		return result, err
	}

	// Mettre en cache
	compressed := buf.Bytes()
	fip.putInCache(cacheKey, compressed)

	// Calculer les métriques
	result.Success = true
	result.ProcessingTime = time.Since(start)
	result.OutputSize = int64(len(compressed))
	result.CompressionRate = float64(result.InputSize-result.OutputSize) / float64(result.InputSize) * 100
	result.Metadata["original_dimensions"] = fmt.Sprintf("%dx%d", img.Bounds().Dx(), img.Bounds().Dy())
	result.Metadata["processed_dimensions"] = fmt.Sprintf("%dx%d", processedImg.Bounds().Dx(), processedImg.Bounds().Dy())

	return result, nil
}

func (fip *FastImageProcessor) optimizeImage(img image.Image, options map[string]interface{}) image.Image {
	bounds := img.Bounds()

	// Redimensionnement si nécessaire
	maxWidth, hasMaxWidth := options["max_width"].(float64)
	maxHeight, hasMaxHeight := options["max_height"].(float64)

	if hasMaxWidth || hasMaxHeight {
		newWidth := bounds.Dx()
		newHeight := bounds.Dy()

		if hasMaxWidth && float64(newWidth) > maxWidth {
			ratio := maxWidth / float64(newWidth)
			newWidth = int(maxWidth)
			newHeight = int(float64(newHeight) * ratio)
		}

		if hasMaxHeight && float64(newHeight) > maxHeight {
			ratio := maxHeight / float64(newHeight)
			newHeight = int(maxHeight)
			newWidth = int(float64(newWidth) * ratio)
		}

		if newWidth != bounds.Dx() || newHeight != bounds.Dy() {
			return fip.resizeImage(img, newWidth, newHeight)
		}
	}

	return img
}

func (fip *FastImageProcessor) resizeImage(src image.Image, width, height int) image.Image {
	dst := image.NewRGBA(image.Rect(0, 0, width, height))

	// Redimensionnement optimisé avec protection des limites
	srcBounds := src.Bounds()
	dx := float64(srcBounds.Dx()) / float64(width)
	dy := float64(srcBounds.Dy()) / float64(height)

	// Optimisation : pré-calculer les indices source
	srcIndices := make([]int, width+height)
	for x := 0; x < width; x++ {
		srcIndices[x] = int(float64(x)*dx) + srcBounds.Min.X
	}
	for y := 0; y < height; y++ {
		srcIndices[width+y] = int(float64(y)*dy) + srcBounds.Min.Y
	}

	for y := 0; y < height; y++ {
		srcY := srcIndices[width+y]
		for x := 0; x < width; x++ {
			srcX := srcIndices[x]
			// Protection contre les indices hors limites
			if srcX >= srcBounds.Min.X && srcX < srcBounds.Max.X &&
				srcY >= srcBounds.Min.Y && srcY < srcBounds.Max.Y {
				dst.Set(x, y, src.At(srcX, srcY))
			}
		}
	}

	return dst
}

func (fip *FastImageProcessor) getFromCache(key string) []byte {
	fip.mutex.RLock()
	defer fip.mutex.RUnlock()
	return fip.cache[key]
}

func (fip *FastImageProcessor) putInCache(key string, data []byte) {
	fip.mutex.Lock()
	defer fip.mutex.Unlock()
	fip.cache[key] = data
}

// Générateur de palettes de couleurs avancé
type ColorAnalyzer struct {
	samples int
}

func NewColorAnalyzer(samples int) *ColorAnalyzer {
	return &ColorAnalyzer{samples: samples}
}

func (ca *ColorAnalyzer) ExtractPalette(img image.Image) (*ColorPalette, error) {
	// Échantillonnage intelligent de l'image
	colors := ca.sampleColors(img)

	// Clustering des couleurs dominantes
	dominantColors := ca.clusterColors(colors, 5)

	if len(dominantColors) == 0 {
		return nil, fmt.Errorf("aucune couleur extraite")
	}

	primary := dominantColors[0]

	palette := &ColorPalette{
		Primary:       primary,
		Secondary:     ca.generateSecondary(primary),
		Accent:        ca.generateAccent(primary),
		Complementary: ca.generateComplementary(primary),
		Analogous:     ca.generateAnalogous(primary),
		Triadic:       ca.generateTriadic(primary),
		Gradient:      ca.generateGradient(primary, 10),
	}

	return palette, nil
}

func (ca *ColorAnalyzer) sampleColors(img image.Image) []ColorRGBA {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Échantillonnage adaptatif
	step := int(math.Sqrt(float64(width*height) / float64(ca.samples)))
	if step < 1 {
		step = 1
	}

	var colors []ColorRGBA

	for y := bounds.Min.Y; y < bounds.Max.Y; y += step {
		for x := bounds.Min.X; x < bounds.Max.X; x += step {
			r, g, b, a := img.At(x, y).RGBA()
			colors = append(colors, ColorRGBA{
				R: float64(r) / 65535.0,
				G: float64(g) / 65535.0,
				B: float64(b) / 65535.0,
				A: float64(a) / 65535.0,
			})
		}
	}

	return colors
}

func (ca *ColorAnalyzer) clusterColors(colors []ColorRGBA, numClusters int) []ColorRGBA {
	if len(colors) == 0 {
		return nil
	}

	// Protection contre le nombre de clusters trop élevé
	if numClusters > len(colors) {
		numClusters = len(colors)
	}
	if numClusters <= 0 {
		return nil
	}

	// K-means clustering simplifié
	clusters := make([]ColorRGBA, numClusters)

	// Initialisation avec des couleurs équidistantes
	for i := 0; i < numClusters; i++ {
		idx := i * len(colors) / numClusters
		if idx < len(colors) {
			clusters[i] = colors[idx]
		}
	}

	// Itérations de clustering
	for iter := 0; iter < 10; iter++ {
		assignments := make([]int, len(colors))
		clusterSums := make([]ColorRGBA, numClusters)
		clusterCounts := make([]int, numClusters)

		// Assigner chaque couleur au cluster le plus proche
		for i, color := range colors {
			minDist := math.Inf(1)
			bestCluster := 0

			for j, cluster := range clusters {
				dist := ca.colorDistance(color, cluster)
				if dist < minDist {
					minDist = dist
					bestCluster = j
				}
			}

			assignments[i] = bestCluster
			clusterSums[bestCluster].R += color.R
			clusterSums[bestCluster].G += color.G
			clusterSums[bestCluster].B += color.B
			clusterSums[bestCluster].A += color.A
			clusterCounts[bestCluster]++
		}

		// Recalculer les centres des clusters
		for j := 0; j < numClusters; j++ {
			if clusterCounts[j] > 0 {
				clusters[j].R = clusterSums[j].R / float64(clusterCounts[j])
				clusters[j].G = clusterSums[j].G / float64(clusterCounts[j])
				clusters[j].B = clusterSums[j].B / float64(clusterCounts[j])
				clusters[j].A = clusterSums[j].A / float64(clusterCounts[j])
			}
		}
	}

	// Trier par fréquence (approximative via distance au centre)
	sort.Slice(clusters, func(i, j int) bool {
		return ca.getColorWeight(clusters[i]) > ca.getColorWeight(clusters[j])
	})

	return clusters
}

func (ca *ColorAnalyzer) colorDistance(c1, c2 ColorRGBA) float64 {
	dr := c1.R - c2.R
	dg := c1.G - c2.G
	db := c1.B - c2.B
	return math.Sqrt(dr*dr + dg*dg + db*db)
}

func (ca *ColorAnalyzer) getColorWeight(c ColorRGBA) float64 {
	// Poids basé sur la saturation et la luminosité
	luminance := 0.299*c.R + 0.587*c.G + 0.114*c.B
	saturation := ca.getSaturation(c)
	return saturation * (1.0 - math.Abs(luminance-0.5))
}

func (ca *ColorAnalyzer) getSaturation(c ColorRGBA) float64 {
	max := math.Max(math.Max(c.R, c.G), c.B)
	min := math.Min(math.Min(c.R, c.G), c.B)
	if max == 0 {
		return 0
	}
	return (max - min) / max
}

func (ca *ColorAnalyzer) generateComplementary(c ColorRGBA) ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	h = math.Mod(h+180, 360)
	return ca.hsvToRGB(h, s, v)
}

func (ca *ColorAnalyzer) generateAnalogous(c ColorRGBA) []ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	return []ColorRGBA{
		ca.hsvToRGB(math.Mod(h+30, 360), s, v),
		ca.hsvToRGB(math.Mod(h-30+360, 360), s, v),
	}
}

func (ca *ColorAnalyzer) generateTriadic(c ColorRGBA) []ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	return []ColorRGBA{
		ca.hsvToRGB(math.Mod(h+120, 360), s, v),
		ca.hsvToRGB(math.Mod(h+240, 360), s, v),
	}
}

func (ca *ColorAnalyzer) generateSecondary(c ColorRGBA) ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	// Couleur secondaire plus sombre
	return ca.hsvToRGB(h, s*0.8, v*0.7)
}

func (ca *ColorAnalyzer) generateAccent(c ColorRGBA) ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	// Couleur d'accent plus vive
	return ca.hsvToRGB(h, math.Min(s*1.2, 1.0), math.Min(v*1.1, 1.0))
}

func (ca *ColorAnalyzer) generateGradient(c ColorRGBA, steps int) []ColorRGBA {
	h, s, v := ca.rgbToHSV(c)
	gradient := make([]ColorRGBA, steps)

	for i := 0; i < steps; i++ {
		factor := float64(i) / float64(steps-1)
		newV := v * (0.3 + factor*0.7) // De 30% à 100% de la luminosité
		gradient[i] = ca.hsvToRGB(h, s, newV)
	}

	return gradient
}

func (ca *ColorAnalyzer) rgbToHSV(c ColorRGBA) (h, s, v float64) {
	max := math.Max(math.Max(c.R, c.G), c.B)
	min := math.Min(math.Min(c.R, c.G), c.B)
	delta := max - min

	v = max

	if max == 0 {
		s = 0
	} else {
		s = delta / max
	}

	if delta == 0 {
		h = 0
	} else {
		switch max {
		case c.R:
			h = 60 * math.Mod((c.G-c.B)/delta, 6)
		case c.G:
			h = 60 * ((c.B-c.R)/delta + 2)
		case c.B:
			h = 60 * ((c.R-c.G)/delta + 4)
		}
	}

	if h < 0 {
		h += 360
	}

	return
}

func (ca *ColorAnalyzer) hsvToRGB(h, s, v float64) ColorRGBA {
	h = math.Mod(h, 360)
	c := v * s
	x := c * (1 - math.Abs(math.Mod(h/60, 2)-1))
	m := v - c

	var r, g, b float64

	switch int(h / 60) {
	case 0:
		r, g, b = c, x, 0
	case 1:
		r, g, b = x, c, 0
	case 2:
		r, g, b = 0, c, x
	case 3:
		r, g, b = 0, x, c
	case 4:
		r, g, b = x, 0, c
	case 5:
		r, g, b = c, 0, x
	}

	return ColorRGBA{
		R: r + m,
		G: g + m,
		B: b + m,
		A: 1.0,
	}
}

// Serveur HTTP avec WebSocket pour communication temps réel
func setupServer() {
	r := mux.NewRouter()

	// API REST
	r.HandleFunc("/api/process-image", handleImageProcessing).Methods("POST")
	r.HandleFunc("/api/extract-colors", handleColorExtraction).Methods("POST")
	r.HandleFunc("/api/metrics", handleMetrics).Methods("GET")
	r.HandleFunc("/api/status", handleStatus).Methods("GET")

	// WebSocket pour temps réel
	r.HandleFunc("/ws", handleWebSocket)

	// Servir les fichiers statiques
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))

	fmt.Printf("🚀 Serveur Go Performance Bridge démarré sur :%d\n", config.ServerPort)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(config.ServerPort), r))
}

func handleImageProcessing(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	metrics.TotalRequests++

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32 MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Sauvegarder temporairement
	tempFile := fmt.Sprintf("/tmp/upload_%d.jpg", time.Now().UnixNano())
	out, err := os.Create(tempFile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(tempFile)
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Options de traitement
	options := map[string]interface{}{
		"quality":    parseFloat(r.FormValue("quality"), 85),
		"max_width":  parseFloat(r.FormValue("max_width"), 0),
		"max_height": parseFloat(r.FormValue("max_height"), 0),
	}

	// Traiter l'image
	processor := NewFastImageProcessor(config.MaxWorkers)
	result, err := processor.ProcessImage(tempFile, options)

	if err != nil {
		metrics.FailedOps++
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	metrics.SuccessfulOps++
	updateAverageTime(time.Since(start))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleColorExtraction(w http.ResponseWriter, r *http.Request) {
	// Similaire à handleImageProcessing mais pour l'extraction de couleurs
	// Implementation complète...

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "color extraction endpoint"})
}

func handleMetrics(w http.ResponseWriter, r *http.Request) {
	// Mettre à jour les métriques système
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	metrics.MemoryUsage = m.Alloc
	metrics.Uptime = time.Since(startTime)

	if metrics.TotalRequests > 0 {
		metrics.CacheHitRate = float64(metrics.SuccessfulOps) / float64(metrics.TotalRequests) * 100
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	status := map[string]interface{}{
		"status":     "running",
		"version":    "1.0.0",
		"goroutines": runtime.NumGoroutine(),
		"workers":    config.MaxWorkers,
		"uptime":     time.Since(startTime).String(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade failed: ", err)
		return
	}
	defer conn.Close()

	// Boucle de communication WebSocket
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}

		// Echo pour test
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println("write:", err)
			break
		}
	}
}

// Fonctions utilitaires
func generateID(input string) string {
	return fmt.Sprintf("%x", md5.Sum([]byte(input+strconv.FormatInt(time.Now().UnixNano(), 10))))
}

func parseFloat(s string, defaultVal float64) float64 {
	if s == "" {
		return defaultVal
	}
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return defaultVal
	}
	return f
}

func updateAverageTime(duration time.Duration) {
	// Moyenne mobile simple
	if metrics.AvgProcessingTime == 0 {
		metrics.AvgProcessingTime = duration
	} else {
		metrics.AvgProcessingTime = (metrics.AvgProcessingTime + duration) / 2
	}
}

func loadConfig() {
	config = PerformanceConfig{
		MaxWorkers:     runtime.NumCPU() * 2,
		CacheSize:      1024 * 1024 * 100, // 100MB
		CompressionLvl: 6,
		EnableMetrics:  true,
		ServerPort:     8080,
		WSEnabled:      true,
	}

	// Charger depuis fichier si disponible
	if data, err := os.ReadFile("go_config.json"); err == nil {
		json.Unmarshal(data, &config)
	}
}

// Point d'entrée principal
func main() {
	fmt.Println("🎨 Mayu & Jack Studio - Performance Bridge Go")
	fmt.Println("==============================================")

	loadConfig()

	fmt.Printf("Workers: %d\n", config.MaxWorkers)
	fmt.Printf("Cache: %d MB\n", config.CacheSize/(1024*1024))
	fmt.Printf("Port: %d\n", config.ServerPort)

	// Démarrer le serveur HTTP
	setupServer()
}
