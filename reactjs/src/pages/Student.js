import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';

function Student() {
  const [students, setStudents] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [values, setValues] = React.useState({
    name: '',
    grade: '',
    _id: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // & ---------- Handle Input Changes
  const onChangeHandler = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // & ---------- Handle Form Submission
  const onSubmitHandler = (event) => {
    event.preventDefault();
    updateStudent();
  };

  // & ---------- Fetch Student Data on Load
  useEffect(() => {
    let ignore = false;
    const getStudent = async () => {
      const API_BASE =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/api/v1'
          : '/api/v1';

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/students/${id}`);
        const data = await response.json();

        if (!ignore) {
          setStudents(data);
          setValues({
            name: data.name || '',
            grade: data.grade || '',
            _id: data._id || '',
          });
        }
      } catch (error) {
        if (!ignore) setError(error.message || 'Unexpected error.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    getStudent();
    return () => {
      ignore = true;
    };
  }, [id]);

  // & ---------- UPDATE Student
  const updateStudent = async () => {
    const API_BASE =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/api/v1'
        : '/api/v1';

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // We only send the fields we want to change
        body: JSON.stringify({
          name: values.name,
          grade: values.grade,
        }),
      });

      if (response.ok) {
        console.log('Update successful');
        // Redirect to Home page after success
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Failed to update student');
      }
    } catch (error) {
      setError(error.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  // & ---------- DELETE Student
  const deleteStudent = async () => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    const API_BASE =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/api/v1'
        : '/api/v1';

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/dashboard', { replace: true });
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
        <h1>Student Profile</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <div className="profile-card">
          <h2>{values.name || 'Loading...'}</h2>
          <p>
            <strong>Grade:</strong> {values.grade || 'N/A'}
          </p>
          <p>
            <strong>Database ID:</strong>{' '}
            <span className="id-badge">{values._id}</span>
          </p>
          <button onClick={deleteStudent} style={{ marginTop: '20px' }}>
            Delete Student Record
          </button>
        </div>

        <div className="edit-form">
          <h3>Edit Details</h3>
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
              value={loading ? 'Saving...' : 'Save Changes'}
              disabled={loading}
            />
          </form>
          {error && (
            <p style={{ color: 'var(--accent-orange)', marginTop: '10px' }}>
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Student;
