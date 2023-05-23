import Carousel from "react-bootstrap/Carousel"
import React, { useState, useEffect} from 'react';
import '../../App.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {Modal} from "react-bootstrap";
import axios from "axios";


function Home(props) {
  const [coursesData, setCoursesData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');


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
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
    };

      const [showModal, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const handleFileSelect = (event) => {
        setImage(event.target.files[0])
      }

      const createCourse = async (event) => {
          event.preventDefault()
          let courseCreateForm = new FormData();
          courseCreateForm.append('title', title);
          courseCreateForm.append('description', description);
          courseCreateForm.append('poster', image);
          courseCreateForm.append('price', price);
          courseCreateForm.append('discount', discount);

          await axios
              .post('http://localhost:8000/api/courses/',
                  courseCreateForm, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                      'Authorization': `Token ${localStorage.getItem('access_token')}`
                  }
              })
              .catch(error => {
                  console.log(error)
              })
          handleClose()
      }



    const images = [
        "https://www.techadvisor.com/wp-content/uploads/2022/06/best-online-coding-course-providers-main.jpg?quality=50&strip=all",
        "https://assets-prd.ignimgs.com/2021/09/01/sale-301982-article-image-1630523474787.jpeg",
        "https://media.geeksforgeeks.org/wp-content/uploads/20191113114209/CTutorial.png"
    ];

  return (
      <body>
        <Navbar/>
      <main style={{backgroundColor: '#0d1117'}}>
          <div className="container-sm center" style={{backgroundColor: '#0d1117'}}>
              <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                  {images.map((imageUrl, index) => (
                      <Carousel.Item key={index} style={{width: 800, height: "auto"}}>
                        <img src={imageUrl} className="d-block w-100 h-50" alt="..." />
                      </Carousel.Item>
                  ))}
              </Carousel>
            </div>
          <div className="container bg-dark rounded-3 p-xl-5">
              <div className="container-fluid py-5">
                  <h1 className="display-5 fw-bold text-white">All courses</h1>
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                  {coursesData.map((course) => (
                      <div className="col">
                          <div className="card border-dark align-text-bottom" >
                              <img src={course.poster} className="card-img-top" style={{height: 200}} alt="..."/>
                                  <div className="card-body" style={{backgroundColor: '#212b3a'}}>
                                      <h5 className="card-title text-white">{course.title}</h5>
                                      <p className="card-text text-white">{course.description}</p>
                                      <Link to={`courses/${course.id}/`} className="btn btn-primary">More</Link>
                                  </div>
                          </div>
                      </div>
                    ))}
                </div>
                  <div className="text-center mt-lg-4">
                      <button type="button"
                              className="btn btn-primary"
                              onClick={handleShow}>Create one</button>
                  </div>
              </div>
          </div>
          <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "10vh" }}>

      </div>
      <Modal className="my-modal" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">Create course</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
            <label>Course title</label>
            <div className="input-group mb-3">
                <input type="text"
                       className="form-control mt-1"
                       placeholder="C++, Java or Python..."
                       onChange={e => setTitle(e.target.value)}/>
            </div>
            <label>Description</label>
            <div className="input-group mb-3">
                <textarea
                    className="form-control mt-1"
                    placeholder="Describe your awesome course"
                    onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <label>Choose a poster</label>
            <div className="input-group mb-3">
                <input type="file" className="form-control mt-1" onChange={handleFileSelect}/>
            </div>
            <label>Price and discount</label>
                <div className="row g-2">
                  <div className="col-md">
                    <input
                        className="form-control mt-1"
                        placeholder="150$"
                        onChange={e => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-md">
                    <input
                        className="form-control mt-1"
                        placeholder="30%"
                        onChange={e => setDiscount(e.target.value)}
                    />
                  </div>
                </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="text-white">
            Close
          </Button>
          <Button variant="primary" onClick={createCourse} className="text-white">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      </main>
      <Footer/>
      </body>
  );
}

export default Home;