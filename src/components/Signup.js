import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postUserCredentials } from "../hooks/authoriztionQueries";
import { useAlertContext } from "../context/alert/alertContext";
import { useGoogleLogin } from '@react-oauth/google';
import LoadingBar from 'react-top-loading-bar'

const Signup = () => {
  const progressRef = useRef(null)
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();

  const { mutate } = useMutation(postUserCredentials, {
    onSuccess: (result) => {
      if (result && result.success) {
        localStorage.setItem('signupEmail', result.data.email);
        localStorage.setItem('signupUserName', result.data.name);
        progressRef.current.complete()
        navigate("/setPassword");
        showAlert("Set new password", "warning");
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
      showAlert("Some error occoured. Plz try again later !", "warning");
    },
  });
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      progressRef.current.continuousStart()
      getToken()
    } catch(err){
      showAlert(err, "warning");
    }
  }

  const getToken = useGoogleLogin({
    onSuccess: tokenResponse => {
      const access_token = tokenResponse.access_token;
      mutate({ access_token });
    },
    onError: (error) => showAlert(error, "warning")
  });

  return (
    <div className="container-login100">
      <LoadingBar color='#f11946' ref={progressRef} shadow={true}/>
			<div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
				<form className="login100-form validate-form" onSubmit={handleSignupSubmit}>
					<span className="login100-form-title p-b-20">
						Signup
					</span>

					<div className="wrap-input100 validate-input" data-validate = "Username is reauired">
					</div>

					<div className="txt1 text-center p-t-20 p-b-20">
						<span>
							For integrity purpose only students with I2IT collage email id are allowed to signup using.
						</span>
					</div>

          <div className="container-login100-form-btn p-t-10">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							<button className="login100-form-btn bg3" type="submit" >
                <i className="fa fa-google p-r-10"></i> 
								Signup with Google
							</button>
						</div>
					</div>

          <div className="txt1 text-center p-t-54 p-b-20">
						<span>
							Already have a account ? <a href="#" onClick={() => navigate('/')}>Login</a>
						</span>
					</div>

				</form>
			</div>
		</div>
  );
};

export default Signup;