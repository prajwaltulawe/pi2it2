import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getSemesterQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Semester = () => {
    const navigate = useNavigate();
    const { courses, setSemester } = useTargetContext();
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
            mutate(courses.id);
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
      <div className="container-cards">
        <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form">
            <span className="container-cards-title">Semesters of {courses.stage} course</span>
            <div className="wrap-input100 validate-input m-b-23">
              <div className="ag-format-container grid-4">

                {data && data.map((semItem) => {
                  return (
                    <div className="ag-courses_box" key={semItem._id} onClick={() => setNxtTarget(semItem.semester, semItem._id)}>
                        <div className="ag-courses_item card-bg3">
                            <a href="#" className="ag-courses-item_link">
                                <div className="ag-courses-item_title">
                                    Sem {semItem.semester}    
                                </div>
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

export default Semester;
