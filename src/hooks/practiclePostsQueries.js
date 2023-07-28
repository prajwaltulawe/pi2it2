export const addPostQuery = async ({link, practicleId}) => {
    const addPostResponse = await fetch(`http://localhost:5000/api/posts/addPost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ link, practicleId})
    });
    if(addPostResponse.status !== 204){
        return addPostResponse.json();
    }
};

export const deletePostQuery = async (postId) => {
    const deletePostResponse = await fetch(`http://localhost:5000/api/posts/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    if(deletePostResponse.status !== 204){
        return deletePostResponse.json();
    }
};

export const editPostQuery = async ({editPostId, editPostLink}) => {
    console.log(editPostLink);
    const editPostResponse = await fetch(`http://localhost:5000/api/posts/updatePost/${editPostId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({link : editPostLink})
    });
    console.log(JSON.stringify({link : editPostId}));
    if(editPostResponse.status !== 204){
        return editPostResponse.json();
    }
};
