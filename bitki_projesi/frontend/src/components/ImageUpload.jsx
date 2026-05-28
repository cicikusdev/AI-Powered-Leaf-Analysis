import { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Upload, X, Image as ImageIcon, Scissors } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function centerAspectCrop(mediaWidth, mediaHeight) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  )
}

function ImageUpload({ onImageSelect, selectedImage, loading }) {
  const { t } = useLanguage()
  const [preview, setPreview] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [isCropping, setIsCropping] = useState(false)
  const imgRef = useRef(null)
  const originalFileRef = useRef(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      originalFileRef.current = file
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
      })
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
        setIsCropping(false)
        setCrop(undefined)
        setCompletedCrop(undefined)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  const handleClear = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileInfo(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setIsCropping(false)
    originalFileRef.current = null
    onImageSelect(null)
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }

  const handleStartCrop = () => setIsCropping(true)

  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) return
    const canvas = document.createElement('canvas')
    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const croppedFile = new File([blob], fileInfo?.name || 'cropped.jpg', { type: 'image/jpeg' })
      const croppedUrl = URL.createObjectURL(blob)
      setPreview(croppedUrl)
      setIsCropping(false)
      setCrop(undefined)
      setCompletedCrop(undefined)
      onImageSelect(croppedFile)
    }, 'image/jpeg', 0.95)
  }

  const handleCancelCrop = () => {
    setIsCropping(false)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  return (
    <div className="upload-panel">
      <div className="upload-panel-title">
        <ImageIcon size={20} className="icon" />
        {t('upload_panel_title')}
      </div>

      {!preview ? (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-icon">
            <Upload size={24} />
          </div>
          <p className="dropzone-text">
            {isDragActive ? t('dropzone_drag') : t('dropzone_default')}
          </p>
          <p className="dropzone-subtext">{t('dropzone_subtext')}</p>
        </div>
      ) : (
        <div className="image-preview-container">
          {isCropping ? (
            <div style={{ padding: '8px' }}>
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} style={{ maxWidth: '100%' }}>
                <img ref={imgRef} src={preview} alt="crop" onLoad={onImageLoad} style={{ maxWidth: '100%', maxHeight: '340px', display: 'block' }} />
              </ReactCrop>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={handleApplyCrop} style={{ flex: 1, padding: '8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit' }}>
                  ✅ Kırpmayı Uygula
                </button>
                <button onClick={handleCancelCrop} style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Görsel + tarama animasyonu */}
              <div style={{ position: 'relative' }}>
                <img src={preview} alt={t('image_alt')} className="image-preview" />

                {/* Tarama animasyonu - sadece loading sırasında */}
                {loading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'rgba(22,163,74,0.05)',
                  }}>
                    {/* Tarama çizgisi */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, rgba(22,163,74,0.8), transparent)',
                      animation: 'scan-line 1.5s ease-in-out infinite',
                      boxShadow: '0 0 12px rgba(22,163,74,0.5)',
                    }} />
                    {/* Köşe efektleri */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: '2px solid #16a34a', borderLeft: '2px solid #16a34a', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: '2px solid #16a34a', borderRight: '2px solid #16a34a', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: '2px solid #16a34a', borderLeft: '2px solid #16a34a', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: '2px solid #16a34a', borderRight: '2px solid #16a34a', borderRadius: '2px' }} />
                    {/* Analiz metni */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(4px)',
                    }}>
                      🔍 Analiz ediliyor...
                    </div>
                  </div>
                )}
              </div>

              <div className="image-preview-overlay">
                <div className="image-preview-info">
                  {fileInfo?.name}
                  <span>{fileInfo?.size}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!loading && (
                    <button className="btn-remove" onClick={handleStartCrop} title="Yaprağı kırp" style={{ background: '#16a34a' }}>
                      <Scissors size={16} />
                    </button>
                  )}
                  {!loading && (
                    <button className="btn-remove" onClick={handleClear} title={t('btn_remove_title')}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
