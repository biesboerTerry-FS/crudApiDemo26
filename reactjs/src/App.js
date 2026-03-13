import React, { useEffect } from 'react';  
import './App.css';

function App() {
  const [students, setStudents] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const API_BASE =  process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api/v1'
  // : process.env.REACT_APP_BASE_URL;
  : "/api/v1"


  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      getStudents();
    }

    return () => {
      ignore = true;
    };
  }, []);

  // const getStudents = async () => {
  //   try {
  //    await fetch(`${API_BASE}/students`)
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log({data});
          
  //           setStudents(data);
  //       });
  //   } catch (error) {
  //     setError(error.message || 'Unexpected error.')
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const getStudents = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/students`);
    const data = await response.json();
    if (!ignore) {
      setStudents(data);
    }
  } catch (error) {
    setError(error.message || 'Unexpected error.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="App">
      <header className="App-header">
        <h1>Students:</h1>
        <ul>
          <li>Students</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
