import streamlit as st
import numpy as np
import cv2
import json
from PIL import Image
from tensorflow.keras.models import load_model
from streamlit_cropper import st_cropper

model = load_model("best_model_v4.keras")
with open("class_names.json", "r") as f:
    class_indices = json.load(f)
sinif_listesi = {v: k for k, v in class_indices.items()}

hastalik_bilgi = {
    "healthy": ("Sağlıklı", "Bu yaprak sağlıklı görünüyor. Herhangi bir hastalık belirtisi tespit edilmedi."),
    "Early_blight": ("Erken Yanıklık", "Alternaria mantarının neden olduğu bir hastalık. Yapraklarda koyu kahverengi halkalar oluşur."),
    "Late_blight": ("Geç Yanıklık", "Phytophthora infestans hastalığı. Yapraklarda gri-kahverengi lekeler görülür."),
    "Leaf_scorch": ("Yaprak Yanması", "Yaprak kenarlarından başlayan kahverengileşme. Su stresi veya mantar kaynaklıdır."),
    "Black_rot": ("Kara Çürüklük", "Mantar enfeksiyonu. Yapraklarda siyah lekeler oluşur."),
    "Common_rust": ("Yaygın Pas", "Puccinia sorghi mantarı. Yapraklarda turuncu-kahverengi lekeler görülür."),
    "Bacterial_spot": ("Bakteriyel Leke", "Xanthomonas bakterisi. Küçük koyu lekeler ve sararma görülür."),
    "Septoria_leaf_spot": ("Septoria Yaprak Lekesi", "Küçük yuvarlak lekeler ve sarı çember oluşur."),
    "mosaic_virus": ("Mozaik Virüsü", "Yapraklarda sarı-yeşil mozaik desen. Virüs yaprak biti ile yayılır."),
    "Powdery_mildew": ("Küllü Mildiyö", "Yaprak yüzeyinde beyaz pudra görünümlü mantar."),
    "Apple_scab": ("Elma Karalekesi", "Venturia inaequalis mantarı. Yapraklarda koyu lekeler oluşur."),
    "Cedar_apple_rust": ("Sedir Elma Pası", "Gymnosporangium mantarı. Sarı-turuncu lekeler görülür."),
    "Cercospora": ("Cercospora Yaprak Lekesi", "Gri merkezli koyu kenarlıklı lekeler oluşur."),
    "Northern_Leaf_Blight": ("Kuzey Yaprak Yanıklığı", "Uzun eliptik grimsi lekeler oluşur."),
}

def hastalik_acikla(sinif):
    for anahtar, deger in hastalik_bilgi.items():
        if anahtar.lower() in sinif.lower():
            return deger
    return (sinif.replace("_", " "), "Bu hastalık hakkında detaylı bilgi için bir uzmana danışın.")

def goruntu_hazirla(img):
    img = cv2.resize(img, (128, 128))
    img = img / 255.0
    return np.expand_dims(img, axis=0)

st.set_page_config(
    page_title="LeafScan",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.markdown("""
<style>
#MainMenu, footer, header {visibility: hidden;}
.block-container {padding: 2rem 3rem !important; max-width: 1200px !important; margin: 0 auto !important;}
h1 {font-size: 2rem !important; font-weight: 700 !important;}
.stFileUploader > label {display: none;}
</style>
""", unsafe_allow_html=True)

# Başlık
st.markdown("## 🌿 LeafScan — Bitki Hastalığı Tespiti")
st.caption("Yapay zeka destekli yaprak analizi · MobileNetV2 · %97 doğruluk · 38 hastalık sınıfı")
st.divider()

col1, col2 = st.columns([1.3, 1], gap="large")

with col1:
    st.markdown("### 📸 Görüntü Yükle")
    uploaded = st.file_uploader("Yaprak fotoğrafı seç", type=["jpg", "jpeg", "png"])

    if uploaded:
        image = Image.open(uploaded).convert("RGB")
        w, h = image.size
        if max(w, h) > 700:
            r = 700 / max(w, h)
            image = image.resize((int(w*r), int(h*r)))

        st.markdown("**Yaprağı çerçeve içine al:**")
        islenmis = st_cropper(image, realtime_update=True, box_color="#16a34a", aspect_ratio=None)

        st.write("")
        col_prev, col_info = st.columns([1, 1])
        with col_prev:
            st.image(islenmis, caption="Seçilen alan", use_container_width=True)
        with col_info:
            st.markdown(f"""
            **Orijinal boyut**  
            {w} × {h} px

            **Seçilen boyut**  
            {islenmis.size[0]} × {islenmis.size[1]} px
            """)

with col2:
    st.markdown("### 🔬 Analiz Sonucu")

    if not uploaded:
        st.info("👈 Sol taraftan bir yaprak fotoğrafı yükleyin.")
        st.write("")
        st.markdown("""
        **Nasıl çalışır?**

        1. Yaprak fotoğrafı yükle  
        2. Çerçeveyle yaprağı işaretle  
        3. Yapay zeka analiz etsin  
        4. Hastalık tespiti ve açıklama al  
        """)
    else:
        img_array = np.array(islenmis)
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        with st.spinner("Analiz ediliyor..."):
            hazir = goruntu_hazirla(img_bgr)
            tahmin = model.predict(hazir, verbose=0)[0]
            en_yuksek = float(np.max(tahmin))
            sinif_idx = int(np.argmax(tahmin))
            sinif = sinif_listesi[sinif_idx]

        guven = round(en_yuksek * 100, 1)

        if en_yuksek < 0.50:
            st.warning("⚠️ Görüntü tanınamadı. Net çekilmiş, desteklenen bir bitkiye ait yaprak yükleyin.")
        else:
            parcalar = sinif.split("__")
            bitki = parcalar[0].replace("_", " ")
            hastalik_kodu = parcalar[-1] if len(parcalar) > 1 else "healthy"
            hastalik_adi, aciklama = hastalik_acikla(hastalik_kodu)

            if "healthy" in sinif.lower():
                st.success(f"✅ **Sağlıklı Yaprak**")
                st.markdown(f"**Bitki:** {bitki}")
            else:
                st.error(f"⚠️ **{hastalik_adi}**")
                st.markdown(f"**Bitki:** {bitki}")

            st.write("")
            st.markdown(f"**Model Güveni: {guven}%**")
            st.progress(en_yuksek)

            st.write("")
            st.markdown("**Hastalık Bilgisi**")
            st.markdown(aciklama)

            if "healthy" not in sinif.lower():
                st.write("")
                st.markdown("**Öneri**")
                st.markdown("Etkilenen yaprakları uzaklaştırın ve bir tarım uzmanına danışın.")

st.divider()

with st.expander("📋 Desteklenen bitkiler ve hastalıklar (38 sınıf)"):
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("""
        🍎 **Elma** — Karaleke, Kara çürüklük, Sedir pası, Sağlıklı  
        🫐 **Yaban mersini** — Sağlıklı  
        🍒 **Kiraz** — Küllü mildiyö, Sağlıklı  
        🌽 **Mısır** — Cercospora, Yaygın pas, Yanıklık, Sağlıklı  
        🍇 **Üzüm** — Kara çürüklük, Esca, Yanıklık, Sağlıklı  
        🍊 **Portakal** — Huanglongbing  
        🍑 **Şeftali** — Bakteriyel leke, Sağlıklı  
        """)
    with c2:
        st.markdown("""
        🫑 **Biber** — Bakteriyel leke, Sağlıklı  
        🥔 **Patates** — Erken yanıklık, Geç yanıklık, Sağlıklı  
        🌱 **Soya fasulyesi** — Sağlıklı  
        🎃 **Kabak** — Küllü mildiyö  
        🍓 **Çilek** — Yaprak yanması, Sağlıklı  
        🍅 **Domates** — Bakteriyel leke, Erken/Geç yanıklık, Yaprak küfü, Septoria, Mozaik virüsü, Sağlıklı  
        """)

st.caption("LeafScan v1.0 · MobileNetV2 + Transfer Learning + PlantDoc Fine-tuning · 2026")