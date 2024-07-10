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

  /*
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
*/


const handleSignupSubmit = async (e) => {
  e.preventDefault();
  try {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: "http://127.0.0.1:5000/api/auth/oauth",
      client_id: "394715928187-o8usjrlgfc5uf2v15orqjjls593ekf1f.apps.googleusercontent.com",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    console.log(`${rootUrl}?${qs.toString()}`)
    window.location.href = `${rootUrl}?${qs.toString()}` 
  } catch (error) {
    showAlert("Some error occoured. Plz try again later !", "warning");
  }
};

  return (
    <div className="container-login100">
			<div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
				<form className="login100-form validate-form" onSubmit={handleSignupSubmit}>
				{/* <form className="login100-form validate-form"> */}
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
