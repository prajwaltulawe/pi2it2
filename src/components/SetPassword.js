import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { postSignupQuery } from '../hooks/authoriztionQueries';
import { useAlertContext } from "../context/alert/alertContext";
import LoadingBar from 'react-top-loading-bar'

const SetPassword = (props) => {
  const progressRef = useRef(null)
  const [credentials, setCredentials] = useState({name: "", email: "", pass: "", cpass: ""});

  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    const storedUserName = localStorage.getItem('signupUserName');

    if (storedEmail) {
      setCredentials(prevCredentials => ({
        ...prevCredentials,
        email: storedEmail
      }));
    }

    if (storedUserName) {
      setCredentials(prevCredentials => ({
        ...prevCredentials,
        name: storedUserName
      }));
    }
  }, []);

  const navigate = useNavigate();
  const { showAlert } = useAlertContext();

  const { mutate } = useMutation(postSignupQuery, {
      onSuccess: (result) => {
          if (result && result.success) {
            localStorage.setItem('token', result.authToken);
            localStorage.setItem('userName', result.userName);
            progressRef.current.complete()
            navigate("/");
            showAlert("Account created successfully. You can login!", "warning");
          } else {
            progressRef.current.complete()
            showAlert("Some error occoured. Plz try again later !", "warning");
          }
          if (result && result.success === false) {
              progressRef.current.complete()
              showAlert(result.error, "warning");
            }
        },
        onError: (error) => {
          console.error("Error submitting data:", error.message);
        }
  })

  const handleSetPasswordSubmit = async (e) => {
      e.preventDefault();
      try {
        if (credentials.pass === credentials.cpass) {
          progressRef.current.continuousStart()
          mutate({ name: credentials.name, email: credentials.email, password: credentials.pass});
        }else{
          progressRef.current.complete()
          showAlert("Password do not match.", "warning");
        }
      } catch (error) {
        progressRef.current.complete()
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
        <form className="login100-form validate-form" onSubmit={handleSetPasswordSubmit}>
          <span className="login100-form-title p-b-49">
            Set Password
          </span>

          <div className="wrap-input100 validate-input m-b-23" data-validate="User Name is required">
            <span className="label-input100">User Name</span>
            <input className="input100" type="text" name="name" id="name" placeholder={credentials.name} disabled required></input>
            <span className="focus-input100" data-symbol="&#xf206;"></span>
          </div>

          <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
            <span className="label-input100">Password</span>
            <input className="input100" type="password" name="pass" id="pass" onChange={onChange} value={credentials.password} placeholder="Type your password" required></input>
            <span className="focus-input100" data-symbol="&#xf190;"></span>
          </div>

          <div className="wrap-input100 validate-input" data-validate="Password is required">
            <span className="label-input100">Confirm Password</span>
            <input className="input100" type="password" name="cpass" id="cpass" onChange={onChange} value={credentials.cpassword} placeholder="Confirm your password" required></input>
            <span className="focus-input100" data-symbol="&#xf190;"></span>
          </div>
          
          <div className="text-right p-t-8 p-b-31">
          </div>
          
          <div className="container-login100-form-btn">
            <div className="wrap-login100-form-btn">
              <div className="login100-form-bgbtn"></div>
              <button className="login100-form-btn">
                Set Password
              </button>
            </div>
          </div>

          <div className="txt1 text-center p-t-54 p-b-20">
						<span>
							Back to login ? <a onClick={() => navigate('/')}>Login</a>
						</span>
					</div>

        </form>
      </div>
    </div>
  );
};

export default SetPassword;