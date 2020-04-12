import React, { Fragment, useState } from "react";
import axios from "axios"; //axios ---very popular javascript library so that you can use to perform HTTP requests
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData; //destructuring
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //...formData spread operator to copy previous data

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Success");
  };

  return (
    <Fragment>
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead">
        <i class="fas fa-user"></i> Sign In Your Account
      </p>
      <form class="form" onSubmit={(e) => onSubmit(e)}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <p class="my-1">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Fragment>
  );
};
export default Login;
