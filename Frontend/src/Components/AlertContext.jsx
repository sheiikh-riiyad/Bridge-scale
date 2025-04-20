// Components/AlertContext.jsx
import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const hideAlert = () => setAlertVisible(false);

  return (
    <AlertContext.Provider value={{ alertVisible, alertMessage, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
