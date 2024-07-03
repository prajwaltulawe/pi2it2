import React, {useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { postLoginQuery } from '../hooks/authoriztionQueries';
import { useAlertContext } from "../context/alert/alertContext";
import LoadingBar from 'react-top-loading-bar'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const progressRef = useRef(null)

    const navigate = useNavigate();
    const { showAlert } = useAlertContext();

    const { mutate } = useMutation(postLoginQuery, {
        onSuccess: (result) => {
            progressRef.current.complete()
            if (result && result.success) {
              localStorage.setItem('token', result.authToken);
              localStorage.setItem('userName', result.userName);
              navigate("/fetchPattern");
              showAlert("Successfully LogedIn", "warning");
            } else {
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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            progressRef.current.continuousStart()
            mutate({ email: credentials.email, password: credentials.password});
        } catch (error) {
            showAlert("Some error occoured. Plz try again later !", "warning");
        }
    };

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="container-login100">
            <LoadingBar color='#f11946' ref={progressRef} shadow={true}/>
            <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">

                <form className="login100-form validate-form" onSubmit={handleLoginSubmit}>
                    <span className="login100-form-title p-b-49">
                        Login
                    </span>

                    <div className="wrap-input100 validate-input m-b-23" data-validate = "Username is reauired">
                        <span className="label-input100" htmlFor="email">Email Id</span>
                        <input className="input100" type="email" id="email" name="email" onChange={onChange} value={credentials.email} placeholder="Type your email" required></input>
                        <span className="focus-input100" data-symbol="&#xf206;"></span>
                    </div>

                    <div className="wrap-input100 validate-input" data-validate="Password is required">
                        <span className="label-input100" htmlFor="password" >Password</span>
                        <input className="input100" type="password" id="password" name="password" onChange={onChange} value={credentials.password} placeholder="Type your password" required></input>
                        <span className="focus-input100" data-symbol="&#xf190;"></span>
                    </div>
                    
                    <div className="text-right p-t-8 p-b-31">
                        <a href="#" onClick={() => navigate('/forgetPassword')}>
                            Forgot password?
                        </a>
                    </div>
                    
                    <div className="container-login100-form-btn">
                        <div className="wrap-login100-form-btn">
                            <div className="login100-form-bgbtn"></div>
                            {/* <button className="login100-form-btn" type="submit" onClick={() => navigate('/fetchPattern')}> */}
                            <button className="login100-form-btn" type="submit">
                                Login
                            </button>
                        </div>
                    </div>

                    <div className="txt1 text-center p-t-54 p-b-20">
                        <span>
                            Don't have a account ? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
