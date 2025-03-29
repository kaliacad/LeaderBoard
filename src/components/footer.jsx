import {
  faBook,
  faCode,
  faBug,
  faComment,
  faUsers,
  faCopyright,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Footer() {
  return (
    <footer className="footer">
      <a
        href="https://github.com/kaliacad/LeaderBoard/blob/StartCode/README.md"
        className="footer-link"
      >
        <FontAwesomeIcon icon={faBook} /> Documentation
      </a>
      <a
        href="https://github.com/kaliacad/LeaderBoard.git"
        className="footer-link"
      >
        <FontAwesomeIcon icon={faCode} /> View source
      </a>
      <a
        href="https://github.com/orgs/kaliacad/projects/7"
        className="footer-link"
      >
        <FontAwesomeIcon icon={faBug} /> Report an issue
      </a>
      <a
        href="https://github.com/kaliacad/LeaderBoard/issues"
        className="footer-link"
      >
        <FontAwesomeIcon icon={faComment} /> Feedback
      </a>
      <a href="https://kaliacademy.org/" className="footer-link">
        <FontAwesomeIcon icon={faUsers} /> Developed by Kali Academy
      </a>
      <a href="https://kaliacademy.org/" className="footer-link">
        <FontAwesomeIcon icon={faCopyright} /> Kali Academy
      </a>
    </footer>
  );
}
