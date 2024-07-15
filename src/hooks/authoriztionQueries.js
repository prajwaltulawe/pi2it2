// const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000/";
const baseUrl = "http://localhost:5000/";

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

export const postUserCredentials = async (userData) => {
    const UserCredentialsResponse = await fetch(`${baseUrl}api/auth/getOAuthUserData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return UserCredentialsResponse.json();
};

export const getResetPasswordLink = async (userData) => {
    const UserCredentialsResponse = await fetch(`${baseUrl}api/auth/getResetPasswordLink`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return UserCredentialsResponse.json();
};

export const postResetPasswordQuery = async (userData) => {
    const resetPasswordResponse = await fetch(`${baseUrl}api/auth/resetPassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return resetPasswordResponse.json();
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
