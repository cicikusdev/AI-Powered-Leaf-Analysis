"""
Model Değerlendirme Scripti
Evaluates all 4 plant disease detection models on the PlantVillage dataset
and saves comprehensive metrics to metrics_cache.json.
"""

import os
import sys
import json
import gc
import argparse
import time
from datetime import datetime
import tf_keras

import numpy as np
from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_curve,
    auc,
)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'bitki_projesi_model')
DATASET_DIR = os.path.join(MODEL_DIR, 'plantvillage', 'plantvillage dataset', 'color')
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, 'class_names.json')
OUTPUT_PATH = os.path.join(BASE_DIR, 'metrics_cache.json')

MODEL_NAMES = ['best_model', 'best_model_v2', 'best_model_v3', 'best_model_v4']

# ---------------------------------------------------------------------------
# Turkish translations
# ---------------------------------------------------------------------------
bitki_isimleri = {
    "Apple": "Elma",
    "Blueberry": "Yaban Mersini",
    "Cherry_(including_sour)": "Kiraz",
    "Corn_(maize)": "Mısır",
    "Grape": "Üzüm",
    "Orange": "Portakal",
    "Peach": "Şeftali",
    "Pepper,_bell": "Biber",
    "Potato": "Patates",
    "Raspberry": "Ahududu",
    "Soybean": "Soya Fasulyesi",
    "Squash": "Kabak",
    "Strawberry": "Çilek",
    "Tomato": "Domates",
}

hastalik_bilgi = {
    "healthy": "Sağlıklı",
    "Early_blight": "Erken Yanıklık",
    "Late_blight": "Geç Yanıklık",
    "Leaf_scorch": "Yaprak Yanması",
    "Black_rot": "Kara Çürüklük",
    "Common_rust": "Yaygın Pas",
    "Bacterial_spot": "Bakteriyel Leke",
    "Septoria_leaf_spot": "Septoria Yaprak Lekesi",
    "mosaic_virus": "Mozaik Virüsü",
    "Powdery_mildew": "Küllü Mildiyö",
    "Apple_scab": "Elma Karalekesi",
    "Cedar_apple_rust": "Sedir Elma Pası",
    "Cercospora": "Cercospora Yaprak Lekesi",
    "Northern_Leaf_Blight": "Kuzey Yaprak Yanıklığı",
    "Esca": "Esca Hastalığı",
    "Leaf_blight": "Yaprak Yanıklığı",
    "Haunglongbing": "Huanglongbing",
    "Leaf_Mold": "Yaprak Küfü",
    "Spider_mites": "Kırmızı Örümcek",
    "Target_Spot": "Hedef Leke",
    "Yellow_Leaf_Curl_Virus": "Sarı Yaprak Kıvırcıklık Virüsü",
}


def translate_class_name(class_name_en: str) -> str:
    """Translate an English class name to Turkish: 'Bitki - Hastalık'."""
    parts = class_name_en.split('___')
    plant_en = parts[0] if len(parts) > 0 else class_name_en
    disease_en = parts[1] if len(parts) > 1 else 'healthy'

    plant_tr = bitki_isimleri.get(plant_en, plant_en)

    # Try to find disease translation
    disease_key = disease_en.replace(' ', '_')
    disease_tr = hastalik_bilgi.get(disease_key)
    if disease_tr is None:
        for key, val in hastalik_bilgi.items():
            if key.lower() in disease_key.lower() or disease_key.lower() in key.lower():
                disease_tr = val
                break
    if disease_tr is None:
        disease_tr = 'Sağlıklı' if 'healthy' in disease_en.lower() else disease_en

    return f"{plant_tr} - {disease_tr}"


# ---------------------------------------------------------------------------
# Dataset loading
# ---------------------------------------------------------------------------

def log(msg: str):
    """Print a timestamped log message."""
    ts = datetime.now().strftime('%H:%M:%S')
    print(f"[{ts}] {msg}")


def load_dataset(quick: bool = False):
    """
    Load the PlantVillage dataset from disk.

    Parameters
    ----------
    quick : bool
        If True, limit to 50 images per class for faster testing.

    Returns
    -------
    X : np.ndarray of shape (N, 128, 128, 3) float32 in [0, 1]
    y : np.ndarray of shape (N,) int labels
    class_names : list[str]  (sorted by index)
    """
    with open(CLASS_NAMES_PATH, 'r', encoding='utf-8') as f:
        raw = json.load(f)  # {"Apple___Apple_scab": 0, ...}

    # Build sorted list: class_names[0] = "Apple___Apple_scab", etc.
    class_names = [name for name, _ in sorted(raw.items(), key=lambda x: x[1])]
    class_to_idx = {cn: i for i, cn in enumerate(class_names)}

    images = []
    labels = []
    skipped = 0

    log(f"Veri seti y\u00fckleniyor: {DATASET_DIR}")
    log(f"Toplam s\u0131n\u0131f say\u0131s\u0131: {len(class_names)}")
    if quick:
        log("HIZLI MOD: S\u0131n\u0131f ba\u015f\u0131na maksimum 50 g\u00f6r\u00fcnt\u00fc")

    for class_name in class_names:
        class_dir = os.path.join(DATASET_DIR, class_name)
        if not os.path.isdir(class_dir):
            log(f"  UYARI: Dizin bulunamad\u0131 \u2192 {class_name}")
            continue

        class_idx = class_to_idx[class_name]
        files = [f for f in os.listdir(class_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]

        if quick:
            files = files[:50]

        count = 0
        for fname in files:
            fpath = os.path.join(class_dir, fname)
            try:
                img = Image.open(fpath).convert('RGB')
                img = img.resize((128, 128))
                img_array = np.array(img, dtype=np.float32) / 255.0
                images.append(img_array)
                labels.append(class_idx)
                count += 1
            except Exception:
                skipped += 1

        log(f"  {class_name}: {count} g\u00f6r\u00fcnt\u00fc y\u00fcklendi")

    X = np.array(images, dtype=np.float32)
    y = np.array(labels, dtype=np.int32)
    log(f"Toplam: {len(X)} g\u00f6r\u00fcnt\u00fc, {skipped} atlanan dosya")
    return X, y, class_names


# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------

def compute_wmape(y_true_onehot, y_pred_probs):
    """
    Weighted Mean Absolute Percentage Error.
    Uses one-hot true labels and predicted probabilities.
    """
    # Per-class: actual counts
    actual_counts = y_true_onehot.sum(axis=0)
    total = actual_counts.sum()

    # Predicted counts (sum of predicted probs per class)
    pred_counts = y_pred_probs.sum(axis=0)

    # Avoid division by zero
    mask = actual_counts > 0
    errors = np.abs(actual_counts[mask] - pred_counts[mask])
    wmape = errors.sum() / total
    return float(wmape)


def evaluate_model(model_name: str, X_test: np.ndarray, y_test: np.ndarray,
                   class_names: list, num_classes: int) -> dict:
    """Evaluate a single model and return its metrics dictionary."""
    import tensorflow as tf
    import keras

    model_path = os.path.join(MODEL_DIR, f'{model_name}.keras')
    if not os.path.exists(model_path):
        log(f"  MODEL BULUNAMADI: {model_path}")
        return None

    log(f"  Model yükleniyor: {model_name}")
    t0 = time.time()
    try:
        model = keras.models.load_model(
            model_path, 
            compile=False,
            custom_objects={'Functional': keras.models.Model},
            safe_mode=False
        )
    except Exception as e:
        log(f"  Model yüklenirken hata oluştu: {e}")
        return None
    log(f"  Model yüklendi ({time.time() - t0:.1f}s)")

    # Predict
    log(f"  Tahmin yapılıyor ({len(X_test)} görüntü)...")
    t0 = time.time()
    y_pred_probs = model.predict(X_test, batch_size=64, verbose=0)
    log(f"  Tahmin tamamlandı ({time.time() - t0:.1f}s)")

    y_pred = np.argmax(y_pred_probs, axis=1)

    # Classification report
    report = classification_report(y_test, y_pred, target_names=class_names,
                                   output_dict=True, zero_division=0)

    overall_accuracy = float(report['accuracy'])
    macro_avg = report['macro avg']
    weighted_avg = report['weighted avg']

    # Per-class metrics
    per_class = []
    for i, cn in enumerate(class_names):
        cls_report = report.get(cn, {})
        per_class.append({
            'class_name': cn,
            'class_name_tr': translate_class_name(cn),
            'precision': round(float(cls_report.get('precision', 0)), 4),
            'recall': round(float(cls_report.get('recall', 0)), 4),
            'f1_score': round(float(cls_report.get('f1-score', 0)), 4),
            'support': int(cls_report.get('support', 0)),
        })

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred, labels=list(range(num_classes)))

    # One-hot encode for ROC / WMAPE
    y_test_onehot = np.zeros((len(y_test), num_classes), dtype=np.float32)
    y_test_onehot[np.arange(len(y_test)), y_test] = 1.0

    # WMAPE
    wmape = compute_wmape(y_test_onehot, y_pred_probs)

    # ROC curves (one-vs-rest)
    log(f"  ROC eğrileri hesaplanıyor...")
    roc_per_class = {}
    auc_values = []

    for i in range(num_classes):
        fpr, tpr, _ = roc_curve(y_test_onehot[:, i], y_pred_probs[:, i])
        roc_auc = auc(fpr, tpr)
        auc_values.append(roc_auc)

        # Interpolate to max 100 points to keep JSON manageable
        if len(fpr) > 100:
            fpr_interp = np.linspace(0, 1, 100)
            tpr_interp = np.interp(fpr_interp, fpr, tpr)
            fpr = fpr_interp
            tpr = tpr_interp

        roc_per_class[str(i)] = {
            'fpr': [round(float(v), 6) for v in fpr],
            'tpr': [round(float(v), 6) for v in tpr],
            'auc': round(float(roc_auc), 4),
        }

    macro_auc = float(np.mean(auc_values))

    # Free model memory
    del model
    tf.keras.backend.clear_session()
    gc.collect()
    log(f"  Model belleği temizlendi")

    return {
        'overall_accuracy': round(overall_accuracy, 4),
        'macro_precision': round(float(macro_avg['precision']), 4),
        'macro_recall': round(float(macro_avg['recall']), 4),
        'macro_f1': round(float(macro_avg['f1-score']), 4),
        'weighted_precision': round(float(weighted_avg['precision']), 4),
        'weighted_recall': round(float(weighted_avg['recall']), 4),
        'weighted_f1': round(float(weighted_avg['f1-score']), 4),
        'wmape': round(wmape, 4),
        'per_class': per_class,
        'confusion_matrix': cm.tolist(),
        'roc_data': {
            'per_class': roc_per_class,
            'macro_auc': round(macro_auc, 4),
        },
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Bitki hastalığı modellerini değerlendir')
    parser.add_argument('--quick', action='store_true',
                        help='Hızlı test modu: sınıf başına sadece 50 görüntü kullanır')
    args = parser.parse_args()

    log("=" * 60)
    log("Model Değerlendirme Başlatılıyor")
    log("=" * 60)

    # Load dataset
    X, y, class_names = load_dataset(quick=args.quick)
    num_classes = len(class_names)

    # Train/test split
    log("Veri seti bölünüyor (train/test = 80/20)...")
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    log(f"Test seti boyutu: {len(X_test)} görüntü")

    # Free training data
    del _
    gc.collect()

    # class_names is already a sorted list from load_dataset
    class_names_list = class_names

    # Turkish class names
    class_names_tr = [translate_class_name(cn) for cn in class_names_list]

    # Evaluate each model
    results = {
        'evaluation_date': datetime.now().strftime('%Y-%m-%d'),
        'dataset': 'PlantVillage',
        'test_size': 0.2,
        'num_classes': num_classes,
        'class_names': class_names_list,
        'class_names_tr': class_names_tr,
        'models': {},
    }

    for model_name in MODEL_NAMES:
        log("-" * 60)
        log(f"Model değerlendiriliyor: {model_name}")
        log("-" * 60)

        t0 = time.time()
        model_metrics = evaluate_model(model_name, X_test, y_test, class_names, num_classes)

        if model_metrics is not None:
            results['models'][model_name] = model_metrics
            log(f"  Doğruluk: {model_metrics['overall_accuracy']:.4f}")
            log(f"  Makro F1: {model_metrics['macro_f1']:.4f}")
            log(f"  WMAPE: {model_metrics['wmape']:.4f}")
            log(f"  Makro AUC: {model_metrics['roc_data']['macro_auc']:.4f}")
        else:
            log(f"  ATLANDI — model dosyası bulunamadı")

        elapsed = time.time() - t0
        log(f"  Süre: {elapsed:.1f}s")

    # Save results
    log("=" * 60)
    log(f"Sonuçlar kaydediliyor: {OUTPUT_PATH}")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    log("Tamamlandı!")
    log("=" * 60)


if __name__ == '__main__':
    main()
