import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const loginResponse = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password }),
        });

        const response = await loginResponse.json();
        if (response.success) {
            localStorage.setItem('token', response.authToken);
            navigate('/');
            props.showAlert("Successfully LogedIn", "warning")
        } else{
            props.showAlert("Invalid Credentials", "alert")
        }
    };

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="container m-auto mt-4"> 
        <h1>LOGIN</h1>
            <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control mt-2" id="email" name="email" onChange={onChange} value={credentials.email} aria-describedby="email"
                        placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted mt-1">
                        We'll never share your email with anyone else.
                    </small>
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control mt-2" id="password" name="password" onChange={onChange} value={credentials.password} placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary mt-2" >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
