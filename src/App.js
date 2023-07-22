import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AlertContextProvider, { useAlertContext } from "./context/alert/alertContext";
const queryClient = new QueryClient();

function App() {
  const { alert } = useAlertContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="container m-auto">
          <Alert alert={alert}></Alert>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppWithAlertContext() {
  return (
    <AlertContextProvider>
      <App />
    </AlertContextProvider>
  );
}

export default AppWithAlertContext;
