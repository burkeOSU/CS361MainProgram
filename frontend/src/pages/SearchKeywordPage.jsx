import PageTitle from "../components/PageTitle";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EntryRow from "../components/EntryRow";

// Microservice: Search Journal Entries
function SearchKeyword() {
  const { keyword } = useParams();
  // Parse user information using browser cookies
  const user = JSON.parse(document.cookie);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/entries/search?user=${user.user}&keyword=${keyword}`
        );

        const data = await response.json();
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
      }
    }
    loadEntries();
  }, [keyword, user.user]);

  return (
    <>
      <PageTitle title={`Posts containing keyword "${keyword}"`} />
      <div>
        <Link className="button" to="/history">
          Go Back
        </Link>
        <div className="p-container inline">
          <p>Click “Go Back” to return to the Entry History page.</p>
        </div>
        <div className="content">
          <table>
            <tbody>
              {entries.map((entry, i) => (
                <EntryRow key={i} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SearchKeyword;
