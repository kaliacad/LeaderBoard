import { useState } from "react";
import "./App.css";
import Dateformat from "./components/sidebar/dateFormat";
import Result from "./components/result/result";

function App() {
  const [usernames, setUsernames] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultWikipedia, setResultWikipedia] = useState(
    "the result will be displayed here"
  );
  const [resultCount, setResultCount] = useState(-1);
  const [resultCommons, setResultCommons] = useState("");

  const projectList = ["Wikipedia", "Wiki Commons", "Wiki data", "Kiwix"];
  let userChoice = "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de résultats après une requête
    setTimeout(async () => {
      setLoading(false);
      let result = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${usernames}&uclimit=500&ucprop=title|timestamp&format=json&origin=*`
      )
        .then((response) => response.json())
        .then((data) => {
          setResultWikipedia(data.query.usercontribs);
          setResultCount(resultWikipedia.length);
        });

      setResultCommons("Résultats Commons...");
    }, 2000);
  };

  return (
    <div className="container">
      <h1 className="main-title">Comparer les contributions {userChoice}</h1>
      <div className="form-container">
        <form id="userForm" onSubmit={handleSubmit}>
          <label htmlFor="usernames">
            Noms d'utilisateur (séparés par des virgules):
          </label>
          <input
            type="text"
            id="usernames"
            name="usernames"
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            required
          />

          <label htmlFor="startDate">Date de début:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label htmlFor="endDate">Date de fin:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <button type="submit">Comparer</button>
        </form>
        <div>
          {loading && <div id="loader" className="loader"></div>}
          <Result />
        </div>
      </div>
    </div>
  );
}

export default App;
