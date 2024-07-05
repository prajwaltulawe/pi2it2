import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postSignupQuery } from "../hooks/authoriztionQueries";
import { useAlertContext } from "../context/alert/alertContext";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();

  const { mutate } = useMutation(postSignupQuery, {
    onSuccess: (result) => {
      if (result && result.success) {
        navigate("/login");
        showAlert("Account created successfully. Login to access", "warning");
      } else {
        showAlert("Some error occoured. Plz try again later !", "warning");
      }
      if (result && result.success === false) {
        showAlert(result.error, "warning");
      }
    },
    onError: (error) => {
      console.error("Error submitting data:", error.message);
    },
  });

  function  openWindow(url){
    window.location.href = url
  }  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/request",
      {
        method: "post"
      })
      const data = await response.json()
      console.log(data)
      openWindow(data.url)
    } catch (error) {
      showAlert("Some error occoured. Plz try again later !", "warning");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onFailure = (response) => {
    console.error('Google Sign-In failed:', response);
  };

  return (
    <div className="container-login100">
			<div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
				{/* <form className="login100-form validate-form" onSubmit={handleSignupSubmit}> */}
				<form className="login100-form validate-form">
					<span className="login100-form-title p-b-20">
						Signup
					</span>

					<div className="wrap-input100 validate-input" data-validate = "Username is reauired">
					</div>

					<div className="txt1 text-center p-t-20 p-b-20">
						<span>
							For integrity reasons you can only signup using I2IT collage email id.
						</span>
					</div>

          <div className="container-login100-form-btn p-t-10">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							{/* <button className="login100-form-btn bg3" onClick={() => navigate('/setPassword')}> */}
							<button className="login100-form-btn bg3" type="submit">
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
