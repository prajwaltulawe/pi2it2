import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getSemesterQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Semester = () => {
    const navigate = useNavigate();
    const { classs, setSemester } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getSemesterQuery, {
        onSuccess: (result) => {
            if (result) {
              showAlert("Available Semesters Fetched !", "warning");
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
            mutate(classs.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setSemester({stage, id});
        navigate('/fetchSubjects');
      }

    return (
        <>
          <h1>Semester of {classs.stage} Class</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          {data && data.map((semItem) => {
              return (
              <button className="btn btn-primary mt-2" key={semItem._id} onClick={() => setNxtTarget(semItem.semester, semItem._id)}> {semItem.semester} </button>
                );
              })}
          </div>
        </>
    );
};

export default Semester;
