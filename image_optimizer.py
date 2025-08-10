#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Image Optimizer pour Mayu & Jack Studio
Optimisation automatique des images pour le web
Conversion WebP, compression, redimensionnement intelligent
"""

import os
import sys
import json
import argparse
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from typing import List, Dict, Tuple, Optional
import hashlib
import time

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('image_optimizer.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class ImageOptimizer:
    """Optimiseur d'images avancé pour Mayu & Jack Studio"""
    
    SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'}
    OUTPUT_FORMATS = ['webp', 'jpg', 'png']
    
    # Tailles responsives standard
    RESPONSIVE_SIZES = {
        'thumbnail': (150, 150),
        'small': (300, 300),
        'medium': (600, 600),
        'large': (1200, 1200),
        'xlarge': (1920, 1920)
    }
    
    # Qualité par format et usage
    QUALITY_SETTINGS = {
        'webp': {
            'high': 85,
            'medium': 75,
            'low': 60
        },
        'jpg': {
            'high': 90,
            'medium': 80,
            'low': 70
        },
        'png': {
            'high': 9,  # PNG compression level
            'medium': 6,
            'low': 3
        }
    }
    
    def __init__(self, config: Dict = None):
        """Initialise l'optimiseur avec la configuration"""
        self.config = config or self._default_config()
        self.stats = {
            'processed': 0,
            'skipped': 0,
            'errors': 0,
            'total_size_before': 0,
            'total_size_after': 0,
            'processing_time': 0
        }
        
    def _default_config(self) -> Dict:
        """Configuration par défaut de l'optimiseur"""
        return {
            'output_dir': 'optimized',
            'quality': 'medium',
            'generate_webp': True,
            'generate_responsive': True,
            'progressive_jpeg': True,
            'strip_metadata': True,
            'max_width': 1920,
            'max_height': 1920,
            'threading': True,
            'max_workers': 4,
            'overwrite': False,
            'backup_originals': True
        }
    
    def optimize_single_image(self, input_path: Path, output_dir: Path = None) -> Dict:
        """Optimise une image unique"""
        try:
            start_time = time.time()
            
            # Vérification du format
            if input_path.suffix.lower() not in self.SUPPORTED_FORMATS:
                return self._create_result(input_path, 'skipped', 'Format non supporté')
            
            # Définir le répertoire de sortie
            if output_dir is None:
                output_dir = input_path.parent / self.config['output_dir']
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Charger l'image
            with Image.open(input_path) as img:
                original_size = input_path.stat().st_size
                self.stats['total_size_before'] += original_size
                
                # Correction de l'orientation EXIF
                img = ImageOps.exif_transpose(img)
                
                # Conversion en RGB si nécessaire (pour WebP/JPEG)
                if img.mode in ('RGBA', 'LA', 'P'):
                    if self.config['generate_webp'] or input_path.suffix.lower() in ['.jpg', '.jpeg']:
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                        img = background
                
                # Redimensionnement si nécessaire
                img = self._resize_image(img)
                
                # Générer les différentes versions
                results = []
                
                # Version WebP
                if self.config['generate_webp']:
                    webp_result = self._save_webp(img, input_path, output_dir)
                    results.append(webp_result)
                
                # Version optimisée du format original
                original_result = self._save_original_format(img, input_path, output_dir)
                results.append(original_result)
                
                # Versions responsives
                if self.config['generate_responsive']:
                    responsive_results = self._generate_responsive_versions(img, input_path, output_dir)
                    results.extend(responsive_results)
                
                # Calculer les statistiques
                total_size_after = sum(r.get('size_after', 0) for r in results)
                self.stats['total_size_after'] += total_size_after
                
                processing_time = time.time() - start_time
                self.stats['processing_time'] += processing_time
                self.stats['processed'] += 1
                
                compression_ratio = (1 - total_size_after / original_size) * 100 if original_size > 0 else 0
                
                logger.info(f"✅ {input_path.name} optimisé - Compression: {compression_ratio:.1f}% - Temps: {processing_time:.2f}s")
                
                return {
                    'status': 'success',
                    'file': str(input_path),
                    'results': results,
                    'compression_ratio': compression_ratio,
                    'processing_time': processing_time,
                    'size_before': original_size,
                    'size_after': total_size_after
                }
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"❌ Erreur lors de l'optimisation de {input_path}: {str(e)}")
            return self._create_result(input_path, 'error', str(e))
    
    def _resize_image(self, img: Image.Image) -> Image.Image:
        """Redimensionne l'image selon les contraintes de taille"""
        max_width = self.config['max_width']
        max_height = self.config['max_height']
        
        if img.width > max_width or img.height > max_height:
            # Calculer le ratio pour préserver les proportions
            ratio = min(max_width / img.width, max_height / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            
            # Utiliser un filtre de redimensionnement de haute qualité
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            logger.debug(f"Image redimensionnée à {new_size[0]}x{new_size[1]}")
        
        return img
    
    def _save_webp(self, img: Image.Image, original_path: Path, output_dir: Path) -> Dict:
        """Sauvegarde l'image au format WebP"""
        webp_path = output_dir / f"{original_path.stem}.webp"
        
        quality = self.QUALITY_SETTINGS['webp'][self.config['quality']]
        
        # Options WebP avancées
        save_options = {
            'quality': quality,
            'method': 4,  # Meilleure compression
            'lossless': False,
            'exact': False
        }
        
        img.save(webp_path, 'WebP', **save_options)
        
        return {
            'format': 'webp',
            'path': str(webp_path),
            'size_after': webp_path.stat().st_size,
            'quality': quality
        }
    
    def _save_original_format(self, img: Image.Image, original_path: Path, output_dir: Path) -> Dict:
        """Sauvegarde l'image dans son format original optimisé"""
        format_name = original_path.suffix.lower()
        optimized_path = output_dir / f"{original_path.stem}_optimized{format_name}"
        
        if format_name in ['.jpg', '.jpeg']:
            quality = self.QUALITY_SETTINGS['jpg'][self.config['quality']]
            save_options = {
                'quality': quality,
                'optimize': True,
                'progressive': self.config['progressive_jpeg']
            }
            img.save(optimized_path, 'JPEG', **save_options)
            
        elif format_name == '.png':
            compress_level = self.QUALITY_SETTINGS['png'][self.config['quality']]
            save_options = {
                'optimize': True,
                'compress_level': compress_level
            }
            img.save(optimized_path, 'PNG', **save_options)
            
        else:
            # Format par défaut
            img.save(optimized_path)
        
        return {
            'format': format_name.replace('.', ''),
            'path': str(optimized_path),
            'size_after': optimized_path.stat().st_size,
            'quality': self.config['quality']
        }
    
    def _generate_responsive_versions(self, img: Image.Image, original_path: Path, output_dir: Path) -> List[Dict]:
        """Génère les versions responsives de l'image"""
        results = []
        
        for size_name, (max_w, max_h) in self.RESPONSIVE_SIZES.items():
            # Skip si l'image est déjà plus petite
            if img.width <= max_w and img.height <= max_h:
                continue
            
            # Calculer la nouvelle taille en préservant le ratio
            ratio = min(max_w / img.width, max_h / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            
            # Redimensionner
            resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Sauvegarder en WebP et format original
            responsive_dir = output_dir / 'responsive' / size_name
            responsive_dir.mkdir(parents=True, exist_ok=True)
            
            # Version WebP
            if self.config['generate_webp']:
                webp_path = responsive_dir / f"{original_path.stem}_{size_name}.webp"
                quality = self.QUALITY_SETTINGS['webp'][self.config['quality']]
                resized_img.save(webp_path, 'WebP', quality=quality, method=4)
                
                results.append({
                    'format': 'webp',
                    'size': size_name,
                    'path': str(webp_path),
                    'dimensions': new_size,
                    'size_after': webp_path.stat().st_size
                })
            
            # Version format original
            original_format = original_path.suffix.lower()
            if original_format in ['.jpg', '.jpeg']:
                responsive_path = responsive_dir / f"{original_path.stem}_{size_name}.jpg"
                quality = self.QUALITY_SETTINGS['jpg'][self.config['quality']]
                resized_img.save(responsive_path, 'JPEG', quality=quality, optimize=True)
                
                results.append({
                    'format': 'jpg',
                    'size': size_name,
                    'path': str(responsive_path),
                    'dimensions': new_size,
                    'size_after': responsive_path.stat().st_size
                })
        
        return results
    
    def optimize_directory(self, input_dir: Path, output_dir: Path = None, recursive: bool = True) -> Dict:
        """Optimise toutes les images d'un répertoire"""
        logger.info(f"🎨 Optimisation du répertoire: {input_dir}")
        
        if output_dir is None:
            output_dir = input_dir / self.config['output_dir']
        
        # Rechercher toutes les images
        image_files = []
        pattern = "**/*" if recursive else "*"
        
        for ext in self.SUPPORTED_FORMATS:
            image_files.extend(input_dir.glob(f"{pattern}{ext}"))
            image_files.extend(input_dir.glob(f"{pattern}{ext.upper()}"))
        
        logger.info(f"📊 {len(image_files)} images trouvées")
        
        if not image_files:
            return {'status': 'no_images', 'message': 'Aucune image trouvée'}
        
        # Traitement en parallèle si activé
        if self.config['threading'] and len(image_files) > 1:
            return self._process_parallel(image_files, output_dir)
        else:
            return self._process_sequential(image_files, output_dir)
    
    def _process_parallel(self, image_files: List[Path], output_dir: Path) -> Dict:
        """Traitement en parallèle des images"""
        results = []
        
        with ThreadPoolExecutor(max_workers=self.config['max_workers']) as executor:
            # Soumettre toutes les tâches
            future_to_file = {
                executor.submit(self.optimize_single_image, img_file, output_dir): img_file
                for img_file in image_files
            }
            
            # Collecter les résultats
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as exc:
                    logger.error(f"❌ {file_path} a généré une exception: {exc}")
                    results.append(self._create_result(file_path, 'error', str(exc)))
        
        return self._compile_results(results)
    
    def _process_sequential(self, image_files: List[Path], output_dir: Path) -> Dict:
        """Traitement séquentiel des images"""
        results = []
        
        for img_file in image_files:
            result = self.optimize_single_image(img_file, output_dir)
            results.append(result)
        
        return self._compile_results(results)
    
    def _compile_results(self, results: List[Dict]) -> Dict:
        """Compile les résultats du traitement"""
        total_compression = 0
        successful_results = [r for r in results if r['status'] == 'success']
        
        if successful_results:
            total_size_before = sum(r['size_before'] for r in successful_results)
            total_size_after = sum(r['size_after'] for r in successful_results)
            total_compression = (1 - total_size_after / total_size_before) * 100 if total_size_before > 0 else 0
        
        return {
            'status': 'completed',
            'total_files': len(results),
            'successful': len(successful_results),
            'errors': len([r for r in results if r['status'] == 'error']),
            'skipped': len([r for r in results if r['status'] == 'skipped']),
            'total_compression': total_compression,
            'processing_time': self.stats['processing_time'],
            'results': results
        }
    
    def _create_result(self, file_path: Path, status: str, message: str = '') -> Dict:
        """Crée un objet résultat standard"""
        return {
            'status': status,
            'file': str(file_path),
            'message': message,
            'size_before': 0,
            'size_after': 0
        }
    
    def generate_html_report(self, results: Dict, output_path: Path = None) -> str:
        """Génère un rapport HTML des optimisations"""
        if output_path is None:
            output_path = Path('optimization_report.html')
        
        html_template = """
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rapport d'Optimisation - Mayu & Jack Studio</title>
            <style>
                body {{ font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }}
                .container {{ max-width: 1200px; margin: 0 auto; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .header h1 {{ color: #3b82f6; margin-bottom: 10px; }}
                .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }}
                .stat-card {{ background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; text-align: center; }}
                .stat-value {{ font-size: 2rem; font-weight: bold; color: #3b82f6; }}
                .stat-label {{ color: #cbd5e1; margin-top: 5px; }}
                .results {{ background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; }}
                .result-item {{ padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }}
                .success {{ border-left: 4px solid #10b981; }}
                .error {{ border-left: 4px solid #ef4444; }}
                .skipped {{ border-left: 4px solid #f59e0b; }}
                .file-name {{ font-weight: bold; color: #f8fafc; }}
                .compression {{ color: #10b981; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎨 Rapport d'Optimisation - Mayu & Jack Studio</h1>
                    <p>Optimisation d'images terminée</p>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-value">{total_files}</div>
                        <div class="stat-label">Fichiers traités</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{successful}</div>
                        <div class="stat-label">Optimisés avec succès</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{total_compression:.1f}%</div>
                        <div class="stat-label">Compression moyenne</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{processing_time:.1f}s</div>
                        <div class="stat-label">Temps de traitement</div>
                    </div>
                </div>
                
                <div class="results">
                    <h3>Détails des optimisations</h3>
                    {results_html}
                </div>
            </div>
        </body>
        </html>
        """
        
        # Générer le HTML des résultats
        results_html = ""
        for result in results.get('results', []):
            status_class = result['status']
            compression = ""
            if result['status'] == 'success' and 'compression_ratio' in result:
                compression = f'<span class="compression">-{result["compression_ratio"]:.1f}%</span>'
            
            results_html += f"""
            <div class="result-item {status_class}">
                <div class="file-name">{Path(result['file']).name}</div>
                <div>{result.get('message', '')} {compression}</div>
            </div>
            """
        
        # Remplir le template
        html_content = html_template.format(
            total_files=results['total_files'],
            successful=results['successful'],
            total_compression=results.get('total_compression', 0),
            processing_time=results.get('processing_time', 0),
            results_html=results_html
        )
        
        # Sauvegarder le rapport
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"📊 Rapport HTML généré: {output_path}")
        return str(output_path)

def main():
    """Fonction principale avec interface en ligne de commande"""
    parser = argparse.ArgumentParser(description="Optimiseur d'images pour Mayu & Jack Studio")
    parser.add_argument('input', help='Fichier ou répertoire d\'entrée')
    parser.add_argument('-o', '--output', help='Répertoire de sortie')
    parser.add_argument('-q', '--quality', choices=['low', 'medium', 'high'], default='medium', help='Qualité de compression')
    parser.add_argument('--no-webp', action='store_true', help='Désactiver la génération WebP')
    parser.add_argument('--no-responsive', action='store_true', help='Désactiver les versions responsives')
    parser.add_argument('--recursive', action='store_true', help='Traitement récursif des sous-dossiers')
    parser.add_argument('--threads', type=int, default=4, help='Nombre de threads pour le traitement parallèle')
    parser.add_argument('--report', help='Chemin du rapport HTML')
    
    args = parser.parse_args()
    
    # Configuration depuis les arguments
    config = {
        'quality': args.quality,
        'generate_webp': not args.no_webp,
        'generate_responsive': not args.no_responsive,
        'max_workers': args.threads,
        'threading': args.threads > 1
    }
    
    # Initialiser l'optimiseur
    optimizer = ImageOptimizer(config)
    
    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else None
    
    # Lancer l'optimisation
    if input_path.is_file():
        logger.info("🖼️ Optimisation d'un fichier unique")
        result = optimizer.optimize_single_image(input_path, output_path)
        results = {
            'total_files': 1,
            'successful': 1 if result['status'] == 'success' else 0,
            'errors': 1 if result['status'] == 'error' else 0,
            'skipped': 1 if result['status'] == 'skipped' else 0,
            'total_compression': result.get('compression_ratio', 0),
            'processing_time': result.get('processing_time', 0),
            'results': [result]
        }
    elif input_path.is_dir():
        logger.info("📁 Optimisation d'un répertoire")
        results = optimizer.optimize_directory(input_path, output_path, args.recursive)
    else:
        logger.error("❌ Chemin d'entrée invalide")
        return 1
    
    # Afficher le résumé
    logger.info("\n" + "="*50)
    logger.info("📊 RÉSUMÉ DE L'OPTIMISATION")
    logger.info("="*50)
    logger.info(f"Fichiers traités: {results['total_files']}")
    logger.info(f"Succès: {results['successful']}")
    logger.info(f"Erreurs: {results['errors']}")
    logger.info(f"Ignorés: {results['skipped']}")
    logger.info(f"Compression moyenne: {results.get('total_compression', 0):.1f}%")
    logger.info(f"Temps total: {results.get('processing_time', 0):.1f}s")
    
    # Générer le rapport HTML si demandé
    if args.report:
        optimizer.generate_html_report(results, Path(args.report))
    
    logger.info("✅ Optimisation terminée avec succès!")
    return 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        logger.info("\n⏹️ Optimisation interrompue par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        sys.exit(1)
