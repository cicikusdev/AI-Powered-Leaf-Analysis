"""
Bitki Hastalığı Tespit API
Flask backend for plant disease detection using trained CNN models.
"""

import os
# Keras 3.x hatasını önlemek için eski keras 2 modunu aktifleştir
os.environ['TF_USE_LEGACY_KERAS'] = '1'
import json
import numpy as np
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import tensorflow as tf
import keras

# ---------------------------------------------------------------------------
# App configuration
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'bitki_projesi_model')

# ---------------------------------------------------------------------------
# Lazy model cache
# ---------------------------------------------------------------------------
_model_cache = {}

AVAILABLE_MODELS = ['best_model', 'best_model_v2', 'best_model_v3', 'best_model_v4']

# ---------------------------------------------------------------------------
# Disease information (Turkish)
# ---------------------------------------------------------------------------
hastalik_bilgi = {
    "healthy": ("Sağlıklı", "Bu yaprak sağlıklı görünüyor. Herhangi bir hastalık belirtisi tespit edilmedi.", "Bitkinin düzenli bakımına devam edin."),
    "Early_blight": ("Erken Yanıklık", "Alternaria mantarının neden olduğu bir hastalık. Yapraklarda koyu kahverengi halkalar oluşur.", "Etkilenen yaprakları uzaklaştırın ve fungisit uygulayın."),
    "Late_blight": ("Geç Yanıklık", "Phytophthora infestans hastalığı. Yapraklarda gri-kahverengi lekeler görülür.", "Etkilenen yaprakları hemen imha edin ve bakır bazlı fungisit kullanın."),
    "Leaf_scorch": ("Yaprak Yanması", "Yaprak kenarlarından başlayan kahverengileşme. Su stresi veya mantar kaynaklıdır.", "Sulama düzenini iyileştirin ve etkilenen yaprakları temizleyin."),
    "Black_rot": ("Kara Çürüklük", "Güneş yanığı ve mantar enfeksiyonlarından kaynaklanır. Yapraklarda siyah lekeler oluşur.", "Etkilenen kısımları budayın ve fungisit uygulayın."),
    "Common_rust": ("Yaygın Pas", "Puccinia sorghi mantarı. Yapraklarda turuncu-kahverengi lekeler görülür.", "Pas dayanıklı çeşitler tercih edin ve fungisit uygulayın."),
    "Bacterial_spot": ("Bakteriyel Leke", "Xanthomonas bakterisi. Küçük koyu lekeler ve sararma görülür.", "Bakır bazlı bakterisit kullanın ve hastalıklı bitkileri izole edin."),
    "Septoria_leaf_spot": ("Septoria Yaprak Lekesi", "Küçük yuvarlak lekeler ve sarı çember oluşur.", "Alt yaprakları temizleyin ve fungisit uygulayın."),
    "mosaic_virus": ("Mozaik Virüsü", "Yapraklarda sarı-yeşil mozaik desen. Virüs yaprak biti ile yayılır.", "Virüslü bitkileri imha edin ve böcek kontrolü yapın."),
    "Powdery_mildew": ("Küllü Mildiyö", "Yaprak yüzeyinde beyaz pudra görünümlü mantar.", "Kükürt bazlı fungisit kullanın ve hava sirkülasyonunu artırın."),
    "Apple_scab": ("Elma Karalekesi", "Venturia inaequalis mantarı. Yapraklarda koyu lekeler oluşur.", "Düşen yaprakları temizleyin ve koruyucu fungisit uygulayın."),
    "Cedar_apple_rust": ("Sedir Elma Pası", "Gymnosporangium mantarı. Sarı-turuncu lekeler görülür.", "Sedir ağaçlarını uzaklaştırın ve fungisit uygulayın."),
    "Cercospora": ("Cercospora Yaprak Lekesi", "Gri merkezli koyu kenarlıklı lekeler oluşur.", "Etkilenen yaprakları uzaklaştırın ve fungisit uygulayın."),
    "Northern_Leaf_Blight": ("Kuzey Yaprak Yanıklığı", "Uzun eliptik grimsi lekeler oluşur.", "Dayanıklı çeşitler kullanın ve ekim rotasyonu yapın."),
    "Esca": ("Esca Hastalığı", "Üzüm asmasında mantar kaynaklı damar hastalığı. Yapraklarda kaplan çizgisi deseni.", "Etkilenen dalları budayın ve yara yerlerini koruyun."),
    "Leaf_blight": ("Yaprak Yanıklığı", "Mantarlar tarafından oluşturulan yaprak yanıklığı.", "Fungisit uygulayın ve etkilenen yaprakları temizleyin."),
    "Haunglongbing": ("Huanglongbing", "Turunçgil yeşillenme hastalığı. Yapraklarda asimetrik sararma.", "Psyllid böceklerini kontrol edin ve enfekte ağaçları uzaklaştırın."),
    "Leaf_Mold": ("Yaprak Küfü", "Yaprak altında sarımsı-yeşil küf oluşumu.", "Havalandırmayı artırın ve fungisit uygulayın."),
    "Spider_mites": ("Kırmızı Örümcek", "Yapraklarda küçük sarı noktalar ve ince ağ örgüsü.", "Akarisit uygulayın ve nem seviyesini artırın."),
    "Target_Spot": ("Hedef Leke", "Yapraklarda konsantrik halkalı lekeler oluşur.", "Fungisit uygulayın ve bitkiler arası mesafeyi artırın."),
    "Yellow_Leaf_Curl_Virus": ("Sarı Yaprak Kıvırcıklık Virüsü", "Yapraklarda yukarı doğru kıvrılma ve sararma.", "Beyaz sinek kontrolü yapın ve dirençli çeşitler kullanın."),
}

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

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_class_names():
    """Load class names from the JSON file. Returns {index: class_name} dict."""
    path = os.path.join(MODEL_DIR, 'class_names.json')
    with open(path, 'r', encoding='utf-8') as f:
        raw = json.load(f)
    # raw is {"Apple___Apple_scab": 0, ...}, reverse to {0: "Apple___Apple_scab", ...}
    return {v: k for k, v in raw.items()}


def _get_model(model_name: str):
    """Lazy-load a Keras model and cache it."""
    if model_name in _model_cache:
        return _model_cache[model_name]

    model_path = os.path.join(MODEL_DIR, f'{model_name}.keras')
    if not os.path.exists(model_path):
        return None

    model = keras.models.load_model(
        model_path, 
        compile=False,
        custom_objects={'Functional': keras.models.Model},
        safe_mode=False
    )
    _model_cache[model_name] = model
    return model


def _translate_class_name(class_name_en: str):
    """
    Parse an English class name like 'Apple___Black_rot' and return
    (plant_tr, plant_en, disease_tr, disease_en, is_healthy, description, recommendation).
    """
    parts = class_name_en.split('___')
    plant_en = parts[0] if len(parts) > 0 else class_name_en
    disease_en = parts[1] if len(parts) > 1 else 'healthy'

    plant_tr = bitki_isimleri.get(plant_en, plant_en)

    # Determine the disease key for the hastalik_bilgi lookup
    disease_key = disease_en.replace(' ', '_')

    # Check both exact and case-insensitive lookups
    info = hastalik_bilgi.get(disease_key)
    if info is None:
        # Try partial matching for compound keys
        for key in hastalik_bilgi:
            if key.lower() in disease_key.lower() or disease_key.lower() in key.lower():
                info = hastalik_bilgi[key]
                break

    if info:
        disease_tr, description, recommendation = info
    else:
        is_healthy_flag = 'healthy' in disease_en.lower()
        disease_tr = 'Sağlıklı' if is_healthy_flag else disease_en
        description = ''
        recommendation = ''

    is_healthy = 'healthy' in disease_en.lower()

    return plant_tr, plant_en, disease_tr, disease_en, is_healthy, description, recommendation


def _translate_class_name_short(class_name_en: str) -> str:
    """Return a short Turkish translation of the class name: 'Bitki - Hastalık'."""
    plant_tr, _, disease_tr, _, is_healthy, _, _ = _translate_class_name(class_name_en)
    if is_healthy:
        return f"{plant_tr} - Sağlıklı"
    return f"{plant_tr} - {disease_tr}"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/classes', methods=['GET'])
def get_classes():
    try:
        class_names = _load_class_names()  # {index: class_name}
        classes = []
        for idx in sorted(class_names.keys()):
            cn = class_names[idx]
            plant_tr, plant_en, disease_tr, disease_en, is_healthy, desc, rec = _translate_class_name(cn)
            classes.append({
                'index': idx,
                'class_name': cn,
                'class_name_tr': _translate_class_name_short(cn),
                'plant': plant_tr,
                'plant_en': plant_en,
                'disease': disease_tr,
                'disease_en': disease_en,
                'is_healthy': is_healthy,
            })
        return jsonify({'classes': classes, 'count': len(classes)})
    except FileNotFoundError:
        return jsonify({'error': 'class_names.json bulunamadı'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/models', methods=['GET'])
def get_models():
    models = []
    for name in AVAILABLE_MODELS:
        path = os.path.join(MODEL_DIR, f'{name}.keras')
        models.append({
            'name': name,
            'exists': os.path.exists(path),
        })
    return jsonify({'models': models})


@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # --- Validate file ---------------------------------------------------
        if 'image' not in request.files:
            return jsonify({'error': 'Görüntü dosyası gerekli (image alanı)'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'Dosya seçilmedi'}), 400

        # --- Select model ----------------------------------------------------
        model_name = request.form.get('model', 'best_model_v4')
        if model_name not in AVAILABLE_MODELS:
            return jsonify({'error': f'Geçersiz model adı. Mevcut modeller: {AVAILABLE_MODELS}'}), 400

        model = _get_model(model_name)
        if model is None:
            return jsonify({'error': f'Model dosyası bulunamadı: {model_name}.keras'}), 404

        # --- Load class names ------------------------------------------------
        class_names = _load_class_names()

        # --- Preprocess image ------------------------------------------------
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((128, 128))
        img_array = np.array(image, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # --- Predict ---------------------------------------------------------
        predictions = model.predict(img_array, verbose=0)[0]

        # --- Top-5 -----------------------------------------------------------
        top_indices = np.argsort(predictions)[::-1][:5]
        top_predictions = []
        for idx in top_indices:
            cn = class_names[idx]
            top_predictions.append({
                'class_name': _translate_class_name_short(cn),
                'class_name_en': cn,
                'confidence': round(float(predictions[idx]) * 100, 2),
            })

        # --- Best prediction details -----------------------------------------
        best_idx = top_indices[0]
        best_class = class_names[best_idx]
        plant_tr, plant_en, disease_tr, disease_en, is_healthy, description, recommendation = _translate_class_name(best_class)

        return jsonify({
            'plant': plant_tr,
            'plant_en': plant_en,
            'disease': disease_tr,
            'disease_en': disease_en,
            'is_healthy': is_healthy,
            'confidence': round(float(predictions[best_idx]) * 100, 2),
            'description': description,
            'recommendation': recommendation,
            'top_predictions': top_predictions,
            'model_used': model_name,
        })

    except Exception as e:
        return jsonify({'error': f'Tahmin sırasında hata oluştu: {str(e)}'}), 500


@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    cache_path = os.path.join(BASE_DIR, 'metrics_cache.json')
    if not os.path.exists(cache_path):
        return jsonify({
            'status': 'not_ready',
            'message': 'Metrikler henüz hesaplanmadı. evaluate_models.py scriptini çalıştırın.',
        })
    try:
        with open(cache_path, 'r', encoding='utf-8') as f:
            metrics = json.load(f)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/metrics/<model_name>', methods=['GET'])
def get_model_metrics(model_name):
    cache_path = os.path.join(BASE_DIR, 'metrics_cache.json')
    if not os.path.exists(cache_path):
        return jsonify({
            'status': 'not_ready',
            'message': 'Metrikler henüz hesaplanmadı. evaluate_models.py scriptini çalıştırın.',
        })
    try:
        with open(cache_path, 'r', encoding='utf-8') as f:
            metrics = json.load(f)

        if model_name not in metrics.get('models', {}):
            available = list(metrics.get('models', {}).keys())
            return jsonify({'error': f'Model bulunamadı: {model_name}. Mevcut modeller: {available}'}), 404

        model_metrics = metrics['models'][model_name]
        return jsonify({
            'model_name': model_name,
            'evaluation_date': metrics.get('evaluation_date'),
            'dataset': metrics.get('dataset'),
            'num_classes': metrics.get('num_classes'),
            'class_names': metrics.get('class_names'),
            'class_names_tr': metrics.get('class_names_tr'),
            **model_metrics,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
