import { Link } from 'react-router-dom';
import '../App';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Portal</h1>
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <div className="profile-card" style={{ textAlign: 'center' }}>
          <h2>Welcome to the Student Management System</h2>
          <p>Access and manage student records with our secure dashboard.</p>
          <Link to="/dashboard">
            <button style={{ marginTop: '20px' }}>
              View Student Directory
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
