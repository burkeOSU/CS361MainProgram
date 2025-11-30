import { Link, useNavigate } from "react-router-dom";

function Navigation({ onClick }) {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();

    // handle logout button click
    const confirmed = window.confirm(
      'Are you sure you want to logout? Click "OK" or "Cancel"'
    );
    if (!confirmed) return;

    // logout, clear cookies, return to login page
    document.cookie = "";
    navigate("/login");
  };

  return (
    <nav className="nav-links">
      <Link to="/create" onClick={onClick}>
        Create
      </Link>
      <Link to="/history" onClick={onClick}>
        History
      </Link>
      <Link to="/ranking" onClick={onClick}>
        Top 10 Words
      </Link>
      <Link to="/contact" onClick={onClick}>
        Contact Us
      </Link>

      <a
        className="button"
        style={{ backgroundColor: "#f9cb9c" }}
        href="/logout"
        onClick={handleLogout}
      >
        Logout
      </a>
    </nav>
  );
}

export default Navigation;
