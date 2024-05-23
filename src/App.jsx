import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultWikipedia, setResultWikipedia] = useState([]);
  const [resultCount, setResultCount] = useState(-1);
  const [resultCommons, setResultCommons] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp&format=json&origin=*`
      );
      const data = await response.json();
      const contributions = data.query.usercontribs.filter((contribution) => {
        const contributionDate = new Date(contribution.timestamp);
        return (
          contributionDate >= new Date(startDate) &&
          contributionDate <= new Date(endDate)
        );
      });

      setResultWikipedia(contributions);
      setResultCount(contributions.length);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
      setResultCommons("Résultats Commons...");
    }
  };

  function dateformat(date) {
    const [datePart, timePart] = date.split("T");
    const formattedDate = datePart.split("-").reverse().join("-");
    const formattedTime = timePart.replace("Z", "");
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className="container">
      <h1>Comparer les contributions Wikipedia</h1>
      <div className="form-container">
        <form id="userForm" onSubmit={handleSubmit}>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <div id="resultWikipedia">
            {resultCount < 0 ? (
              "The result will be displayed here"
            ) : resultWikipedia.length === 0 ? (
              "There are no results for that user"
            ) : (
              <>
                <h4 className="resultTitle">
                  The results for the user {username} are {resultWikipedia.length}
                </h4>
                <div className="result">
                  <h5>Title</h5>
                  <h5>Date</h5>
                </div>
                {resultWikipedia.map((el, index) => (
                  <div key={index} className="result">
                    <h6>{el.title}</h6>
                    <h6>{dateformat(el.timestamp)}</h6>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
