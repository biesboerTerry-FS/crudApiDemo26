import React, { useEffect } from 'react';  
import './App.css';

function App() {
  const [students, setStudents] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    let ignore = false; 

    const getStudents = async () => {
      setLoading(true);
      try {
        const API_BASE = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/api/v1' 
          : '/api/v1';

        const response = await fetch(`${API_BASE}/students`);
        const data = await response.json();
        
        if (!ignore) {
          setStudents(data);
        }
      } catch (error) {
        if (!ignore) setError(error.message || 'Unexpected error.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    getStudents();

    return () => {
      ignore = true;
    };
  }, []); 

  return (
    <div className="App">
       <h1>Students:</h1>
       {error && <p>Error: {error}</p>}
       {loading ? <p>Loading...</p> : null}
       <ul>
         {students?.map(s => <li key={s._id}>{s.name}</li>)}
       </ul>
    </div>
  );
}

export default App;