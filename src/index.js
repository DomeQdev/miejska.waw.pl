import React from 'react';
import ReactDOM from 'react-dom';
import AddToHomescreen from 'react-add-to-homescreen';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './App.css';

ReactDOM.render(
  <AddToHomescreen onAddToHomescreenClick={() => {}} />
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
