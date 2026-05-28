import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ImageUpload({ onImageSelect, selectedImage }) {
  const { t } = useLanguage()
  const [preview, setPreview] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
      })
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
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
    onImageSelect(null)
  }

  return (
    <div className="upload-panel">
      <div className="upload-panel-title">
        <ImageIcon size={20} className="icon" />
        {t('upload_panel_title')}
      </div>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-icon">
            <Upload size={24} />
          </div>
          <p className="dropzone-text">
            {isDragActive
              ? t('dropzone_drag')
              : t('dropzone_default')}
          </p>
          <p className="dropzone-subtext">{t('dropzone_subtext')}</p>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={preview} alt={t('image_alt')} className="image-preview" />
          <div className="image-preview-overlay">
            <div className="image-preview-info">
              {fileInfo?.name}
              <span>{fileInfo?.size}</span>
            </div>
            <button className="btn-remove" onClick={handleClear} title={t('btn_remove_title')}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
