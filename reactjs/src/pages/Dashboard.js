import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const [students, setStudents] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [values, setValues] = React.useState({ name: '', grade: '' });

  const API_BASE =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : '/api/v1';

  // 1. Move function OUT of useEffect so createStudent can see it
  const getStudents = async (signal) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students`, { signal });
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unexpected error.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getStudents(controller.signal);
    return () => controller.abort();
  }, []);

  const onChangeHandler = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const createStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setValues({ name: '', grade: '' }); // Clear form
        getStudents(); // Refresh list
      }
    } catch (err) {
      setError(err.message || 'Error creating student.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    createStudent();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student System</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="dashboard-layout">
        <section className="list-section">
          <h2>Student Directory</h2>
          {loading && <p>Updating...</p>}
          <ul>
            {students &&
              students.map((student, index) => (
                <li key={student._id || index}>
                  <Link to={`/students/${student._id}`}>{student.name}</Link>
                  <span className="id-badge">ID: {student._id}</span>
                </li>
              ))}
          </ul>
        </section>

        <section className="form-section">
          <div className="edit-form">
            <h3>Add New Student</h3>
            <form onSubmit={onSubmitHandler}>
              <label>
                Full Name:
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={onChangeHandler}
                  required
                />
              </label>
              <label>
                Grade Level:
                <input
                  type="text"
                  name="grade"
                  value={values.grade}
                  onChange={onChangeHandler}
                  required
                />
              </label>
              <input
                type="submit"
                value={loading ? 'Saving...' : 'Add Student'}
                disabled={loading}
              />
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
