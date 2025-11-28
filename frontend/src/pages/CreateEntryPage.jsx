import PageTitle from "../components/PageTitle";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEntryPage() {
    const [text, setText] = useState('');
    const [mood, setMood] = useState('none');

    const user = JSON.parse(document.cookie);

    const navigate = useNavigate();

    const handleClick = (event) => {
        let LeaveConfirmed = window.confirm('Are you sure you want to leave this page? Clicking “OK” will clear this entry.');
        if (LeaveConfirmed) {
        } else {
            event.preventDefault();
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let SubmitConfirmed = window.confirm('Are you ready to submit your entry? Click "OK" or "Cancel".');
        if (SubmitConfirmed) {

            // Entry uses Get Date/Time microservice, does not add date manually
            // Entry uses mood tag 
            const newEntry = {text, mood};

            try {
                const response = await fetch(`http://localhost:3000/api/entries?user=${user.user}`, {
                    method: 'POST',
                    body: JSON.stringify(newEntry),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 201) {
                    navigate('/history');
                } else {
                    alert(`ERROR: Failed to create entry! Status code: ${response.status}`);
                    navigate('/');
                }
            } catch (err) {
                alert(`ERROR: ${err.message}`);
            }

        }
    }

    return (
        <>
            <PageTitle title="Create Entry" onClick={handleClick} />
            <div className="content">
                <div className="p-container content">
                    <p>Enter text in the text box.</p>
                    <p>To undo typed text, select “Ctrl+Z” on your keyboard. <br></br>To redo typed text, select “Ctrl+Y” on your keyboard.</p>
                    <p>When you are ready to submit your entry, click the “Submit” button.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                {/* Mood tag dropdown */}
                                <td style={{ border: "none" }}>
                                    <select value={mood} onChange={e => setMood(e.target.value)}>
                                        <option value="none">none</option>
                                        <option value="happy">happy</option>
                                        <option value="neutral">neutral</option>
                                        <option value="sad">sad</option>
                                        <option value="angry">angry</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ background: "transparent", border: "none" }}><textarea className="TextBox InputText" value={text} onChange={e => setText(e.target.value)} placeholder="Input text here..." required /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit">Submit</button>
                </form >
            </div>
        </>
    );
}

export default CreateEntryPage;