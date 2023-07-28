import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPracticleQuery } from '../hooks/nextTargetQueries';
import { addPostQuery } from '../hooks/practiclePostsQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Practicle = () => {
    const navigate = useNavigate();
    const { practicles, setPracticle } = useTargetContext();
    const { showAlert } = useAlertContext();
    const [addPostLink, setAddPostLink] = useState("");
    const closeAddPostModal = useRef("");
    const post = [];
    const [posts, setPosts] = useState(post)
    

    const { data, mutate : getPracticleData } = useMutation(getPracticleQuery, {
        mutationKey: "getPracticle",
        onSuccess: (result) => {
            if (result.status !== 204) {
              showAlert("Available Practicle Links Fetched !", "warning");
              setPosts(result);
            } else if(result.status === 406 || result.status === 500) {
              showAlert("Some error occoured. Plz try again later !", "warning");
            }
          },
          onError: (error) => {
            console.error("Error submitting data:", error.message);
          }
    })

    useEffect(() => {
        if (localStorage.getItem('token') && practicles) {
          getPracticleData(practicles.id);
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      }, []);

      const { data: addPostResponse, mutate : addPost } = useMutation(addPostQuery, {
        mutationKey: "addPost",
        onSuccess: (result) => {
          if (result.status !== 204) {
            showAlert("Post Added !", "warning");
            let tempPost = {
              "_id": result._id,
              "link": result.link,
              "username": localStorage.getItem('userName')
            };
            setPosts(posts.concat(tempPost));
          } else if(result.status === 406 || result.status === 500){
            showAlert("Some error occoured. Plz try again later !", "warning");
          }
          if (result && result.success === false) {
            showAlert(result.error, "warning");
          }
          },
          onError: (error) => {
            console.error("Error submitting data:", error.message);
          }
      })

      const addPostFunction = async (e) => {
        e.preventDefault();
        addPost({"link": addPostLink, "practicleId" : practicles.id});
        closeAddPostModal.current.click();
      };

    return (
        <>
          <h1>Link for {practicles.stage} Practicle</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          <button className="btn btn-primary col-6 col-sm-6 mt-2 mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal"> ADD NEW POST</button>
          
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add Post{" "}
                  </h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form action="" method="post">
                    <div className="mb-3">
                      <label htmlFor="link" className="form-label">
                        Link
                      </label>
                      <input type="text" className="form-control" id="link" name="link" value={addPostLink} onChange={(e) => setAddPostLink(e.target.value)}/>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" ref={closeAddPostModal} data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={addPostFunction}>
                    Add Post
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          {posts && posts.map((practicleItem) => {
              return (
                <>
                  <small>{practicleItem.username}</small>
                  <div className="d-flex w-90 align-items-center justify-content-between">
                    <button className="btn btn-primary col-10" key={practicleItem._id} > {practicleItem.link} </button>
                    <div  className="d-flex">
                      <div className="d-flex align-items-center flex-column">
                        <a href="http://" className="fs-3 mx-1">&#128077;</a>
                        <small>789</small>
                      </div>
                      <div className="d-flex align-items-center flex-column">
                        <a href="http://" className="fs-3 mx-2">&#128078;</a>
                        <small>78</small>
                      </div>
                      {
                        practicleItem.username == localStorage.getItem('userName') && (
                            <>
                              <div className="d-flex align-items-center flex-column">
                              <a href="http://" className="fs-3 mx-2">&#128394;</a>
                              <small>Edit</small>
                              </div>
                              <div className="d-flex align-items-center flex-column">
                              <a href="http://" className="fs-3 mx-2">&#10060;</a>
                              <small>Delete</small>
                              </div>
                            </>
                        )
                      }
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
