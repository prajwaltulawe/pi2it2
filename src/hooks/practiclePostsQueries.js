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