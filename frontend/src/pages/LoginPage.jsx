import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginInfo = {
            user,
            pass
        };

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                body: JSON.stringify(loginInfo),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const resp = await response.text();
                document.cookie = resp;
                navigate('/history');
            } else {
                console.log(response);
                alert(`ERROR: Login failed! Status code: ${response.status}`);
            }
        } catch (err) {
            alert(`ERROR: ${err.message}`);
        }
    };
    return (
        <>
            <header>
                <h1>Mood.e</h1>
            </header>

            <div className="content">
                <div className="p-container">
                    <p>Create and manage your journal entries</p>
                    <p>So you can track your thoughts,</p>
                    <p>day by day.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ border: "none" }}><input className="TextBox" value={user} onChange={e => setUser(e.target.value)} placeholder="Username" required /></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none" }}><input className="TextBox" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit">Login</button>
                </form >
            </div>
        </>
    );
}

export default LoginPage;