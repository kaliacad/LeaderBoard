import { faBook, faCode, faBug, faComment, faUsers, faCopyright } from '@fortawesome/fontawesome-free';
import { FontAwesomeIcon } from '@fortawesome/fontawesome-free';


export function Footer() {
  return (
    <footer className="footer">
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faBook} /> Documentation</a>
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faCode} /> View source</a>
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faBug} /> Report an issue</a>
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faComment} /> Feedback</a>
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faUsers} /> Developed by Community Tech</a>
      <a href="#" className="footer-link"><FontAwesomeIcon icon={faCopyright} /> Attribution</a>
    </footer>
  )
}