export const postSignupQuery = async (userData) => {
    const SignupResponse = await fetch(`http://localhost:5000/api/auth/createUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return SignupResponse.json();
};

export const postLoginQuery = async (userData) => {
    const loginResponse = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return loginResponse.json();
};
