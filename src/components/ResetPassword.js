import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { postResetPasswordQuery } from '../hooks/authoriztionQueries';
import { useAlertContext } from "../context/alert/alertContext";

const ResetPassword = (props) => {
  const [credentials, setCredentials] = useState({ id:"", token:"", pass: "", cpass: "" });
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  
  const { id, token } = useParams();
  useEffect(() => {
    if (id) {
      setCredentials(prevCredentials => ({
        ...prevCredentials,
        id: id,
        token: token
      }));
    }
  }, []);

  const { mutate } = useMutation(postResetPasswordQuery, {
    onSuccess: (result) => {
      if (result && result.success) {

        navigate("/login");
        showAlert("Password changed successfully. Please login with your new password!", "warning");
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

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (credentials.pass === credentials.cpass) {
        mutate({ id: credentials.id, password: credentials.pass, token: credentials.token });
      }else{
        showAlert("Some error occoured. Plz try again later !", "warning");
      }
    } catch (error) {
      showAlert("Password do not match.", "warning");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-login100">
      <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
        <form className="login100-form validate-form" onSubmit={handleResetPasswordSubmit}>
          <span className="login100-form-title p-b-49">
            Reset Password
          </span>

          <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
            <span className="label-input100">New Password</span>
            <input className="input100" type="password" name="pass" id="pass" onChange={onChange} placeholder="Type your password" required></input>
            <span className="focus-input100" data-symbol="&#xf190;"></span>
          </div>

          <div className="wrap-input100 validate-input" data-validate="Password is required">
            <span className="label-input100">Confirm New Password</span>
            <input className="input100" type="password" name="cpass" id="cpass" onChange={onChange} placeholder="Confirm your password" required></input>
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

export default ResetPassword;
