import { User, Cloud } from 'lucide-react';
export default function Profile(){return <div><div className="notes-header"><div><h1>Profile</h1><p>NoteCloud works without a login.</p></div></div><div className="profile-card"><div className="profile-avatar"><User size={35}/></div><div><h2>NoteCloud User</h2><p>Guest workspace</p></div><Cloud size={28}/></div></div>}
