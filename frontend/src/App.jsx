import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EntryHistoryPage from "./pages/EntryHistoryPage";
import CreateEntryPage from "./pages/CreateEntryPage";
import ViewEntryPage from "./pages/ViewEntryPage";
import EditEntryPage from "./pages/EditEntryPage";
import ContactUsPage from "./pages/ContactUsPage";
import LoginPage from "./pages/LoginPage";
import MoodTagFilterPage from "./pages/MoodTagFilterPage";
import SearchKeywordPage from "./pages/SearchKeywordPage";
import WordRankingPage from "./pages/WordRankingPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/history" element={<EntryHistoryPage />} />
              <Route path="/create" element={<CreateEntryPage />} />
              <Route path="/view/:id" element={<ViewEntryPage />} />
              <Route path="/edit/:id" element={<EditEntryPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/filter/:mood" element={<MoodTagFilterPage />} />
              <Route path="/search/:keyword" element={<SearchKeywordPage />} />
              <Route path="/ranking" element={<WordRankingPage />} />
            </Routes>
          </main>
        </div>

        <footer>
          <p>Copyright © 2025 Fern Burke</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
