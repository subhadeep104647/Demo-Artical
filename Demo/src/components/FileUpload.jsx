import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { uploadToStorage, removeFromStorage } from '../services/supabase';

const allowedExtensions = /\.(pdf|doc|docx)$/i;

export default function FileUpload({ attachments, setAttachments }) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!allowedExtensions.test(file.name)) {
      alert('Only PDF, DOC and DOCX files are allowed.');
      return;
    }

    setUploading(true);
    try {
      const { path, url } = await uploadToStorage('notes', file);
      setAttachments((current) => [
        ...current,
        { name: file.name, type: file.type, size: file.size, path, url },
      ]);
    } catch (error) {
      console.error('Supabase upload error:', error);
      alert(`Upload failed: ${error.message || 'Unable to connect to Supabase Storage.'}`);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (index) => {
    const file = attachments[index];
    try {
      if (file?.path) await removeFromStorage([file.path]);
      setAttachments((current) => current.filter((_, i) => i !== index));
    } catch (error) {
      alert(`Could not delete file: ${error.message}`);
    }
  };

  return (
    <div className="file-upload">
      <label className="upload-box">
        <Upload size={22} />
        <span>{uploading ? 'Uploading file...' : 'Upload PDF or Word file'}</span>
        <input
          hidden
          type="file"
          disabled={uploading}
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            uploadFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
      <div className="attachment-list">
        {attachments.map((file, index) => (
          <div className="attachment-item" key={file.path || index}>
            <FileText size={18} />
            <span>{file.name}</span>
            <button type="button" title="Remove file" onClick={() => removeAttachment(index)}>
              <X size={17} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
