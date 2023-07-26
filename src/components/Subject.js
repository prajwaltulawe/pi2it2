import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getSubjectsQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Subject = () => {
    const navigate = useNavigate();
    const { semester, setSubject } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getSubjectsQuery, {
        onSuccess: (result) => {
            if (result) {
              showAlert("Available Subjects Fetched !", "warning");
            } else {
              showAlert("Some error occoured. Plz try again later !", "warning");
            }
          },
          onError: (error) => {
            console.error("Error submitting data:", error.message);
          }
    })

    useEffect(() => {
        if (localStorage.getItem('token')) {
            mutate(semester.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setSubject({stage, id});
        navigate('/fetchPracticles');
      }

    return (
        <>
          <h1>Subjects of Semester {semester.stage}</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          {data && data.map((subjectItem) => {
              return (
              <button className="btn btn-primary mt-2" key={subjectItem._id} onClick={() => setNxtTarget(subjectItem.subject, subjectItem._id)}> {subjectItem.subject} </button>
                );
              })}
          </div>
        </>
    );
};

export default Subject;
