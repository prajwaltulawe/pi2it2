import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getClassQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Class = (props) => {
    const navigate = useNavigate();
    const { pattern, setClasss } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getClassQuery, {
        onSuccess: (result) => {
            if (result) {
              showAlert("Available Classes Fetched !", "warning");
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
            mutate(pattern.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setClasss({stage, id});
        navigate('/fetchSmesters');
      }

    return (
        <>
          <h1>Classes of {pattern.stage} Pattern</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          {data && data.map((classItem) => {
              return (
              <button className="btn btn-primary mt-2" key={classItem._id} onClick={() => setNxtTarget(classItem.class, classItem._id)}> {classItem.class} </button>
                );
              })}
          </div>
        </>
    );
};

export default Class;
