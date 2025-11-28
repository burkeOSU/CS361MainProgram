import PageTitle from "../components/PageTitle";
import { useEffect, useState } from 'react';
import EntryRow from '../components/EntryRow';

function HomePage() {
    const [entries, setEntries] = useState([]);

    const user = JSON.parse(document.cookie); // assuming cookie really is JSON

    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/entries?user=${user.user}`);
            const data = await response.json();
            setEntries(data);
        } catch (err) {
            console.error('ERROR: Fetching entries failed.', err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Warning: This action is irreversible!");
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:3000/api/entries/${id}?user=${user.user}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                await fetchEntries();  // ✅ now this works
            } else {
                const err = await response.json().catch(() => ({}));
                alert(`ERROR: Failed to delete entry. (${response.status}) ${err.error || ''}`);
            }
        } catch (err) {
            alert(`ERROR: ${err.message}`);
        }
    };

    return (
        <div>
            <PageTitle title="Entry History" user="ty" />
            <div className="p-container content">
                <p>To create a new entry, click the “Create” button</p>
                <p>Click on an entry's mood, such as "Mood: happy", to filter all entries by a selected mood.</p>
                <p>To view a previous entry, click the “View entry” button next to the entry you wish to view.</p>
                <p>If you have any questions, click the “Contact us” button.</p>
            </div>
            <div className="content">
                <table className="entry-table">
                    <tbody>
                        {entries.map((entry, i) => (
                            <EntryRow
                                key={i}
                                entry={entry}
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;
