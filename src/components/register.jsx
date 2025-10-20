import "../styles/login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;
export default function (props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password != formData.confirmPassword) {
      alert("Passwords didn't match. Please enter again.");
      return;
    }
    if (
      !formData.email.trim() ||
      !formData.username.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      alert("Please enter all required fields.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        formData
      );
      console.log(response.data);
      if (response.data.success) {
        props.giveAccess(true);
        navigate("/view");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data) {
        alert(error.response.data.message);
        // return;
      } else {
        alert("An unexpected error occured. Please try again.");
      }
    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-text">Sign up to UBlog</div>
        <form onSubmit={handleSubmit} className="form">
          <div className="login-input-container">
            <label className="login-input-label">Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className="login-input-container">
            <label className="login-input-label">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
            />
          </div>
          <div className="login-input-container">
            <label className="login-input-label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <div className="login-input-container">
            <label className="login-input-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Enter your password again"
              onChange={handleChange}
            />
          </div>
          <button className="login-button">Register</button>
          <p className="line-text">
            &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; or
            &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;
          </p>
        </form>
        <div className="google-and-register">
          <a
            href="http://localhost:5000/auth/google"
            className="google-login-button"
          >
            <svg
              className="google-icon"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25px"
              height="25px"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span className="google-text">Continue with Google</span>
          </a>
          <p className="register-text">
            Already have an account?
            <Link to="/" className="register-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
