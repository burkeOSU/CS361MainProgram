import PageTitle from "../components/PageTitle";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function wordRanking() {
    const navigate = useNavigate();
    const user = JSON.parse(document.cookie);
    const [words, setWords] = useState([]);

    useEffect(() => {
        async function loadRanking() {
            try {
                const response = await fetch(`http://localhost:3000/api/entries/ranking?user=${user.user}`);

                const data = await response.json();
                setWords(data);
            } catch (err) {
                console.error("Failed to fetch word ranking", err);
            }
        }
    loadRanking();
    }, []);

    const handleClick = (word) => {
        navigate(`/search/${word}`);
    }

    return (
        <>
            <PageTitle title={"Top 10 Words"}/>
            <Link className="button" to="/history">Go Back</Link>
                <div className="p-container inline">
                    <p>Click “Go Back” to return to the Entry History page.</p>
                </div>
            <div className="content">
                <div className="p-container">
                    <p>Here are the 10 most frequently used words from all your entries!</p>
                    <p>Click a word to search all entries containing said word.</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="DateBox">Rank</th>
                            <th className="ButtonBox">Word</th>
                            <th className="TextBox">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map((pair, index) => (
                            <tr key={index}>
                                <td className="DateBox">{index + 1}</td>

                                <td
                                    className="ButtonBox"
                                    style={{ cursor: "pointer", fontWeight: "normal" }}
                                    onClick={() => handleClick(pair[0])}
                                >
                                    {pair[0]}
                                </td>
                                <td className="TextBox">{pair[1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}


export default wordRanking;