/*!
 * Utilitaires de Performance Rust pour Mayu & Jack Studio
 * Optimisations ultra-rapides et traitement concurrent des données
 */

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use std::thread;
use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use serde::{Deserialize, Serialize};
use tokio::sync::Semaphore;
use rayon::prelude::*;

/// Configuration pour les utilitaires de performance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceConfig {
    pub max_threads: usize,
    pub cache_size: usize,
    pub enable_metrics: bool,
    pub compression_level: u8,
    pub batch_size: usize,
}

impl Default for PerformanceConfig {
    fn default() -> Self {
        Self {
            max_threads: num_cpus::get(),
            cache_size: 1024 * 1024, // 1MB
            enable_metrics: true,
            compression_level: 6,
            batch_size: 100,
        }
    }
}

/// Métriques de performance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceMetrics {
    pub total_operations: AtomicUsize,
    pub successful_operations: AtomicUsize,
    pub failed_operations: AtomicUsize,
    pub total_processing_time: Duration,
    pub average_processing_time: Duration,
    pub memory_usage: usize,
    pub cache_hits: AtomicUsize,
    pub cache_misses: AtomicUsize,
}

impl Default for PerformanceMetrics {
    fn default() -> Self {
        Self {
            total_operations: AtomicUsize::new(0),
            successful_operations: AtomicUsize::new(0),
            failed_operations: AtomicUsize::new(0),
            total_processing_time: Duration::new(0, 0),
            average_processing_time: Duration::new(0, 0),
            memory_usage: 0,
            cache_hits: AtomicUsize::new(0),
            cache_misses: AtomicUsize::new(0),
        }
    }
}

/// Cache haute performance avec LRU
pub struct HighPerformanceCache<K, V> 
where 
    K: std::hash::Hash + Eq + Clone,
    V: Clone,
{
    cache: HashMap<K, V>,
    access_order: Vec<K>,
    max_size: usize,
    hits: AtomicUsize,
    misses: AtomicUsize,
}

impl<K, V> HighPerformanceCache<K, V>
where
    K: std::hash::Hash + Eq + Clone,
    V: Clone,
{
    pub fn new(max_size: usize) -> Self {
        Self {
            cache: HashMap::with_capacity(max_size),
            access_order: Vec::with_capacity(max_size),
            max_size,
            hits: AtomicUsize::new(0),
            misses: AtomicUsize::new(0),
        }
    }

    pub fn get(&mut self, key: &K) -> Option<V> {
        if let Some(value) = self.cache.get(key) {
            self.hits.fetch_add(1, Ordering::Relaxed);
            // Déplacer vers la fin (plus récemment utilisé)
            if let Some(pos) = self.access_order.iter().position(|x| x == key) {
                let key = self.access_order.remove(pos);
                self.access_order.push(key);
            }
            Some(value.clone())
        } else {
            self.misses.fetch_add(1, Ordering::Relaxed);
            None
        }
    }

    pub fn put(&mut self, key: K, value: V) {
        if self.cache.len() >= self.max_size {
            // Supprimer le moins récemment utilisé
            if let Some(lru_key) = self.access_order.first().cloned() {
                self.cache.remove(&lru_key);
                self.access_order.remove(0);
            }
        }

        self.cache.insert(key.clone(), value);
        self.access_order.push(key);
    }

    pub fn hit_rate(&self) -> f64 {
        let hits = self.hits.load(Ordering::Relaxed) as f64;
        let total = hits + self.misses.load(Ordering::Relaxed) as f64;
        if total > 0.0 { hits / total } else { 0.0 }
    }
}

/// Processeur de fichiers ultra-rapide
pub struct FileProcessor {
    config: PerformanceConfig,
    metrics: Arc<PerformanceMetrics>,
    cache: HighPerformanceCache<PathBuf, Vec<u8>>,
}

impl FileProcessor {
    pub fn new(config: PerformanceConfig) -> Self {
        Self {
            cache: HighPerformanceCache::new(config.cache_size),
            config,
            metrics: Arc::new(PerformanceMetrics::default()),
        }
    }

    /// Traite plusieurs fichiers en parallèle avec optimisations Rust
    pub async fn process_files_parallel(&mut self, files: Vec<PathBuf>) -> Result<Vec<ProcessResult>, Box<dyn std::error::Error>> {
        let start_time = Instant::now();
        let semaphore = Arc::new(Semaphore::new(self.config.max_threads));
        let metrics = Arc::clone(&self.metrics);

        // Traitement par lots pour optimiser la mémoire
        let results: Vec<ProcessResult> = files
            .chunks(self.config.batch_size)
            .flat_map(|chunk| {
                chunk.par_iter().map(|file_path| {
                    let _permit = semaphore.clone().try_acquire();
                    self.process_single_file(file_path.clone(), Arc::clone(&metrics))
                }).collect::<Vec<_>>()
            })
            .collect();

        let total_time = start_time.elapsed();
        self.update_metrics(total_time, results.len());

        Ok(results)
    }

    /// Traite un fichier unique avec optimisations
    fn process_single_file(&mut self, file_path: PathBuf, metrics: Arc<PerformanceMetrics>) -> ProcessResult {
        let start = Instant::now();
        metrics.total_operations.fetch_add(1, Ordering::Relaxed);

        // Vérifier le cache d'abord
        if let Some(cached_data) = self.cache.get(&file_path) {
            return ProcessResult {
                file_path: file_path.clone(),
                success: true,
                processing_time: start.elapsed(),
                output_size: cached_data.len(),
                message: "Cache hit".to_string(),
                compression_ratio: 0.0,
            };
        }

        match self.process_file_content(&file_path) {
            Ok((output_data, compression_ratio)) => {
                // Mettre en cache le résultat
                self.cache.put(file_path.clone(), output_data.clone());
                
                metrics.successful_operations.fetch_add(1, Ordering::Relaxed);
                ProcessResult {
                    file_path,
                    success: true,
                    processing_time: start.elapsed(),
                    output_size: output_data.len(),
                    message: "Processed successfully".to_string(),
                    compression_ratio,
                }
            }
            Err(e) => {
                metrics.failed_operations.fetch_add(1, Ordering::Relaxed);
                ProcessResult {
                    file_path,
                    success: false,
                    processing_time: start.elapsed(),
                    output_size: 0,
                    message: format!("Error: {}", e),
                    compression_ratio: 0.0,
                }
            }
        }
    }

    /// Traite le contenu d'un fichier (exemple avec compression)
    fn process_file_content(&self, file_path: &Path) -> Result<(Vec<u8>, f64), Box<dyn std::error::Error>> {
        let content = fs::read(file_path)?;
        let original_size = content.len();

        // Simulation de traitement intensif (compression, optimisation, etc.)
        let processed_content = self.compress_data(&content)?;
        let compressed_size = processed_content.len();

        let compression_ratio = if original_size > 0 {
            (1.0 - compressed_size as f64 / original_size as f64) * 100.0
        } else {
            0.0
        };

        Ok((processed_content, compression_ratio))
    }

    /// Compression ultra-rapide des données
    fn compress_data(&self, data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        use flate2::Compression;
        use flate2::write::GzEncoder;
        use std::io::Write;

        let mut encoder = GzEncoder::new(Vec::new(), Compression::new(self.config.compression_level as u32));
        encoder.write_all(data)?;
        Ok(encoder.finish()?)
    }

    /// Met à jour les métriques de performance
    fn update_metrics(&self, total_time: Duration, operation_count: usize) {
        // Note: Dans une vraie implémentation, on utiliserait des atomics pour thread-safety
        println!("🚀 Traitement terminé en {:?}", total_time);
        println!("📊 {} opérations traitées", operation_count);
        println!("💾 Taux de cache hit: {:.2}%", self.cache.hit_rate() * 100.0);
    }
}

/// Résultat de traitement d'un fichier
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessResult {
    pub file_path: PathBuf,
    pub success: bool,
    pub processing_time: Duration,
    pub output_size: usize,
    pub message: String,
    pub compression_ratio: f64,
}

/// Analyseur de performance ultra-rapide
pub struct PerformanceAnalyzer {
    samples: Vec<Duration>,
    memory_samples: Vec<usize>,
    start_time: Option<Instant>,
}

impl PerformanceAnalyzer {
    pub fn new() -> Self {
        Self {
            samples: Vec::new(),
            memory_samples: Vec::new(),
            start_time: None,
        }
    }

    pub fn start_measurement(&mut self) {
        self.start_time = Some(Instant::now());
    }

    pub fn record_sample(&mut self) {
        if let Some(start) = self.start_time {
            self.samples.push(start.elapsed());
        }
    }

    pub fn record_memory_usage(&mut self, usage: usize) {
        self.memory_samples.push(usage);
    }

    pub fn get_statistics(&self) -> PerformanceStats {
        if self.samples.is_empty() {
            return PerformanceStats::default();
        }

        let total: Duration = self.samples.iter().sum();
        let average = total / self.samples.len() as u32;
        
        let mut sorted_samples = self.samples.clone();
        sorted_samples.sort();
        
        let median = sorted_samples[sorted_samples.len() / 2];
        let p95_index = (sorted_samples.len() as f64 * 0.95) as usize;
        let p95 = sorted_samples[p95_index.min(sorted_samples.len() - 1)];

        let memory_avg = if !self.memory_samples.is_empty() {
            self.memory_samples.iter().sum::<usize>() / self.memory_samples.len()
        } else {
            0
        };

        PerformanceStats {
            total_time: total,
            average_time: average,
            median_time: median,
            p95_time: p95,
            min_time: *sorted_samples.first().unwrap_or(&Duration::new(0, 0)),
            max_time: *sorted_samples.last().unwrap_or(&Duration::new(0, 0)),
            sample_count: self.samples.len(),
            average_memory: memory_avg,
        }
    }
}

/// Statistiques de performance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceStats {
    pub total_time: Duration,
    pub average_time: Duration,
    pub median_time: Duration,
    pub p95_time: Duration,
    pub min_time: Duration,
    pub max_time: Duration,
    pub sample_count: usize,
    pub average_memory: usize,
}

impl Default for PerformanceStats {
    fn default() -> Self {
        Self {
            total_time: Duration::new(0, 0),
            average_time: Duration::new(0, 0),
            median_time: Duration::new(0, 0),
            p95_time: Duration::new(0, 0),
            min_time: Duration::new(0, 0),
            max_time: Duration::new(0, 0),
            sample_count: 0,
            average_memory: 0,
        }
    }
}

/// Gestionnaire de ressources avec pool de threads optimisé
pub struct ResourceManager {
    thread_pool: rayon::ThreadPool,
    config: PerformanceConfig,
}

impl ResourceManager {
    pub fn new(config: PerformanceConfig) -> Result<Self, Box<dyn std::error::Error>> {
        let thread_pool = rayon::ThreadPoolBuilder::new()
            .num_threads(config.max_threads)
            .build()?;

        Ok(Self { thread_pool, config })
    }

    /// Exécute une tâche intensive sur le pool de threads
    pub fn execute_intensive_task<F, R>(&self, task: F) -> R
    where
        F: FnOnce() -> R + Send,
        R: Send,
    {
        self.thread_pool.install(|| task())
    }

    /// Traite des données en parallèle avec équilibrage de charge
    pub fn process_data_parallel<T, R, F>(&self, data: Vec<T>, processor: F) -> Vec<R>
    where
        T: Send + Sync,
        R: Send,
        F: Fn(&T) -> R + Send + Sync,
    {
        data.par_iter().map(|item| processor(item)).collect()
    }
}

/// Utilitaire de compression ultra-rapide
pub struct FastCompressor {
    compression_level: u8,
}

impl FastCompressor {
    pub fn new(level: u8) -> Self {
        Self {
            compression_level: level.min(9),
        }
    }

    /// Compresse des données avec algorithme optimisé
    pub fn compress(&self, data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        use lz4_flex::compress_prepend_size;
        
        // LZ4 est plus rapide que gzip pour la compression/décompression
        Ok(compress_prepend_size(data))
    }

    /// Décompresse des données
    pub fn decompress(&self, compressed_data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        use lz4_flex::decompress_size_prepended;
        
        Ok(decompress_size_prepended(compressed_data)?)
    }

    /// Compresse un fichier entier
    pub fn compress_file(&self, input_path: &Path, output_path: &Path) -> Result<f64, Box<dyn std::error::Error>> {
        let data = fs::read(input_path)?;
        let original_size = data.len();
        
        let compressed_data = self.compress(&data)?;
        fs::write(output_path, compressed_data)?;
        
        let compressed_size = fs::metadata(output_path)?.len() as usize;
        let compression_ratio = (1.0 - compressed_size as f64 / original_size as f64) * 100.0;
        
        Ok(compression_ratio)
    }
}

/// Moniteur de performance temps réel
pub struct RealtimeMonitor {
    start_time: Instant,
    last_check: Instant,
    operation_count: AtomicUsize,
    error_count: AtomicUsize,
}

impl RealtimeMonitor {
    pub fn new() -> Self {
        let now = Instant::now();
        Self {
            start_time: now,
            last_check: now,
            operation_count: AtomicUsize::new(0),
            error_count: AtomicUsize::new(0),
        }
    }

    pub fn record_operation(&self) {
        self.operation_count.fetch_add(1, Ordering::Relaxed);
    }

    pub fn record_error(&self) {
        self.error_count.fetch_add(1, Ordering::Relaxed);
    }

    pub fn get_current_stats(&mut self) -> RealtimeStats {
        let now = Instant::now();
        let total_time = now.duration_since(self.start_time);
        let interval_time = now.duration_since(self.last_check);
        
        let ops = self.operation_count.load(Ordering::Relaxed);
        let errors = self.error_count.load(Ordering::Relaxed);
        
        let ops_per_second = if total_time.as_secs() > 0 {
            ops as f64 / total_time.as_secs_f64()
        } else {
            0.0
        };

        self.last_check = now;

        RealtimeStats {
            total_operations: ops,
            total_errors: errors,
            operations_per_second: ops_per_second,
            uptime: total_time,
            error_rate: if ops > 0 { errors as f64 / ops as f64 } else { 0.0 },
        }
    }
}

#[derive(Debug, Clone)]
pub struct RealtimeStats {
    pub total_operations: usize,
    pub total_errors: usize,
    pub operations_per_second: f64,
    pub uptime: Duration,
    pub error_rate: f64,
}

/// Point d'entrée pour les tests et benchmarks
#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_cache_performance() {
        let mut cache = HighPerformanceCache::new(3);
        
        // Test des opérations de base
        cache.put("key1".to_string(), "value1".to_string());
        cache.put("key2".to_string(), "value2".to_string());
        
        assert_eq!(cache.get(&"key1".to_string()), Some("value1".to_string()));
        assert_eq!(cache.get(&"key3".to_string()), None);
    }

    #[tokio::test]
    async fn test_file_processor() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.txt");
        
        let mut file = File::create(&file_path).unwrap();
        writeln!(file, "Test content for Mayu & Jack Studio").unwrap();
        
        let config = PerformanceConfig::default();
        let mut processor = FileProcessor::new(config);
        
        let results = processor.process_files_parallel(vec![file_path]).await.unwrap();
        assert_eq!(results.len(), 1);
        assert!(results[0].success);
    }

    #[test]
    fn test_compressor() {
        let compressor = FastCompressor::new(6);
        let test_data = b"Hello, Mayu & Jack Studio! This is test data for compression.";
        
        let compressed = compressor.compress(test_data).unwrap();
        let decompressed = compressor.decompress(&compressed).unwrap();
        
        assert_eq!(test_data.to_vec(), decompressed);
        assert!(compressed.len() < test_data.len()); // Vérifier que c'est compressé
    }
}

/// Fonction principale pour démonstration
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🎨 Mayu & Jack Studio - Utilitaires de Performance Rust");
    println!("=====================================================");

    // Configuration
    let config = PerformanceConfig {
        max_threads: 8,
        cache_size: 1024 * 1024,
        enable_metrics: true,
        compression_level: 6,
        batch_size: 50,
    };

    // Initialiser le gestionnaire de ressources
    let resource_manager = ResourceManager::new(config.clone())?;
    
    // Moniteur temps réel
    let mut monitor = RealtimeMonitor::new();
    
    // Simuler du traitement de fichiers
    println!("🚀 Démarrage du traitement de performance...");
    
    let test_files: Vec<PathBuf> = (0..100)
        .map(|i| PathBuf::from(format!("test_file_{}.txt", i)))
        .collect();

    // Traitement avec monitoring
    let start = Instant::now();
    
    for _ in 0..1000 {
        monitor.record_operation();
        
        // Simulation de travail
        thread::sleep(Duration::from_millis(1));
        
        if rand::random::<f64>() < 0.05 {
            monitor.record_error();
        }
    }

    let processing_time = start.elapsed();
    let stats = monitor.get_current_stats();

    // Affichage des résultats
    println!("✅ Traitement terminé!");
    println!("📊 Statistiques:");
    println!("   • Opérations totales: {}", stats.total_operations);
    println!("   • Erreurs: {}", stats.total_errors);
    println!("   • Opérations/seconde: {:.2}", stats.operations_per_second);
    println!("   • Taux d'erreur: {:.2}%", stats.error_rate * 100.0);
    println!("   • Temps de traitement: {:?}", processing_time);
    println!("   • Uptime: {:?}", stats.uptime);

    // Test du compresseur
    println!("\n🗜️ Test de compression:");
    let compressor = FastCompressor::new(6);
    let test_data = "Mayu & Jack Studio - Studio Créatif Premium ".repeat(100);
    let compressed = compressor.compress(test_data.as_bytes())?;
    let compression_ratio = (1.0 - compressed.len() as f64 / test_data.len() as f64) * 100.0;
    println!("   • Taille originale: {} octets", test_data.len());
    println!("   • Taille compressée: {} octets", compressed.len());
    println!("   • Ratio de compression: {:.1}%", compression_ratio);

    println!("\n🎯 Optimisations Rust activées avec succès!");
    
    Ok(())
}
