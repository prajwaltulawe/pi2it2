import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postSignupQuery } from '../hooks/authoriztionQueries'



const Signup = (props) => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    });
    
    const { mutate, isLoading, isError, error, data } = useMutation(postSignupQuery);
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await mutate({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
            });
            if (result.success) {
                navigate("/login");
                props.showAlert(
                    "Account created successfully. Login to access",
                    "warning"
                );
            } else {
                props.showAlert("Invalid Credentials", "alert");
            }
        } catch (error) {
            console.error("Error submitting data:", error.message);
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container m-auto mt-4">
            <h1>SIGN UP</h1>
            <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control mt-2"
                        id="name"
                        name="name"
                        onChange={onChange}
                        value={credentials.name}
                        aria-describedby="name"
                        placeholder="Enter Name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control mt-2"
                        id="email"
                        name="email"
                        onChange={onChange}
                        value={credentials.email}
                        aria-describedby="email"
                        placeholder="Enter email"
                    />
                    <small id="emailHelp" className="form-text text-muted mt-1">
                        We'll never share your email with anyone else.
                    </small>
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control mt-2"
                        id="password"
                        name="password"
                        onChange={onChange}
                        value={credentials.password}
                        placeholder="Password"
                    />
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control mt-2"
                        id="cpassword"
                        name="cpassword"
                        onChange={onChange}
                        value={credentials.cpassword}
                        placeholder="Confirm Password"
                    />
                </div>
                <button
                    type="submit"
                    disabled={credentials.password !== credentials.cpassword}
                    className="btn btn-primary mt-2"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
};

export default Signup;
