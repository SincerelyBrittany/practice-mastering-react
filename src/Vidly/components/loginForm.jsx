import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import Input from "../common/input";
import * as authService from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),

    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      await authService.login(
        this.state.data.username,
        this.state.data.password
      );

      // this.props.history.push("/");
      // console.log(jwt, "this isjwt");

      //must do a full reload so must updat ethe window and not just reroute

      // window.location = "/";

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
