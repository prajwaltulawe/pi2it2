import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getPracticleQuery } from '../hooks/nextTargetQueries';
import { addPostQuery, deletePostQuery, editPostQuery } from '../hooks/practiclePostsQueries';
import { useTargetContext } from "../context/nextTarget/targetContext";
import { useAlertContext } from "../context/alert/alertContext";

const Practicle = () => {
    const navigate = useNavigate();
    const { practicles} = useTargetContext();
    const { showAlert } = useAlertContext();
    const [addPostLink, setAddPostLink] = useState("");
    const [previousPostLink, setPreviousPostLink] = useState("");
    const [editPostLink, setEditPostLink] = useState("");
    const [editPostId, setEditPostId] = useState("");
    const closeAddPostModal = useRef(null);
    const post = [];
    const [posts, setPosts] = useState(post);

    // GET ALL POSTS
    const { mutate : getPracticleData } = useMutation(getPracticleQuery, {
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

    // ADD POSTS
    const { mutate : addPost } = useMutation(addPostQuery, {
      mutationKey: "addPost",
      onSuccess: (result) => {
        if (result.status !== 204 && result.link) {
          showAlert("Post Added !", "warning");
          let tempPost = {
            "_id": result._id,
            "link": result.link,
            "username": localStorage.getItem('userName'),
            "timestamp": new Date(Date.now()).toISOString().substring(0,10)
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

    // EDIT POST
    const { mutate : editPost } = useMutation(editPostQuery, {
      mutationKey: "editPost",
      onSuccess: (result) => {
        if (result.status !== 204 && result.success !== false) {
          showAlert("Post Edited !", "warning");
          let newPosts = JSON.parse(JSON.stringify(posts));
          for (let index = 0; index < newPosts.length; index++) {
            const element = newPosts[index];
            if (element._id === result.post._id) {
              element.link = result.post.link;
              element.timestamp = result.post.timestamp.substring(0, 10);
              break;
            }
          }
          setPosts(newPosts);
        } else if (result && result.success === false) {
          showAlert(result.error, "warning");
        }
        },
        onError: (error) => {
          console.error("Error submitting data:", error.message);
        }
    })
    const setEditPost = (post) => {
      setPreviousPostLink(post.link);
      setEditPostLink(post.link);
      setEditPostId(post._id);
    }
    const editPostFunction= () => {
      if(previousPostLink !== editPostLink){
        editPost({editPostId, editPostLink});
      }else{
        showAlert("No changes found !", "warning");
      }
    }

    // DELETE POST
    const { mutate : deletePost } = useMutation(deletePostQuery, {
      mutationKey: "deletePost",
      onSuccess: (result) => {
        if (result.status !== 204) {
          showAlert("Post Deleted !", "warning");
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
    const deletePostFunction = (id) => {
      deletePost(id);
      const newPosts = posts.filter((post) => {
        return post._id !== id;
      });
      setPosts(newPosts);
    }

    return (
        <>
          <h1>Link for {practicles.stage} Practicle</h1>
          <div className="container m-auto mt-4 d-flex flex-column"> 
          <button className="btn btn-primary col-6 col-sm-6 mt-2 mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal"> ADD NEW POST</button>
          
          {/* ADD MODAL */}
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Add Post</h1> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form action="" method="post">
                    <div className="mb-3">
                      <label htmlFor="link" className="form-label">Link</label>
                      <input type="text" className="form-control" id="link" name="link" value={addPostLink} onChange={(e) => setAddPostLink(e.target.value)}/>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" ref={closeAddPostModal} data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={addPostFunction}>Add Post</button>
                </div>
              </div>
            </div>
          </div>
    
          {/* EDIT MODAL */}
          <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Post</h1> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form action="" method="post">
                    <div className="mb-3">
                      <label htmlFor="link" className="form-label">Link</label>
                      <input type="text" className="form-control" id="link" name="link" value={editPostLink} onChange={(e) => {setEditPostLink(e.target.value)}}/>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" ref={closeAddPostModal} data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={()=>editPostFunction()}>Edit Post</button>
                </div>
              </div>
            </div>
          </div>

          {/* ALL POSTS */}
          {posts && posts.map((practicleItem) => {
              return (
                <>
                  <div className="d-flex flex-row justify-content-between col-10">
                    <small>{practicleItem.username}</small>
                    <small>{practicleItem.timestamp && practicleItem.timestamp.substring(0, 10)}</small>
                  </div>
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

                      {/* POST AUTHOR OPTIONS */}
                      {practicleItem.username === localStorage.getItem('userName') && (
                          <>
                            <div className="d-flex align-items-center flex-column">
                              <button className="fs-3 mx-2" style={{ background:"none", border:"none" }} onClick={() => setEditPost(practicleItem)} data-bs-toggle="modal" data-bs-target="#editModal">&#128394;</button>
                              <small>Edit</small>
                            </div>
                            <div className="d-flex align-items-center flex-column">
                              <button className="fs-3 mx-2" style={{ background:"none", border:"none" }} onClick={() =>deletePostFunction(practicleItem._id)}>&#10060;</button>
                              <small>Delete</small>
                            </div>
                          </>
                        )}
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
