import React, { useState, useEffect } from "react";
import "./userContribution.css";

function UserContributionDetails({ 
  username, 
  isOpen, 
  onClose, 
  language, 
  platform, 
  startDate, 
  endDate 
}) {
  const [contributionsByDate, setContributionsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalEdits: 0,
    uniquePages: 0,
    dateRange: ""
  });

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchUserContributions = async () => {
      setLoading(true);
      try {
        let apiUrl;
        if (platform === "wikipedia") {
          apiUrl = `https://${language}.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp|comment|size|sizediff|flags&format=json&origin=*`;
        } else if (platform === "wikidata") {
          apiUrl = `https://www.wikidata.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp|comment|size|sizediff|flags&format=json&origin=*`;
        } else if (platform === "wikicommon") {
          apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=500&ucprop=title|timestamp|comment|size|sizediff|flags&format=json&origin=*`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filter by date range
        const filteredContributions = data.query.usercontribs.filter((contribution) => {
          const contributionDate = new Date(contribution.timestamp);
          return (
            contributionDate >= new Date(startDate) &&
            contributionDate <= new Date(endDate)
          );
        });

        // Group contributions by date
        const groupedContributions = {};
        filteredContributions.forEach(contribution => {
          const date = new Date(contribution.timestamp).toLocaleDateString();
          if (!groupedContributions[date]) {
            groupedContributions[date] = [];
          }
          groupedContributions[date].push(contribution);
        });

        setContributionsByDate(groupedContributions);
        
        // Calculate statistics
        const uniquePageTitles = new Set(filteredContributions.map(contrib => contrib.title));
        setSummary({
          totalEdits: filteredContributions.length,
          uniquePages: uniquePageTitles.size,
          dateRange: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contributions:", err);
        setError("Failed to fetch user contributions. Please try again.");
        setLoading(false);
      }
    };

    if (username) {
      fetchUserContributions();
    }
  }, [username, language, platform, startDate, endDate, isOpen]);

  if (!isOpen) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSizeDiff = (sizediff) => {
    if (sizediff > 0) {
      return <span className="positive-diff">+{sizediff} bytes</span>;
    } else if (sizediff < 0) {
      return <span className="negative-diff">{sizediff} bytes</span>;
    }
    return <span className="no-diff">0 bytes</span>;
  };

  const getPageUrl = (title) => {
    if (platform === "wikipedia") {
      return `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    } else if (platform === "wikidata") {
      return `https://www.wikidata.org/wiki/${encodeURIComponent(title)}`;
    } else if (platform === "wikicommon") {
      return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`;
    }
    return "#";
  };

  const getDiffUrl = (title, revid) => {
    if (platform === "wikipedia") {
      return `https://${language}.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&diff=prev&oldid=${revid}`;
    } else if (platform === "wikidata") {
      return `https://www.wikidata.org/w/index.php?title=${encodeURIComponent(title)}&diff=prev&oldid=${revid}`;
    } else if (platform === "wikicommon") {
      return `https://commons.wikimedia.org/w/index.php?title=${encodeURIComponent(title)}&diff=prev&oldid=${revid}`;
    }
    return "#";
  };

  const getHistoryUrl = (title) => {
    if (platform === "wikipedia") {
      return `https://${language}.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=history`;
    } else if (platform === "wikidata") {
      return `https://www.wikidata.org/w/index.php?title=${encodeURIComponent(title)}&action=history`;
    } else if (platform === "wikicommon") {
      return `https://commons.wikimedia.org/w/index.php?title=${encodeURIComponent(title)}&action=history`;
    }
    return "#";
  };

  const sortedDates = Object.keys(contributionsByDate).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  return (
    <div className="contrib-details-overlay">
      <div className="contrib-details-content">
        <div className="contrib-details-header">
          <h2>Contributions by {username}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="contrib-details-body">
          <div className="contribution-period">
            {summary.dateRange}
          </div>

          <div className="user-stats">
            <div className="stat-card">
              <h3>{summary.totalEdits}</h3>
              <p>Total Edits</p>
            </div>
            <div className="stat-card">
              <h3>{summary.uniquePages}</h3>
              <p>Unique Pages</p>
            </div>
          </div>

          {loading ? (
            <div className="details-loader"></div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : sortedDates.length === 0 ? (
            <div className="no-contributions">No contributions found for this period.</div>
          ) : (
            <div className="contributions-by-date">
              {sortedDates.map(date => (
                <div key={date} className="date-group">
                  <h3>{date} ({contributionsByDate[date].length})</h3>
                  <ul className="date-contributions">
                    {contributionsByDate[date].map((contribution, idx) => (
                      <li key={idx} className="contribution-item">
                        <div className="contrib-links">
                          (<a href={getDiffUrl(contribution.title, contribution.revid)} target="_blank" rel="noopener noreferrer">diff</a> | 
                          <a href={getHistoryUrl(contribution.title)} target="_blank" rel="noopener noreferrer">hist</a>)
                        </div>
                        <div className="contrib-time">
                          {formatTime(contribution.timestamp)}
                        </div>
                        <div className="contrib-page">
                          <a href={getPageUrl(contribution.title)} target="_blank" rel="noopener noreferrer">
                            {contribution.title}
                          </a>
                        </div>
                        <div className="contrib-comment">
                          {contribution.comment || "No comment"}
                        </div>
                        <div className="contrib-size">
                          {formatSizeDiff(contribution.sizediff)}
                        </div>
                        {contribution.minor && <span className="minor-edit" title="Minor edit">m</span>}
                        {contribution.new && <span className="new-page" title="New page">N</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserContributionDetails;