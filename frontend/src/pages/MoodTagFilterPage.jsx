import PageTitle from "../components/PageTitle";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EntryRow from "../components/EntryRow";

function MoodTagFilter() {
    const { mood } = useParams();
    const user = JSON.parse(document.cookie);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function loadEntries() {
            try {
                const response = await fetch(`http://localhost:3000/api/entries/filter?user=${user.user}&mood=${mood}`);

                const data = await response.json();
                setEntries(data);
            } catch (err) {
                console.error("Failed to fetch entries:", err);
            }
        }
    loadEntries();
    }, [mood, user.user]);

    return (
        <>
            <PageTitle title={`Posts tagged "${mood}"`}/>
            <div>
                <Link className="button" to="/history">Go Back</Link>
                    <div className="p-container inline">
                        <p>Click “Go Back” to return to the Entry History page.</p>
                    </div>
                <div className="content">
                    <table>
                        <tbody>
                            {entries.map((entry, i) => (<EntryRow key={i} entry={entry} />))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MoodTagFilter;