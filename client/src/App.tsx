import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SearchResults from './pages/SearchResults';

// Components
const Header: React.FC = () => (
  <header className="header" data-testid="header">
    <div className="container">
      <h1 className="logo">
        <Link to="/" data-testid="logo-link">Wallflower</Link>
      </h1>
      <nav className="nav" data-testid="main-navigation">
        <Link to="/" className="nav-link" data-testid="nav-home">Home</Link>
        <Link to="/planner" className="nav-link" data-testid="nav-planner">Trip Planner</Link>
        <Link to="/about" className="nav-link" data-testid="nav-about">About</Link>
        <Link to="/search" className="nav-link" data-testid="nav-search">Search</Link>
      </nav>
    </div>
  </header>
);

const Home: React.FC = () => (
  <div className="page" data-testid="home-page">
    <div className="container">
      <h2>Welcome to Wallflower</h2>
      <p>Your travel planning companion for discovering hidden gems and creating memorable journeys.</p>
      <Link to="/planner" className="cta-button" data-testid="get-started-button">
        Get Started
      </Link>
    </div>
  </div>
);

const TripPlanner: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trip planned:', { destination, startDate, endDate, travelers });
  };

  return (
    <div className="page" data-testid="trip-planner-page">
      <div className="container">
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit} className="trip-form" data-testid="trip-planner-form">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              data-testid="destination-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where would you like to go?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              data-testid="start-date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              data-testid="end-date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="travelers">Number of Travelers</label>
            <select
              id="travelers"
              data-testid="travelers-select"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              <option value="1">1 Traveler</option>
              <option value="2">2 Travelers</option>
              <option value="3">3 Travelers</option>
              <option value="4">4+ Travelers</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button" data-testid="plan-trip-button">
            Plan My Trip
          </button>
        </form>
      </div>
    </div>
  );
};

const About: React.FC = () => (
  <div className="page" data-testid="about-page">
    <div className="container">
      <h2>About Wallflower</h2>
      <p>Wallflower helps you discover unique travel experiences and plan memorable trips.</p>
      <p>Our mission is to connect travelers with authentic local experiences and hidden gems.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="App" data-testid="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
