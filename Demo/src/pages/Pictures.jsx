import { useEffect, useState } from 'react';
import { Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { removeFromStorage } from '../services/supabase';
import ImageUpload from '../components/ImageUpload';

export default function Pictures() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'pictures'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert(`Could not load pictures: ${error.message}`);
      setLoading(false);
    });
  }, []);

  const uploaded = async (file) => {
    try {
      await addDoc(collection(db, 'pictures'), { ...file, createdAt: new Date().toISOString() });
    } catch (error) {
      await removeFromStorage([file.path]).catch(() => {});
      throw error;
    }
  };

  const remove = async (image) => {
    if (!window.confirm('Delete this picture permanently?')) return;
    try {
      await removeFromStorage([image.path]);
      await deleteDoc(doc(db, 'pictures', image.id));
    } catch (error) {
      alert(`Could not delete picture: ${error.message}`);
    }
  };

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return <div><div className="notes-header"><div><h1>Pictures</h1><p>Upload, delete and download your pictures.</p></div></div><ImageUpload onUploaded={uploaded} />{loading ? <p>Loading pictures...</p> : images.length === 0 ? <div className="empty-state"><ImageIcon size={50} /><h2>No pictures yet</h2><p>Upload your first picture.</p></div> : <div className="images-grid">{images.map((image) => <div className="image-card" key={image.id}><img src={image.url} alt={image.name} /><div className="image-info"><strong>{image.name}</strong><div><button title="Download" onClick={() => download(image)}><Download size={18} /></button><button title="Delete" onClick={() => remove(image)}><Trash2 size={18} /></button></div></div></div>)}</div>}</div>;
}
