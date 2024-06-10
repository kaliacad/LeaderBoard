import React from 'react';
import { saveAs } from 'file-saver';
import { saveAsPng } from 'save-html-as-image';
import './Dropdown.css';

const DropdownMenu = ({ chartData, resultWikipedia, userContribs }) => {
  const exportToJSON = () => {
    const data = { resultWikipedia, userContribs };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Username', 'Contributions'],
      ...userContribs.map((user) => [user.username, user.count]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPNG = () => {
    const element = document.querySelector('.results-container');
    saveAsPng(element, { filename: 'results.png' });
  };

  const handleExportChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'json') {
      exportToJSON();
    } else if (selectedValue === 'csv') {
      exportToCSV();
    } else if (selectedValue === 'png') {
      exportToPNG();
    }
  };

  return (
    <div className="contain">
      <select onChange={handleExportChange} defaultValue="" className="select">
        <option value="" disabled>Exporter</option>
        <option value="json">Exporter en JSON</option>
        <option value="csv">Exporter en CSV</option>
        <option value="png">Exporter en PNG</option>
      </select>
    </div>
  );
};

export default DropdownMenu;
