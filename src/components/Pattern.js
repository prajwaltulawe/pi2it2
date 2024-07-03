import React, {useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPatternsQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";
import LoadingBar from 'react-top-loading-bar'

const Pattern = (props) => {
    const progressRef = useRef(null)

    const navigate = useNavigate();
    const { setPattern } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getPatternsQuery, {
        onSuccess: (result) => {
            progressRef.current.complete()
            if (result) {
              showAlert("Available Patterns Fetched !", "warning");
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
            progressRef.current.continuousStart()
            mutate();
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setPattern({stage: stage, id: id});
        navigate('/fetchCourses');
      }

    return (
      <div className="container-cards" >
        <LoadingBar color='#f11946' ref={progressRef} shadow={true}/>
			  <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
				  <form className="login100-form">
            <span className="container-cards-title">Patterns</span>
					    <div className="wrap-input100 validate-input m-b-23">
                <div className="ag-format-container">
                  
                  {data && data.map((pattern) => {
                    return (
                      <div className="ag-courses_box" key={pattern._id} onClick={() => setNxtTarget(pattern.year, pattern._id)}>
                        <div className="ag-courses_item card-bg3">
                            <div className="ag-courses-item_link">
                                <div className="ag-courses-item_title">{pattern.year}</div>
                                <div className="ag-courses-item_date-box">
                                  <span className="ag-courses-item_date">View courses of {pattern.year} pattern </span>
                                </div>
                            </div>
                        </div>
                      </div>
                    );
                  })}

                  {data && data.length === 0  && (
                    <div className="ag-courses_box">
                      <div className="d-flex flex-row justify-content-between col-10">
                      </div>
                      <div className="d-flex align-items-center justify-content-between col-12">
                        <span style={{ textAlign:"center", width:"100%" }}><b> No patterns available to show!</b> </span>                        
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </form>
        </div>
      </div>
    );
};

export default Pattern;
