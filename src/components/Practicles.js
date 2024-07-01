import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPracticlesQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Practicles = () => {
    const navigate = useNavigate();
    const { subject, setPracticles } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getPracticlesQuery, {
        onSuccess: (result) => {
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
        <div className="wrap-cards p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form">
            <span className="container-cards-title"> Practicles of {subject.stage} </span>
            <div className="wrap-input100 validate-input m-b-23">
              <div className="ag-format-container grid-5">
              
                {data && data.map((practicleItem) => {
                  return (
                    <div className="ag-courses_box" key={practicleItem._id} onClick={() => setNxtTarget(practicleItem.practicle, practicleItem._id)}>
                      <div className="ag-courses_item card-bg3">
                          <a className="ag-courses-item_link">
                              <div className="ag-courses-item_title ag-courses-item_mintitle">
                                {practicleItem.practicle}
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

export default Practicles;
