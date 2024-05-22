import { useState } from 'react'
import './App.css'

function App() {
  const [usernames, setUsernames] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultWikipedia, setResultWikipedia] = useState('');
  const [resultCommons, setResultCommons] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de résultats après une requête
    setTimeout(() => {
      setLoading(false);
      setResultWikipedia('Résultats Wikipedia...');
      setResultCommons('Résultats Commons...');
    }, 2000);
  };

  return (
    <div className="container">
      <h1>Comparer les contributions Wikipedia </h1>
      <form id="userForm" onSubmit={handleSubmit}>
        <label htmlFor="usernames">Noms d'utilisateur (séparés par des virgules):</label>
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
      {loading && <div id="loader" className="loader"></div>}
      <div id="resultWikipedia">{resultWikipedia}</div>
    </div>
  );
}

export default App;