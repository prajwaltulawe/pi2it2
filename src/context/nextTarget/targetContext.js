import React, { createContext, useState, useContext } from "react";

const TargetContext = createContext();
export const useTargetContext = () => useContext(TargetContext);

const TargetContextProvider = (props) => {
  const [pattern, setPattern] = useState(null);
  const [courses, setCourses] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [practicles, setPracticles] = useState(null);
  const [practicle] = useState(null);

  return (
    <TargetContext.Provider value={{ pattern, setPattern, courses, setCourses, semester, setSemester, subject, setSubject, practicle, practicles, setPracticles}}>
      {props.children}
    </TargetContext.Provider>
  );
};

export default TargetContextProvider;
