import { Link } from 'react-router-dom';

function Navigation({ onClick }) {
    return (
        <nav className="nav-links">
            <Link to="/create" onClick={onClick}>Create</Link>
            <Link to="/history" onClick={onClick}>History</Link>
            <Link to="/contact" onClick={onClick}>Contact Us</Link>
        </nav>
    );
}

export default Navigation;