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
      <div className="container-cards">
        <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form">
            <span className="container-cards-title">Subjects of Semester {semester.stage}</span>
            <div className="wrap-input100 validate-input m-b-23">
              <div className="ag-format-container grid-4">

                {data && data.map((subjectItem) => {
                  return (
                    <div className="ag-courses_box" key={subjectItem._id} onClick={() => setNxtTarget(subjectItem.subject, subjectItem._id)}>
                      <div className="ag-courses_item card-bg3">
                          <a className="ag-courses-item_link">
                              <div className="ag-courses-item_title ag-courses-item_subtitle">{subjectItem.subject}</div>
                          </a>
                      </div>
                    </div>                  
                  );
                })}

              </div>
            </div>
          </form>
        </div>
      </div>
    );
};

export default Subject;
