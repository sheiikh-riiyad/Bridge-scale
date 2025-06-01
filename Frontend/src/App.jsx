// App.jsx
import React from 'react';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import './Styles/App.css';
import Alertbar from './Components/all alert/Alertbar'; // now this is only the UI
import { useAlert } from './Components/AlertContext'; // context hook


function App() {
  const { alertVisible, alertMessage } = useAlert();

  return (
    <>
      <Header />
      {alertVisible && <Alertbar message={alertMessage} />}
      <Home />
      <p style={{ marginTop: "-20px", fontSize: "10px", color: "#111", paddingBottom: "-20px"}}>
              <spain> whatsapp:+8801710666995</spain><br/>
              © 2024 Blueheartdev.com. All rights reserved. 
        </p>
    </>
  );
}

export default App;
