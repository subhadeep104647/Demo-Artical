import { useEffect, useState } from 'react';
import { Plus, Search, FileText, Trash2, X, Download, Paperclip } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { removeFromStorage } from '../services/supabase';
import FileUpload from '../components/FileUpload';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert(`Could not load notes: ${error.message}`);
      setLoading(false);
    });
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setTitle('');
    setContent('');
    setAttachments([]);
  };

  const openCreate = () => {
    setTitle('');
    setContent('');
    setAttachments([]);
    setShowModal(true);
  };

  const save = async () => {
    if (!title.trim()) return alert('Please enter a note title.');
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await addDoc(collection(db, 'notes'), {
        title: title.trim(),
        content,
        attachments,
        createdAt: now,
        updatedAt: now,
      });
      closeModal();
    } catch (error) {
      alert(`Could not save note: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (note) => {
    if (!window.confirm('Delete this note permanently?')) return;
    try {
      // Remove the files first, then remove the Firestore metadata.
      await removeFromStorage((note.attachments || []).map((file) => file.path));
      await deleteDoc(doc(db, 'notes', note.id));
    } catch (error) {
      console.error('Delete note error:', error);
      alert(`Could not delete note: ${error.message || 'Unknown error'}`);
    }
  };

  const download = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filtered = notes.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase())
  );

  return <div className="notes-page">
    <div className="notes-header"><div><h1>My Notes</h1><p>Add notes, delete notes, and attach PDF or Word files.</p></div><button className="new-note-btn" onClick={openCreate}><Plus size={20} />New Note</button></div>
    <div className="notes-search"><Search size={20} /><input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
    {loading ? <p>Loading notes...</p> : filtered.length === 0 ? <div className="empty-state"><FileText size={50} /><h2>No notes found</h2><p>Create your first note.</p><button className="new-note-btn" onClick={openCreate}><Plus size={18} />Create Note</button></div> : <div className="notes-grid">{filtered.map((note) => <div className="note-card" key={note.id}><div className="note-card-top"><div className="note-icon"><FileText size={24} /></div><span className="attachment-count"><Paperclip size={14} />{note.attachments?.length || 0}</span></div><h3>{note.title}</h3><p className="note-preview">{note.content || 'No content'}</p>{note.attachments?.length > 0 && <div className="card-files">{note.attachments.map((file, i) => <button key={file.path || i} className="file-link" onClick={() => download(file)}><Download size={14} />{file.name}</button>)}</div>}<div className="note-footer"><span>{new Date(note.updatedAt).toLocaleDateString()}</span><div className="note-actions"><button title="Delete" onClick={() => deleteNote(note)}><Trash2 size={17} /></button></div></div></div>)}</div>}
    {showModal && <div className="modal-overlay"><div className="note-modal"><div className="modal-header"><h2>Create Note</h2><button onClick={closeModal}><X /></button></div><input className="note-title-input" placeholder="Note title..." value={title} onChange={(e) => setTitle(e.target.value)} /><textarea placeholder="Write your note..." value={content} onChange={(e) => setContent(e.target.value)} /><FileUpload attachments={attachments} setAttachments={setAttachments} /><button className="save-note-btn" disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Create Note'}</button></div></div>}
  </div>;
}
