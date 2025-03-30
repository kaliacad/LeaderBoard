import React, { useState } from "react";
import { saveAs } from "file-saver";
import { saveAsPng } from "save-html-as-image";
import { ChevronDown, Download } from "lucide-react";
import "./Dropdown.css";

const DropdownMenu = ({ resultWikipedia, userContribs }) => {
  const [selectedFormat, setSelectedFormat] = useState(""); // Stocke le format sélectionné

  const exportData = () => {
    if (!selectedFormat) return; // Empêche le téléchargement si aucun format n'est sélectionné

    if (selectedFormat === "json") {
      const data = { resultWikipedia, userContribs };
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(jsonBlob, "data.json");
    } else if (selectedFormat === "csv") {
      const csvRows = [
        ["Username", "Contributions"],
        ...userContribs.map((user) => [user.username, user.count]),
      ];
      const csvBlob = new Blob([csvRows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
      saveAs(csvBlob, "data.csv");
    } else if (selectedFormat === "png") {
      const element = document.querySelector(".results-container");
      saveAsPng(element, { filename: "results.png" });
    }
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value); // Met à jour le format sélectionné
  };

  return (
    <div className="dropdown-container">
      {/* Sélecteur de format */}
      <div className="dropdown">
        <select onChange={handleFormatChange} value={selectedFormat} className="dropdown-select">
          <option value="" disabled>Choisir un format</option>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="png">PNG</option>
        </select>
        <ChevronDown className="dropdown-icon" size={16} />
      </div>

      {/* Bouton de téléchargement */}
      <button className="download-btn" onClick={exportData} disabled={!selectedFormat}>
        <Download size={14} />
      </button>
    </div>
  );
};

export default DropdownMenu;