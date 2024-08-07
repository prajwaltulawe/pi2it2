import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { getResetPasswordLink } from '../hooks/authoriztionQueries';
import { useAlertContext } from "../context/alert/alertContext";

const ForgetPassword = (props) => {
    const [credentials, setCredentials] = useState({email: ""});
    const navigate = useNavigate();
    const { showAlert } = useAlertContext();

    const { mutate } = useMutation(getResetPasswordLink, {
        onSuccess: (result) => {
            if (result && result.success) {
              showAlert("Password reset link has been sent to your email id !", "warning");
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

    const handleResetPasswordLink = async (e) => {
        e.preventDefault();
        try {
            mutate({ email: credentials.email});
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
				<form className="login100-form validate-form" onSubmit={handleResetPasswordLink}>
					<span className="login100-form-title p-b-49">
						Forget Password
					</span>

					<div className="wrap-input100 validate-input m-b-23" data-validate = "Username is required">
						<span className="label-input100">Email Id</span>
						<input className="input100" type="email" name="email" id="email" onChange={onChange} value={credentials.email} placeholder="Type your registered email id" required></input>
						<span className="focus-input100" data-symbol="&#xf206;"></span>
					</div>
					
					<div className="container-login100-form-btn">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							<button className="login100-form-btn" type="submit">
								Send Password Reset Link
							</button>
						</div>
					</div>
                    <div className="txt1 text-center p-t-20 p-b-20">
						<span>
							<a href="#" onClick={() => navigate('/')}>Back to Login</a>
						</span>
					</div>
				</form>
			</div>
		</div>
    );
};

export default ForgetPassword;
