import React, {useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPracticlesQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";
import LoadingBar from 'react-top-loading-bar'

const Practicles = () => {
    const progressRef = useRef(null)

    const navigate = useNavigate();
    const { subject, setPracticles } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getPracticlesQuery, {
        onSuccess: (result) => {
            progressRef.current.complete()
            if (result) {
              showAlert("Available Practicles Fetched !", "warning");
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
            mutate(subject.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setPracticles({stage, id});
        navigate('/fetchPost');
      }

    return (
      <div className="container-cards">
        <LoadingBar color='#f11946' ref={progressRef} shadow={true}/>
        <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form">
            <span className="container-cards-title"> Practicles of {subject.stage} </span>
            <div className="wrap-input100 validate-input m-b-23">
              <div className="ag-format-container grid-5">
              
                {data && data.map((practicleItem) => {
                  return (
                    <div className="ag-courses_box" key={practicleItem._id} onClick={() => setNxtTarget(practicleItem.practicle, practicleItem._id)}>
                      <div className="ag-courses_item card-bg3">
                          <div className="ag-courses-item_link">
                              <div className="ag-courses-item_title ag-courses-item_mintitle">
                                {practicleItem.practicle}
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
                      <span style={{ textAlign:"center", width:"100%" }}><b> No practivles available to show!</b> </span>                        
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

export default Practicles;
