# 🌿 LeafScan — Plant Disease Detection

An AI-powered plant disease detection system. Upload a leaf photo to find out the plant species and its disease.

*(Türkçe versiyon için aşağı kaydırın / Scroll down for Turkish version)*

## 📋 About the Project

This project is a deep learning-based plant disease detection application. The models, trained using the MobileNetV2 architecture and transfer learning, can recognize 38 disease classes across 14 different plants.

### Features

- 🔬 **Leaf Analysis:** Upload a leaf photo to detect the plant species and disease
- 📊 **Model Metrics:** Detailed performance metrics such as Accuracy, Precision, Recall, F1-Score, WMAPE, ROC Curve
- 🔄 **Model Comparison:** Compare the performance of 4 different models side-by-side
- 📈 **Visualization:** Confusion Matrix, ROC curve, training charts, and more

## 🏗️ Architecture

```text
┌──────────────────┐     REST API     ┌──────────────────┐
│   React Frontend │ ◄──────────────► │   Flask Backend   │
│   (Vite :5173)   │                  │   (Python :5000)  │
└──────────────────┘                  └────────┬─────────┘
                                               │
                                    ┌──────────┴─────────┐
                                    │  Keras Models       │
                                    │  (MobileNetV2 x4)  │
                                    └────────────────────┘
```

### Technology Stack

| Layer | Technology |
|--------|-----------|
| **Frontend** | React 19, Vite, Recharts, Framer Motion, Lucide Icons |
| **Backend** | Flask, Flask-CORS |
| **Model** | TensorFlow/Keras, MobileNetV2 (Transfer Learning) |
| **Dataset** | PlantDoc Classification Dataset, PlantVillage Dataset (38 classes, ~54,000 images) | 
| **Evaluation** | scikit-learn |

## 🌱 Supported Plants and Diseases (38 Classes)

| Plant | Diseases |
|-------|-------------|
| 🍎 Apple | Apple scab, Black rot, Cedar apple rust, Healthy |
| 🫐 Blueberry | Healthy |
| 🍒 Cherry | Powdery mildew, Healthy |
| 🌽 Corn | Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy |
| 🍇 Grape | Black rot, Esca, Leaf blight, Healthy |
| 🍊 Orange | Huanglongbing |
| 🍑 Peach | Bacterial spot, Healthy |
| 🫑 Pepper | Bacterial spot, Healthy |
| 🥔 Potato | Early blight, Late blight, Healthy |
| 🫐 Raspberry | Healthy |
| 🌱 Soybean | Healthy |
| 🎃 Squash | Powdery mildew |
| 🍓 Strawberry | Leaf scorch, Healthy |
| 🍅 Tomato | Bacterial spot, Early blight, Late blight, Leaf Mold, Septoria leaf spot, Spider mites, Target Spot, Yellow Leaf Curl Virus, Mosaic virus, Healthy |

## 🚀 Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### 2. Calculating Model Metrics (First Time)

Run the following script to calculate model performance metrics. This process may take a while the first time:

```bash
cd backend
python evaluate_models.py
```

For a quick test (50 images per class):
```bash
python evaluate_models.py --quick
```

This command generates the `metrics_cache.json` file. Subsequent runs will read metrics from this file.

### 3. Frontend Setup

```bash
cd backend
npm install
```

## ▶️ Running the App

### 1. Start Backend

```bash
cd backend
python app.py
```

The backend runs at http://localhost:5000.

### 2. Start Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend runs at http://localhost:5173.

### 3. Open in Browser

Go to http://localhost:5173.

## 📖 Usage

### Leaf Analysis

1. Upload a leaf photo to the "Drag or click to upload a leaf photo" area on the home page
2. The application will analyze it automatically
3. The results will be displayed on the right panel:
   - Plant species (in English/Turkish)
   - Disease name (if any)
   - Model confidence score (%)
   - Top 5 predictions
   - Disease description and treatment recommendation

### Model Metrics

Click on the "Model Metrics" tab to access detailed performance analysis:

- **General Metrics:** Accuracy, Precision, Recall, F1-Score, WMAPE, AUC cards
- **Model Comparison:** Compare 4 models using bar and radar charts
- **Training Process:** Accuracy and Loss curves
- **Confusion Matrix:** 38×38 interactive heatmap
- **ROC Curve:** Multi-class ROC curves and AUC values
- **Class-based Table:** Sortable and filterable performance table
- **Error Analysis:** Class-based error rate chart

## 🔌 API Documentation

| Endpoint | Method | Description |
|----------|--------|----------|
| `/api/health` | GET | Health check |
| `/api/predict` | POST | Upload image → get prediction |
| `/api/classes` | GET | Supported class list |
| `/api/models` | GET | Available model list |
| `/api/metrics` | GET | Metrics of all models |
| `/api/metrics/<model>` | GET | Metrics of a single model |

### Predict API Example

```bash
curl -X POST -F "image=@leaf.jpg" -F "model=best_model_v4" http://localhost:5000/api/predict
```

## 📁 Project Structure

```text
bitki_projesi/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── evaluate_models.py     # Model evaluation script
│   ├── requirements.txt       # Python dependencies
│   └── metrics_cache.json     # Calculated metrics (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
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
│   ├── best_model_v4.keras    # Model v4 (default)
│   ├── class_names.json       # 38 class labels
│   ├── plantvillage/          # PlantVillage dataset
│   └── archive/               # Archive dataset
└── README.md
```

## 🧠 Model Information

### Architecture
- **Base Model:** MobileNetV2 (transfer learning with ImageNet weights)
- **Input Size:** 128×128 pixels, RGB
- **Output:** 38 classes (softmax)
- **Training:** Fine-tuning + data augmentation

### Models

| Model | File | Size | Description |
|-------|-------|-------|----------|
| v1 | `best_model.keras` | ~11 MB | Initial version |
| v2 | `best_model_v2.keras` | ~11 MB | Hyperparameter optimization |
| v3 | `best_model_v3.keras` | ~23 MB | Expanded architecture |
| v4 | `best_model_v4.keras` | ~23 MB | Final version (default) |

### Dataset
- **PlantVillage Dataset:** 38 classes, ~630 images per class, ~54,000 images in total
- **Train/Test Split:** 80% train, 20% test (stratified)

## 📄 License

This project was developed for educational purposes.

---

*LeafScan v2.0 · MobileNetV2 + Transfer Learning · PlantVillage Dataset · 2026*

--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------

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

```text
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

```text
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
