import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";
import { Footer } from "./footer";
import { useParams } from "react-router-dom";

function App() {
  const [usernames, setUsernames] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultWikipedia, setResultWikipedia] = useState([]);
  const [resultCount, setResultCount] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const inputRef = useRef();
  const [userContribs, setUserContribs] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        const response = await fetch(
          "https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Featured_pictures_on_Wikimedia_Commons&gcmtype=file&gcmlimit=10&prop=imageinfo&iiprop=url|thumbnail&iiurlwidth=1366&format=json&origin=*"
        );
        const data = await response.json();
        const pages = data.query.pages;
        const images = Object.keys(pages).map(
          (key) => pages[key].imageinfo[0].thumburl
        );
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setFeaturedImage(randomImage);
      } catch (error) {
        console.error("Error fetching the featured images:", error);
      }
    };
    fetchFeaturedImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("params", useParams());

    setLoading(true);

    setUsernames(inputRef.current.value);

    const usernameArray = inputRef.current.value
      .split(",")
      .map((name) => name.trim());

    const contributionsByUser = await Promise.all(
      usernameArray.map(async (username) => {
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
        return { username, contributions };
      })
    );

    const contributionsCountByUser = contributionsByUser.map((user) => ({
      username: user.username,
      count: user.contributions.length,
    }));

    setUserContribs(contributionsCountByUser);
    const sortedUsers = contributionsCountByUser.sort(
      (a, b) => b.count - a.count
    );

    setResultWikipedia(sortedUsers);
    setResultCount(sortedUsers.reduce((sum, user) => sum + user.count, 0));
    setLoading(false);

    // Prepare chart data
    const allDates = Array.from(
      new Set(
        contributionsByUser.flatMap((user) =>
          user.contributions.map((contrib) => contrib.timestamp.split("T")[0])
        )
      )
    ).sort();
    const datasets = contributionsByUser.map((user) => {
      const userContributionsByDate = allDates.map(
        (date) =>
          user.contributions.filter((contrib) =>
            contrib.timestamp.startsWith(date)
          ).length
      );
      return {
        label: user.username,
        data: userContributionsByDate,
        borderColor: getRandomColor(),
        backgroundColor: getRandomColor(0.2),
        fill: true,
      };
    });

    setChartData({
      labels: allDates,
      datasets: datasets,
    });

    try {
      const params = ` ${usernames}_${startDate}_${endDate}`;
      window.location.href =
        window.location.origin + window.location.pathname + "?" + params;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to generate a random color
  const getRandomColor = (alpha = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div>
      <div
        className="container"
        style={{ backgroundImage: `url(${featuredImage})` }}
      >
        <h1 className="main-title">Wiki Leaderboard</h1>

        <div className="form-container">
          <form id="userForm" onSubmit={handleSubmit}>
            <div className="form-main-div">
              <div>
                <span className="label" htmlFor="startDate">
                  Usernames
                </span>
                <input
                  type="text"
                  id="usernames"
                  name="usernames"
                  placeholder="users1, users2, users3"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  ref={inputRef}
                  required
                />
              </div>
              <div>
                <span className="label" htmlFor="startDate">
                  Start Date
                </span>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <span className="label" htmlFor="endDate">
                  End Date
                </span>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {inputValue.includes(",") &&
            inputValue[inputValue.length - 1] !== "," ? (
              <button type="submit">Comparer</button>
            ) : (
              <button type="submit">Vérifier les contributions</button>
            )}
          </form>
        </div>

        <div className="results-and-chart">
          <div className="results-container">
            {loading && <div id="loader" className="loader"></div>}
            <div id="resultWikipedia">
              {resultCount < 0 ? (
                "Les résultats seront affichés ici"
              ) : resultWikipedia.length === 0 ? (
                "Aucun résultat pour cet utilisateur"
              ) : (
                <>
                  <h4 className="resultTitle">
                    Resultats du {startDate} au {endDate}
                  </h4>
                  <div className="results results1">
                    <div></div>
                    <div>
                      <h5>{resultCount}</h5>
                      <span>Contributions</span>
                    </div>
                    <div>
                      <h5>{usernames.split(",").length}</h5>
                      {/* fix */}
                      <span>Participants</span>
                    </div>
                  </div>
                  {resultWikipedia.map((user, index) => (
                    <div key={index} className="results results2">
                      <div>{index + 1}</div>
                      <div className="user-contribs">
                        {" "}
                        <strong>{user.username}</strong>{" "}
                        <span>{userContribs[index].count} contributions</span>
                      </div>
                      <div>
                        {index < 3 && <span className="badge">Gagnant</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="chart-container">
            {chartData && chartData.datasets.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <div>Aucune donnée à afficher</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
