import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();
export const useAlertContext = () => useContext(AlertContext);

const AlertContextProvider = (props) => {
  const [alert, setAlert] = useState(null);
  
  const showAlert = (message, type) =>{
    setAlert({
      msg: message,
      type: type
    });

    setTimeout(()=>{
      setAlert(null);
    }, 3000);
  }

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
