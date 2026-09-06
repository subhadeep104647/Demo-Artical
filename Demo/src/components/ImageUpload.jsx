import { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadToStorage } from '../services/supabase';

export default function ImageUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    setUploading(true);
    try {
      const { path, url } = await uploadToStorage('pictures', file);
      await onUploaded({ name: file.name, type: file.type, size: file.size, path, url });
    } catch (error) {
      console.error('Supabase upload error:', error);
      alert(`Upload failed: ${error.message || 'Unable to connect to Supabase Storage.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="upload-box picture-upload">
      <Upload size={22} />
      <span>{uploading ? 'Uploading picture...' : 'Upload picture'}</span>
      <input
        hidden
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}
