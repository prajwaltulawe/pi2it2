import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPatternsQuery } from '../hooks/nextTargetQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Pattern = (props) => {
    const navigate = useNavigate();
    const { setPattern } = useTargetContext();
    const { showAlert } = useAlertContext();

    const { data, mutate } = useMutation(getPatternsQuery, {
        onSuccess: (result) => {
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
            mutate();
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const setNxtTarget = (stage, id) => {
        setPattern({stage: stage, id: id});
        navigate('/fetchClass');
      }

    return (
      <>
        <h1>PATTERNS</h1>
        <div className="container m-auto mt-4 d-flex flex-column"> 
              <div class="row">
                <div class="col-sm-6">

                {data && data.map((pattern) => {
                return (
                  <div className="card">
                    <div class="card-body">
                      <h5 class="card-title"><b>{pattern.year}</b></h5>
                      <p class="card-text">View all available classes of pattern {pattern.year}.</p>
                      <button className="btn btn-primary mt-2" key={pattern._id} onClick={() => setNxtTarget(pattern.year, pattern._id)}> View classes of {pattern.year} </button>
                    </div>
                  </div>
                  );
                })}

                </div>  
              </div>
        </div>
      </>
    );
};

export default Pattern;
