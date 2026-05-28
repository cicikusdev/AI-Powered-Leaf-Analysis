# 🌿 LeafScan — Bitki Hastalığı Tespiti

Yapay zeka destekli bitki hastalığı tespit sistemi. Yaprak fotoğrafı yükleyin, bitkinin türünü ve hastalığını öğrenin.

## 📋 Proje Hakkında

Bu proje, derin öğrenme tabanlı bir bitki hastalığı tespit uygulamasıdır. MobileNetV2 mimarisi ve transfer learning kullanılarak eğitilmiş modeller, 14 farklı bitkiye ait 38 hastalık sınıfını tanıyabilmektedir.

### Özellikler

- 🔬 **Yaprak Analizi:** Yaprak fotoğrafı yükleyerek bitkinin türünü ve hastalığını tespit edin
- 📊 **Model Metrikleri:** Accuracy, Precision, Recall, F1-Score, WMAPE, ROC Curve gibi detaylı performans metrikleri
- 🔄 **Model Karşılaştırma:** 4 farklı modelin performansını yan yana karşılaştırın
- 📈 **Görselleştirme:** Confusion Matrix, ROC eğrisi, eğitim grafikleri ve daha fazlası

## 🏗️ Mimari

```
┌──────────────────┐     REST API     ┌──────────────────┐
│   React Frontend │ ◄──────────────► │   Flask Backend   │
│   (Vite :5173)   │                  │   (Python :5000)  │
└──────────────────┘                  └────────┬─────────┘
                                               │
                                    ┌──────────┴─────────┐
                                    │  Keras Modelleri    │
                                    │  (MobileNetV2 x4)  │
                                    └────────────────────┘
```

### Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 19, Vite, Recharts, Framer Motion, Lucide Icons |
| **Backend** | Flask, Flask-CORS |
| **Model** | TensorFlow/Keras, MobileNetV2 (Transfer Learning) |
| **Veri Seti** | PlantDoc Classification Dataset, PlantVillage Dataset (38 sınıf, ~54.000 görüntü) | 
| **Değerlendirme** | scikit-learn |

## 🌱 Desteklenen Bitkiler ve Hastalıklar (38 Sınıf)

| Bitki | Hastalıklar |
|-------|-------------|
| 🍎 Elma | Karaleke, Kara Çürüklük, Sedir Pası, Sağlıklı |
| 🫐 Yaban Mersini | Sağlıklı |
| 🍒 Kiraz | Küllü Mildiyö, Sağlıklı |
| 🌽 Mısır | Cercospora Yaprak Lekesi, Yaygın Pas, Kuzey Yaprak Yanıklığı, Sağlıklı |
| 🍇 Üzüm | Kara Çürüklük, Esca, Yaprak Yanıklığı, Sağlıklı |
| 🍊 Portakal | Huanglongbing |
| 🍑 Şeftali | Bakteriyel Leke, Sağlıklı |
| 🫑 Biber | Bakteriyel Leke, Sağlıklı |
| 🥔 Patates | Erken Yanıklık, Geç Yanıklık, Sağlıklı |
| 🫐 Ahududu | Sağlıklı |
| 🌱 Soya Fasulyesi | Sağlıklı |
| 🎃 Kabak | Küllü Mildiyö |
| 🍓 Çilek | Yaprak Yanması, Sağlıklı |
| 🍅 Domates | Bakteriyel Leke, Erken Yanıklık, Geç Yanıklık, Yaprak Küfü, Septoria, Kırmızı Örümcek, Hedef Leke, Sarı Yaprak Kıvırcıklık Virüsü, Mozaik Virüsü, Sağlıklı |

## 🚀 Kurulum

### Gereksinimler

- Python 3.9+
- Node.js 18+
- npm 9+

### 1. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
```

### 2. Model Metriklerini Hesaplama (İlk Kez)

Model performans metriklerini hesaplamak için aşağıdaki scripti çalıştırın. Bu işlem ilk seferde biraz sürebilir:

```bash
cd backend
python evaluate_models.py
```

Hızlı test için (sınıf başına 50 görüntü):
```bash
python evaluate_models.py --quick
```

Bu komut `metrics_cache.json` dosyası oluşturur. Sonraki çalıştırmalarda bu dosyadan metrikler okunur.

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
```

## ▶️ Çalıştırma

### 1. Backend'i Başlat

```bash
cd backend
python app.py
```

Backend http://localhost:5000 adresinde çalışır.

### 2. Frontend'i Başlat

Yeni bir terminal açın:

```bash
cd frontend
npm run dev
```

Frontend http://localhost:5173 adresinde çalışır.

### 3. Tarayıcıda Aç

http://localhost:5173 adresine gidin.

## 📖 Kullanım

### Yaprak Analizi

1. Ana sayfada "Yaprak fotoğrafı sürükleyin veya tıklayın" alanına bir yaprak fotoğrafı yükleyin
2. Uygulama otomatik olarak analiz eder
3. Sonuçlar sağ panelde görüntülenir:
   - Bitkinin türü (Türkçe)
   - Hastalık adı (varsa)
   - Model güven skoru (%)
   - En yüksek 5 tahmin
   - Hastalık açıklaması ve tedavi önerisi

### Model Metrikleri

"Model Metrikleri" sekmesine tıklayarak detaylı performans analizine erişin:

- **Genel Metrikler:** Accuracy, Precision, Recall, F1-Score, WMAPE, AUC kartları
- **Model Karşılaştırma:** 4 modelin performansını bar chart ve radar chart ile karşılaştırma
- **Eğitim Süreci:** Accuracy ve Loss eğrileri
- **Karışıklık Matrisi:** 38×38 interaktif heatmap
- **ROC Eğrisi:** Multi-class ROC eğrileri ve AUC değerleri
- **Sınıf Bazlı Tablo:** Sıralanabilir ve filtrelenebilir performans tablosu
- **Hata Analizi:** Sınıf bazlı hata oranı grafiği

## 🔌 API Dokümantasyonu

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/health` | GET | Sağlık kontrolü |
| `/api/predict` | POST | Görüntü yükle → tahmin al |
| `/api/classes` | GET | Desteklenen sınıf listesi |
| `/api/models` | GET | Mevcut model listesi |
| `/api/metrics` | GET | Tüm modellerin metrikleri |
| `/api/metrics/<model>` | GET | Tek model metrikleri |

### Predict API Örneği

```bash
curl -X POST -F "image=@yaprak.jpg" -F "model=best_model_v4" http://localhost:5000/api/predict
```

## 📁 Proje Yapısı

```
bitki_projesi/
├── backend/
│   ├── app.py                 # Flask API sunucusu
│   ├── evaluate_models.py     # Model değerlendirme scripti
│   ├── requirements.txt       # Python bağımlılıkları
│   └── metrics_cache.json     # Hesaplanmış metrikler (otomatik oluşur)
├── frontend/
│   ├── src/
│   │   ├── components/        # React bileşenleri
│   │   │   ├── Navbar.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── ConfidenceBar.jsx
│   │   │   ├── TopPredictions.jsx
│   │   │   ├── MetricCards.jsx
│   │   │   ├── ConfusionMatrix.jsx
│   │   │   ├── RocCurve.jsx
│   │   │   ├── TrainingChart.jsx
│   │   │   ├── ClassMetricsTable.jsx
│   │   │   ├── ModelComparison.jsx
│   │   │   └── WmapeChart.jsx
│   │   ├── pages/
│   │   │   ├── AnalysisPage.jsx
│   │   │   └── MetricsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── bitki_projesi_model/
│   ├── best_model.keras       # Model v1
│   ├── best_model_v2.keras    # Model v2
│   ├── best_model_v3.keras    # Model v3
│   ├── best_model_v4.keras    # Model v4 (varsayılan)
│   ├── class_names.json       # 38 sınıf etiketleri
│   ├── plantvillage/          # PlantVillage veri seti
│   └── archive/               # Archive veri seti
└── README.md
```

## 🧠 Model Bilgileri

### Mimari
- **Temel Model:** MobileNetV2 (ImageNet ağırlıkları ile transfer learning)
- **Giriş Boyutu:** 128×128 piksel, RGB
- **Çıkış:** 38 sınıf (softmax)
- **Eğitim:** Fine-tuning + data augmentation

### Modeller

| Model | Dosya | Boyut | Açıklama |
|-------|-------|-------|----------|
| v1 | `best_model.keras` | ~11 MB | İlk versiyon |
| v2 | `best_model_v2.keras` | ~11 MB | Hiperparametre optimizasyonu |
| v3 | `best_model_v3.keras` | ~23 MB | Genişletilmiş mimari |
| v4 | `best_model_v4.keras` | ~23 MB | Son versiyon (varsayılan) |

### Veri Seti
- **PlantVillage Dataset:** 38 sınıf, sınıf başına ~630 görüntü, toplam ~54.000 görüntü
- **Eğitim/Test Ayrımı:** %80 eğitim, %20 test (stratified)

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

*LeafScan v2.0 · MobileNetV2 + Transfer Learning · PlantVillage Dataset · 2026*
