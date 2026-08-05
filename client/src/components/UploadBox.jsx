import { useState, useRef } from 'react';

export default function UploadBox({ onSubmit, loading }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Sirf image files allowed hain (PNG, JPEG, GIF, WebP)');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleUpload = async () => {
    if (!selectedFile || loading) return;

    let ocrText = '';

    // Client-side OCR with Tesseract.js (if available)
    if (window.Tesseract) {
      setOcrStatus('OCR chal raha hai...');
      try {
        const result = await window.Tesseract.recognize(selectedFile, 'eng+hin');
        ocrText = result.data.text || '';
        setOcrStatus('OCR done!');
      } catch {
        setOcrStatus('OCR skip ho gaya');
      }
    }

    // Build FormData and submit
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('ocrText', ocrText);

    onSubmit(formData);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setOcrStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          📷 Meme Upload Karo
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Screenshot ya meme image upload karo, hum pehchaan ke batayenge!
        </p>
      </div>

      {!preview ? (
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📸</div>
          <p className="text-[var(--text-secondary)] mb-1">
            Yahan drag karo ya click karke select karo
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            PNG, JPEG, GIF, WebP — max 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="glass-card p-4 animate-fadeIn">
          {/* Preview */}
          <div className="relative mb-3">
            <img
              src={preview}
              alt="Selected meme"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.6)] text-white text-sm flex items-center justify-center hover:bg-[var(--accent-primary)] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* File info */}
          <p className="text-xs text-[var(--text-muted)] mb-3">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>

          {/* OCR Status */}
          {ocrStatus && (
            <p className="text-xs text-[var(--accent-green)] mb-3">{ocrStatus}</p>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? '⏳ Pehchaan rahe hain…' : '🔍 Ye Meme Pehchano!'}
          </button>
        </div>
      )}
    </div>
  );
}
