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
        <>
          <h1>Practicles of {subject.stage} Subject</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          {data && data.map((practicleItem) => {
              return (
              <button className="btn btn-primary mt-2" key={practicleItem._id} onClick={() => setNxtTarget(practicleItem.practicle, practicleItem._id)}> {practicleItem.practicle} </button>
                );
              })}
          </div>
        </>
    );
};

export default Practicles;
