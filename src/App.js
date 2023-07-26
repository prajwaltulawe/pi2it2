import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Pattern from "./components/Pattern";
import Class from "./components/Class";
import Semester from "./components/Semester";
import Subject from "./components/Subject";
import Practicles from "./components/Practicles";
import Practicle from "./components/Practicle";
import AlertContextProvider, { useAlertContext } from "./context/alert/alertContext";
import TargetContextProvider, { useTargetContext } from "./context/nextTarget/targetContext";
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
              <Route exact path="/fetchPattern" element={<Pattern />} />
              <Route exact path="/fetchClass" element={<Class />} />
              <Route exact path="/fetchSmesters" element={<Semester />} />
              <Route exact path="/fetchSubjects" element={<Subject />} />
              <Route exact path="/fetchPracticles" element={<Practicles  />} />
              <Route exact path="/fetchPost" element={<Practicle />} />
            </Routes>
          </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppWithContext() {
  return (
    <AlertContextProvider>
      <TargetContextProvider>
        <App />
      </TargetContextProvider>
    </AlertContextProvider>
  );
}

export default AppWithContext;
