import { Link } from 'react-router-dom';

function EntryRow({ entry }) {
    return (
        <>
            <tr>
                <td className="DateBox">{entry.date}</td>
                <td className="ButtonBox">
                    <Link to={`/view/${entry.id}`} title="View" style={{ color: "inherit", textDecoration: "none" }} >View Entry</Link>
                </td>
            </tr><tr>
                <td className="TextBox" colSpan="2"><pre>{entry.text}</pre></td>
            </tr><tr>
                <td colSpan="2" style={{ background: "transparent", border: "none" }}></td>
            </tr>
        </>
    );
}

export default EntryRow;