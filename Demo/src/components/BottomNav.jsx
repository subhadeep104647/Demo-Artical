import {
  Home,
  FileText,
  Image,
  Plus,
  User
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

function BottomNav() {
  const navigate =
    useNavigate();

  return (
    <nav className="bottom-nav">

      <NavLink to="/">
        <Home size={21} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/notes">
        <FileText size={21} />
        <span>Notes</span>
      </NavLink>

      <button
        className="add-button"
        onClick={() =>
          navigate("/notes")
        }
      >
        <Plus size={25} />
      </button>

      <NavLink to="/pictures">
        <Image size={21} />
        <span>Pictures</span>
      </NavLink>

      <NavLink to="/profile">
        <User size={21} />
        <span>Profile</span>
      </NavLink>

    </nav>
  );
}

export default BottomNav;