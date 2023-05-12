import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "./logo.png";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel"
import React, { useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import jwt_decode from 'jwt-decode';
import { FaGithub, FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";

const Home = () => {

  const [isAuth, setIsAuth] = useState(false);
  let access = localStorage.getItem('access_token');
  const [coursesData, setCoursesData] = useState([]);
  const [user, setUser] = useState(null);

    useEffect(() => {
     if (access !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);

  useEffect(() => {
      const token = jwt_decode(localStorage.getItem('access_token'));
      axios
        .get(`http://localhost:8000/api/users/${token['user_id']}/`)
        .then(r => {
            setUser(r.data['username'])
        })
        .catch(error => {
        console.log("error", error);

  });
  })

   useEffect(() => {
       fetch(
           "http://localhost:8000/api/courses/",
           {method: "GET"}
       )
           .then(response => response.json())
           .then(courses => {
               setCoursesData(courses)
           })
   })

    const logoutHandler = e => {
      e.preventDefault()
        axios
            .post('http://localhost:8000/api/logout/')
            .then(response=> {
                console.log("response", response);
            })
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
    };


    const images = [
        "https://www.techadvisor.com/wp-content/uploads/2022/06/best-online-coding-course-providers-main.jpg?quality=50&strip=all",
        "https://assets-prd.ignimgs.com/2021/09/01/sale-301982-article-image-1630523474787.jpeg",
        "https://media.geeksforgeeks.org/wp-content/uploads/20191113114209/CTutorial.png"
    ];

  return (
      <body>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Eureka!
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
              {isAuth ? <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <a className="btn btn-dark">Hi, {user}</a>
                <Button variant="outline-light" onClick={logoutHandler}>Log Out</Button>
              </div>
                  :
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button className="btn btn-dark" href="/auth">Log in</Button>
                <Button variant="outline-light">Sign up</Button>
              </div>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <main style={{backgroundColor: '#0d1117'}}>
          <div className="container-sm center" style={{backgroundColor: '#0d1117'}}>
              <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                  {images.map((imageUrl, index) => (
                      <Carousel.Item key={index}>
                        <img src={imageUrl} className="d-block w-80" alt="..." />
                      </Carousel.Item>
                  ))}
              </Carousel>
            </div>
          <div className="container">
              <h1 className='text-white'>All courses</h1>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                  {coursesData.map((course) => (
                      <div className="col">
                          <div className="card h-100" >
                              <img src={course.poster} className="card-img-top" alt="..."/>
                                  <div className="card-body">
                                      <h5 className="card-title">{course.title}</h5>
                                      <p className="card-text">{course.description}</p>
                                      <a href="#" className="btn btn-primary">More</a>
                                  </div>
                          </div>
                      </div>
                    ))}
              </div>
          </div>
      </main>
      <footer className="bg-dark text-center text-white">
          <div className="container p-4 pb-0">
              <section className="mb-4">
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#3b5998'}}
                      href="#"
                      role="button"
                  ><i className={FaFacebook}></i></a>
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#55acee'}}
                      href="#"
                      role="button"
                  ><i className={FaTwitter}></i></a>
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#dd4b39'}}
                      href="#"
                      role="button"
                  ><i className="fab fa-google"></i></a>
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#ac2bac'}}
                      href="#"
                      role="button"
                  ><i className="fab fa-instagram"></i></a>
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#0082ca'}}
                      href="#"
                      role="button"
                  ><i className="fab fa-linkedin-in"></i></a>
                  <a
                      className="btn text-white btn-floating m-1"
                      style={{backgroundColor: '#333333'}}
                      href="#"
                      role="button"
                  ><i className={FaGithub}></i></a>
              </section>
          </div>
          <div className="text-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
              IUCA 2023
          </div>
      </footer>
      </body>
  );
}

export default Home;