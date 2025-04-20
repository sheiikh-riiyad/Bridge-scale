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
    </>
  );
}

export default App;
