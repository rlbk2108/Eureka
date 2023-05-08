import './App.css';
import React, { useState } from "react"
import axios from "axios";

// eslint-disable-next-line
export default function (props) {
  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  let [first_name, setFirstName] = useState('');
  let [last_name, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  // Create the submit method.

  const register = async e => {
    e.preventDefault();
    const user = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    };

    const token_user = {
      username: username,
      password: password
    };
      await axios.post('http://localhost:8000/api/users/',
          JSON.stringify(user), {headers: {'Content-Type': 'application/json'}, withCredentials: true})

    console.log("lol")


      const {data} = await
      axios.post('http://localhost:8000/api/token/',
          JSON.stringify(token_user), {headers: {'Content-Type': 'application/json'}, withCredentials: true})

      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axios.defaults.headers.common['Authorization'] =
          `Bearer ${data['access']}`;
      window.location.href = '/'
  }

  const login = async e => {
    e.preventDefault();

    const config = {
    headers: {
      'Content-Type': 'application/json',
      },
      withCredentials: true
    };

    const user = {
      username: username,
      password: password
    };
    console.log(username)
    // Create the POST request
    const {data} = await
        axios.post('http://localhost/api/token',
            JSON.stringify(user), config);

    // Initialize the access & refresh token in localstorage.
    localStorage.clear();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    axios.defaults.headers.common['Authorization'] =
        `Bearer ${data['access']}`;
    window.location.href = '/'
  }
    if (authMode === "signin") {
      return (
          <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={login}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="text-center">
                  Not registered yet?{" "}
                  <p className="link-primary" onClick={changeAuthMode}>
                    <a href="#">Sign Up</a>
                  </p>
                </div>
                <div className="form-group mt-3">
                  <label>Username</label>
                  <input
                      value={username}
                      className="form-control mt-1"
                      placeholder="Enter username"
                      required
                      onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                      value={password}
                      type="password"
                      className="form-control mt-1"
                      placeholder="Enter password"
                      required
                      onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
                <p className="text-center mt-2">
                  Forgot <a href="#">password?</a>
                </p>
              </div>
            </form>
          </div>
      )
    }

    return (
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={register}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
              </div>
              <div className="form-group mt-3">
                <label>Full Name</label>
                <div className="row g-2">
                  <div className="col-md">
                    <input
                        className="form-control"
                        placeholder="First name"
                        onChange={e => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-md">
                    <input
                        className="form-control"
                        placeholder="Last name"
                        onChange={e => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mt-3">
                <label>Username</label>
                <input
                    className="form-control mt-1"
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Email Address"
                    onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <p className="text-center mt-2">
                Forgot <a href="#">password?</a>
              </p>
            </div>
          </form>
        </div>
    )
}
