import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";
import { Footer } from "./components/footer";
import DropdownMenu from "./Dropmenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import UserContributionModal from "./components/UserContributions";

function App() {
  const [theUrl, setTheUrl] = useState(
    window.location.origin + window.location.pathname
  );
  const [usernames, setUsernames] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultWikipedia, setResultWikipedia] = useState([]);
  const [resultCount, setResultCount] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [language, setLanguage] = useState("fr");
  const inputRef = useRef();
  const [userContribs, setUserContribs] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [newUrl, setNewUrl] = useState();
  const [platform, setPlatform] = useState("wikipedia");
  const [platformAfter, setPlatformAfter] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 30);
  const today = new Date();
  today.setDate(today.getDate());
  const [startDate, setStartDate] = useState(
    yesterday.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [startDateAfter, setStartDateAfter] = useState(
    yesterday.toISOString().split("T")[0]
  );
  const [endDateAfter, setEndDateAfter] = useState(
    today.toISOString().split("T")[0]
  );


  const handleUserClick = (username) => {
    setSelectedUser(username);
    setModalOpen(true);
  };


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

  async function makeTheSearch(usernames, startDate, endDate, platform) {
    setLoading(true);
    function removeTrailingNonAlphanumeric(str) {
      return str.replace(/[^a-zA-Z0-9]+$/, "");
    }
    let usernameArray = "";
    if (inputRef?.current?.value) {
      const removelast = removeTrailingNonAlphanumeric(inputRef.current.value);

      usernameArray = removelast
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
    } else {
      usernameArray = usernames.split(",").map((name) => name.trim());
    }

    const contributionsByUser = await Promise.all(
      usernameArray.map(async (username) => {
        let response = "";
        if (platform === "wikipedia") {
          response = await fetch(
            `https://${language}.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp&format=json&origin=*`
          );
        } else if (platform === "wikidata") {
          response = await fetch(
            `https://www.wikidata.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp&format=json&origin=*`
          );
        } else if (platform === "wikicommon") {
          response = await fetch(
            `https://commons.wikimedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp&format=json&origin=*`
          );
        }

        setPlatformAfter(platform);
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
    setStartDateAfter(startDate);
    setEndDateAfter(endDate);

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
    let params = `${usernames}_${startDate}_${endDate}_${platform}`;
    params = params.replaceAll(",", "**");
    params = params.replaceAll(" ", "");

    setNewUrl(theUrl + params);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    makeTheSearch(usernames, startDate, endDate, platform);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
  };

  const getRandomColor = (alpha = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  async function handleShareLink() {
    if (theUrl.includes("/") && theUrl[theUrl.length - 1] !== "/") {
      await navigator.clipboard.writeText(theUrl);
    } else {
      await navigator.clipboard.writeText(newUrl);
    }
    alert("you have copied the link successfully");
  }

  useEffect(() => {
    if (theUrl.includes("/") && theUrl[theUrl.length - 1] !== "/") {
      setCopiedLink(true);

      let params = theUrl.split("/")[3].split("_");
      let users = params[0].replaceAll("**", ",");
      users = users.replaceAll(" ", "");
      setUsernames(users);
      setStartDate(params[1]);
      setEndDate(params[2]);
      setPlatform(params[3]);
      makeTheSearch(users, params[1], params[2], params[3]);
    }
  }, [theUrl]);

  function dateFormat(dateStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <div
        className="container"
        style={{ backgroundImage: `url(${featuredImage})` }}
      >
        <div className="titles">
          <h1 className="main-title">Wiki Leaderboard</h1>
          <h3 className="second-title">Project</h3>
        </div>
        <div className="choice-lang">
          <select
            className="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="ln">ln</option>
            <option value="sw">sw</option>
          </select>
          <select
            className="wiki"
            value={platform}
            onChange={handlePlatformChange}
          >
            <option value="wikipedia">wikipedia.org</option>
            <option value="wikidata">wikidata.org</option>
            <option value="wikicommon">commons.wikimedia.org</option>
          </select>
        </div>
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
                  placeholder="users1, users2, users3,..."
                  value={usernames}
                  onChange={(e) => setUsernames(e.target.value)}
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
                    Resultats {platformAfter} du {dateFormat(startDateAfter)} -{" "}
                    {dateFormat(endDateAfter)}{" "}
                    <button className="share-button" onClick={handleShareLink}>
                      Cliquez pour copier le lien (Share)
                    </button>
                    <DropdownMenu
                      chartData={chartData}
                      resultWikipedia={resultWikipedia}
                      userContribs={userContribs}
                    />
                  </h4>
                  <div className="results results1">
                    <div></div>
                    <div>
                      <h5>{resultCount}</h5>
                      <span>Contributions</span>
                    </div>
                    <div>
                      <h5>{userContribs.length}</h5>
                      <span>Participants</span>
                    </div>
                  </div>
                  {resultWikipedia.map((user, index) => (
                    <div key={index} className="results results2">
                      <div>{index + 1}</div>
                      <div className="user-contribs">
                        <strong 
                          className="clickable-username" 
                          onClick={() => handleUserClick(user.username)}
                        >
                          {user.username}
                        </strong>
                        <span>{userContribs[index].count} contributions</span>
                      </div>
                      <div>
                        {index < 3 && userContribs[index].count > 0 && (
                          <div
                            className={`badge-container badge-${index + 1}`}
                          >
                            <FontAwesomeIcon
                              icon={faCertificate}
                              className="badge-icon"
                            />
                            <span className="badge-label">{index + 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="chart-container">
            {chartData && chartData.datasets.length > 0 ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right", // Move the legend to the right
                      labels: {
                        usePointStyle: true, // Use circular points instead of rectangles
                        pointStyle: "circle", // Ensure the points are displayed as circles
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          return `${tooltipItem.dataset.label}: ${tooltipItem.raw} contributions`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Dates", // X-axis label
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Number of Contributions", // Y-axis label
                      },
                      beginAtZero: true, // Start Y-axis at 0
                    },
                  },
                }}
              />
            ) : (
              <div>Aucune donnée à afficher</div>
            )}
          </div>
        </div>
      </div>

      <UserContributionModal
        username={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        language={language}
        platform={platformAfter || platform}
        startDate={startDateAfter || startDate}
        endDate={endDateAfter || endDate}
      />

      <Footer />
    </div>
  );
}
export default App;
