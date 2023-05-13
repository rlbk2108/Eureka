import '../../App.css';
import React, {useEffect, useState} from "react"
import axios from "axios";

// eslint-disable-next-line
export default function (props) {
  let [authMode, setAuthMode] = useState("signin");
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  let [first_name, setFirstName] = useState('');
  let [last_name, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [username, setUsername] = useState('');
  let [loginPassword, setLoginPassword] = useState('');
  let [password1, setPassword1] = useState('');
  let [password2, setPassword2] = useState('');
  let [access, setAccess] = useState(localStorage.getItem('accessToken'))
  let [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  let [refreshRequired, setRefreshRequired] = useState(false)
  let [error, setError] = useState()
  let csrftoken = getCookie('csrftoken')
  // Create the submit method.

  const register = async e => {
    e.preventDefault();
      await axios
          .post('http://localhost:8000/api/users/',
        {username: username,
              first_name: first_name,
              last_name: last_name,
              email: email,
              password1: password1,
                password2: password2
              },
              {
                headers: {'Content-Type': 'application/json'}
              })


      await axios
          .post('http://localhost:8000/api/login/',
          {username: username,
                password: password1},
              {
                headers: {'Content-Type': 'application/json'}
              })
          .then(response => {
            localStorage.clear();
            localStorage.setItem('access_token', response.data['access']);
            localStorage.setItem('refresh_token', response.data['refresh']);
            axios.defaults.headers.common['Authorization'] =
                `Bearer ${response.data['access']}`;
            window.location.href = '/'
          })
          .catch(err => {console.log(err)})
  }

   useEffect(() => {
    if (access) {
     fetch(
         '/api/courses/',
         {
         headers: {
           'Content-Type': 'application/json;charset=utf-8',
           'Authorization': `Bearer ${access}`,},
         }
     )
       .catch(error => {
        if (error.message === 'refresh') {
          setRefreshRequired(true)
        } else {
          console.log(error)
          setError('Ошибка, подробности в консоли')
        }
       })
      }
    }
    ,[access])


  useEffect(() => {
    if (refreshRequired) {
    fetch(
        '/api/login/refresh/',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ refresh })
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({access, refresh}) => {
        localStorage.setItem('accessToken', access)
        setAccess(access)
        localStorage.setItem('refreshToken', refresh)
        setRefresh(refresh)
        setError(null)
      })
      .catch(error => {
        console.log(error)
        setError('Ошибка, подробности в консоли')
      })
    }
  }, [refreshRequired])

  const loginHandler = e => {
    console.log('start login process')
    e.preventDefault();
    axios
        .post('http://localhost:8000/api/login/', {
            username: username,
            password: loginPassword
            },
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        })
        .catch(bodyErr => console.log(bodyErr))
        .then(r => {
          localStorage.clear();
          localStorage.setItem('access_token', r.data['access'])
          console.log(r.data['access'])
          setAccess(r.data['access'])
          localStorage.setItem('refresh_token', r.data['refresh'])
          setRefresh(r.data['refresh'])
          setError(null)
          axios.defaults.headers.common['Authorization'] =
                `Bearer ${r.data['access']}`;
          console.log("success")
          window.location.href = '/'
        })
        .catch(err =>
            setError(err))
  }


    if (authMode === "signin") {
      return (
          <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={loginHandler}>
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
                      value={loginPassword}
                      type="password"
                      className="form-control mt-1"
                      placeholder="Enter password"
                      required
                      onChange={e => setLoginPassword(e.target.value)}
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
                    onChange={e => setPassword1(e.target.value)}
                />
              </div>
                <div className="form-group mt-3">
                <label>Confirm the password</label>
                <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Repeat the password"
                    onChange={e => setPassword2(e.target.value)}
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
