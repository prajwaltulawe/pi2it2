import "./App.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alert from "./components/Alert";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";
import SetPassword from "./components/SetPassword";
import Pattern from "./components/Pattern";
import Courses from "./components/Courses";
import Semester from "./components/Semester";
import Subject from "./components/Subject";
import Practicles from "./components/Practicles";
import Practicle from "./components/Practicle";
import AlertContextProvider, { useAlertContext } from "./context/alert/alertContext";
import TargetContextProvider, { useTargetContext } from "./context/nextTarget/targetContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
const queryClient = new QueryClient();

function App() {
  const { alert } = useAlertContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Alert alert={alert}></Alert>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/forgetPassword" element={<ForgetPassword />} />
            <Route exact path="/resetPassword/:token" element={<ResetPassword />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/setPassword" element={<SetPassword />} />
            <Route exact path="/fetchPattern" element={<Pattern />} />
            <Route exact path="/fetchCourses" element={<Courses />} />
            <Route exact path="/fetchSmesters" element={<Semester />} />
            <Route exact path="/fetchSubjects" element={<Subject />} />
            <Route exact path="/fetchPracticles" element={<Practicles  />} />
            <Route exact path="/fetchPost" element={<Practicle />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppWithContext() {
  return (
    <AlertContextProvider>
      <TargetContextProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>;
      </TargetContextProvider>
    </AlertContextProvider>
  );
}

export default AppWithContext;