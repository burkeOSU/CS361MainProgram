import PageTitle from "../components/PageTitle";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EditEntryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [text, setText] = useState('');

    const user = JSON.parse(document.cookie);

    useEffect(() => {
        const loadEntry = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/entries/${id}?user=${user.user}`);
                if (response.status === 200) {
                    const entry = await response.json();
                    setDate(entry.date);
                    setText(entry.text);
                } else if (response.status === 404) {
                    alert('ERROR: Entry not found.');
                    navigate('/');
                } else {
                    alert(`ERROR: Unexpected error ${response.status}`);
                    navigate('/');
                }
            } catch (err) {
                alert(`ERROR: There was a problem loading an entry: ${err.message}`);
                navigate('/')
            }
        };

        loadEntry();
    }, [id, navigate]);

    return (
        <>
            <PageTitle title="View Entry" />
            <div className="content">
                <table className="entry-table">
                    <tbody>
                        <tr>
                            <td className="DateBox">{date}</td>
                        </tr><tr>
                            <td className="TextBox"><pre>{text}</pre></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div >
                    <Link className="button" to="/history">Go Back</Link>
                    <div className="p-container inline">
                        <p>Click “Go Back” to return to the Entry History page.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditEntryPage;