import { Search, Bell, User } from "lucide-react";

function Header() {
  return (
    <header className="header">

      <div>
        <h1>My Notes</h1>
        <p>Everything synced across your devices</p>
      </div>

      <div className="header-actions">

        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search notes..."
          />
        </div>

        <button>
          <Bell size={21} />
        </button>

        <div className="profile-icon">
          <User size={20} />
        </div>

      </div>

    </header>
  );
}

export default Header;