import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPracticleQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Practicle = () => {
    const navigate = useNavigate();
    const { practicles, setPracticle } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getPracticleQuery, {
        onSuccess: (result) => {
            if (result) {
              showAlert("Available Practicle Links Fetched !", "warning");
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
            mutate(practicles.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

    return (
        <>
          <h1>Link for {practicles.stage} Practicle</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          <button className="btn btn-primary col-4 mt-2 mb-2" > ADD NEW POST</button>
          {data && data.map((practicleItem) => {
              return (
                <>
                  <small>{practicleItem.username}</small>
                  <div className="d-flex w-90 align-items-center justify-content-between">
                    <button className="btn btn-primary col-10" key={practicleItem._id} > {practicleItem.link} </button>
                    <div  className="d-flex">
                      <div className="d-flex align-items-baseline">
                        <a href="http://" className="fs-3 mx-1">&#128077;</a>
                        <small>789</small>
                      </div>
                      <div className="d-flex align-items-baseline">
                        <a href="http://" className="fs-3 mx-2">&#128078;</a>
                        <small>78</small>
                      </div>
                    </div>
                  </div>
                </>
                );
              })}
          </div>
        </>
    );
};

export default Practicle;
