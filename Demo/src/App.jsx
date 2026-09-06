import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Pictures from './pages/Pictures';
import Profile from './pages/Profile';
function App(){return <BrowserRouter><div className="app-layout"><Sidebar/><main className="main-content"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/notes" element={<Notes/>}/><Route path="/pictures" element={<Pictures/>}/><Route path="/profile" element={<Profile/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main><BottomNav/></div></BrowserRouter>}
export default App;
