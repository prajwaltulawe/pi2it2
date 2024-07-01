import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { postLoginQuery } from '../hooks/authoriztionQueries';
import { useAlertContext } from "../context/alert/alertContext";

const SetPassword = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const navigate = useNavigate();
    const { showAlert } = useAlertContext();

    const { mutate } = useMutation(postLoginQuery, {
        onSuccess: (result) => {
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
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-49">
              Set Password
            </span>

            <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
              <span className="label-input100">Password</span>
              <input className="input100" type="password" name="pass" placeholder="Type your password" required></input>
              <span className="focus-input100" data-symbol="&#xf190;"></span>
            </div>

                      <div className="wrap-input100 validate-input" data-validate="Password is required">
              <span className="label-input100">Confirm Password</span>
              <input className="input100" type="password" name="pass" placeholder="Confirm your password" required></input>
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

          </form>
        </div>
      </div>
    );
};

export default SetPassword;
