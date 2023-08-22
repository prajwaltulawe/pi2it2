const baseUrl = process.env.REACT_APP_BASE_URL;

export const postSignupQuery = async (userData) => {
    const SignupResponse = await fetch(`${baseUrl}api/auth/createUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return SignupResponse.json();
};

export const postLoginQuery = async (userData) => {
    const loginResponse = await fetch(`${baseUrl}api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return loginResponse.json();
};
