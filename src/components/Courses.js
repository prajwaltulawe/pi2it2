import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getCourseQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Courses = (props) => {
    const navigate = useNavigate();
    const { pattern, setCourses } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getCourseQuery, {
        onSuccess: (result) => {
            if (result) {
              showAlert("Available Courses Fetched !", "warning");
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
        setCourses({stage, id});
        navigate('/fetchSmesters');
      }

    return (
      <div className="container-cards">
        <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form">
            <span className="container-cards-title">Courses of {pattern.stage} Pattern</span>
            <div className="wrap-input100 validate-input m-b-23">
              <div className="ag-format-container">

                {data && data.map((classItem) => {
                  return (
                    <div className="ag-courses_box" key={classItem._id} onClick={() => setNxtTarget(classItem.class, classItem._id)}>
                        <div className="ag-courses_item card-bg3">
                            <a href="#" className="ag-courses-item_link">
                                <div className="ag-courses-item_title">
                                  {classItem.class}
                                </div>
                                <div className="ag-courses-item_date-box">
                                    <span className="ag-courses-item_date">{classItem.class}</span>
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

export default Courses;
