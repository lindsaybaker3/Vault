import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const SignupForm = ({ addUser }) => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: ["USER"],
    enabled: true,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
          setUserData({
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            roles: ["USER"],
            enabled: true,
          });
        } else {
          return response.json();
        }
      })
      .then((errors) => {
        console.log(errors);
        const errorsList = errors?.errorMessages;
        if (Array.isArray(errorsList)) {
          setErrors(errorsList);
        } else {
          setErrors([errorsList]);
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(errors, "errors");
  return (
    <div className="login-form">
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        {errors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}
        <fieldset>
          <label htmlFor="firstname-input">First Name: </label>
          <input
            id="firstname-input"
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="lastname-input">Last Name: </label>
          <input
            id="lastname-input"
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="username-input">Username: </label>
          <input
            id="username-input"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password-input">Password: </label>
          <input
            id="password-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
        </fieldset>
        <div className="group-button">
          <button type="submit">Create User</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
