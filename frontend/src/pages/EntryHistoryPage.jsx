import PageTitle from "../components/PageTitle";
import { useEffect, useState } from 'react';
import EntryRow from '../components/EntryRow';

function HomePage() {
    const [entries, setEntries] = useState([]);

    const user = JSON.parse(document.cookie);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/entries?user=${user.user}`);
                const data = await response.json();
                setEntries(data);
            } catch (err) {
                console.error('ERROR: Fetching entries failed.', err);
            }
        };
        fetchEntries();
    }, []);

    return (
        <>
            <div>
                <PageTitle title="Entry History" user="ty" />
                <div className="p-container content">
                    <p>To create a new entry, click the “Create” button</p>
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
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default HomePage;