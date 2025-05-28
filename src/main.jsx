// src/index.js OR src/main.jsx (whichever is your root rendering file)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import { Provider } from 'react-redux'; // If you're using Redux
import { store } from './redux/store';
import './index.css'
import App from './App.jsx'
//import reportWebVitals from './reportWebVitals'; // Optional for performance metrics

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*
      THIS IS THE CRUCIAL PART:
      The <App /> component (and everything inside it, including useLocation)
      MUST be a child of <Router>.
      If you're using Redux, <Provider> should typically wrap <Router>.
    */}
    <Provider store={store}> {/* Redux Provider comes first for state */}
      {/* ADD THE 'basename' PROP HERE */}
      <Router basename="/album/"> {/* BrowserRouter provides the context for useLocation */}
        <App /> {/* Your main App component */}
      </Router>
    </Provider>
  </React.StrictMode>
);

//reportWebVitals(); // Optional for performance metrics