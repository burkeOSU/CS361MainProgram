import { Link } from 'react-router-dom';

function EntryRow({ entry, onDelete }) {
    return (
        <>
            <tr>
                <td className="DateBox">{entry.date}</td>
                <td className="MoodBox">
                    <Link to={`/filter/${entry.mood}`}
                    style={{ textDecoration: "none", color: "inherit" }}>
                    Mood: {entry.mood}</Link></td>
                <td className="ButtonBox">
                    <Link to={`/view/${entry.id}`} title="View" style={{ color: "inherit", textDecoration: "none" }} >View Entry</Link>
                </td>
            </tr><tr>
                <td className="TextBox" colSpan="2"><pre>{entry.text}</pre></td>
            </tr><tr>
            </tr>
            <Link className="button" style={{ marginRight: "0.5rem" }} to={`/edit/${entry.id}`}>Edit</Link>
            <button className="button" style={{ marginRight: "0.5rem" }} onClick={() => onDelete(entry.id)}>Delete</button>
            <tr>
                <td colSpan="2" style={{ background: "transparent", border: "none" }}></td>
            </tr>
        </>
    );
}

export default EntryRow;