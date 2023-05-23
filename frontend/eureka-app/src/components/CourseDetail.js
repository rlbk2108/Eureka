import Footer from "./layout/Footer";
import {CustomNavbar} from "./layout/Navbar";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
const CourseDetail = () => {
    const {id} = useParams();
    const [course, setCourseData] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/courses/${id}/`)
            .then(response => setCourseData(response.data))
            .catch(error => console.log(error))
    })

    const deleteHandler = () => {
        axios
            .delete(`http://localhost:8000/api/courses/${id}/`)
            .then(response => console.log(response))
            .catch(err => console.log(err))
        window.location = '/'
    }

    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileSelect = (event) => {
        setImage(event.target.files[0])
    }

    let [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    useEffect(() => { setTitle(course.title)}, [course.title] )
    useEffect(() => { setDescription(course.description)}, [course.description] )
    useEffect(() => { setImage(course.poster)}, [course.poster] )
    useEffect(() => { setPrice(course.price)}, [course.price] )
    useEffect(() => { setDiscount(course.discount)}, [course.discount] )


    const createCourse = async (event) => {
      event.preventDefault()
      let courseCreateForm = new FormData();
      courseCreateForm.append('title', title);
      courseCreateForm.append('description', description);
      courseCreateForm.append('poster', image);
      courseCreateForm.append('price', price);
      courseCreateForm.append('discount', discount);

      await axios
          .put(`http://localhost:8000/api/courses/${id}/`,
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

    const get = (p, o) =>
        p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
    return (
        <body>
            <CustomNavbar/>
                <main style={{backgroundColor: '#0d1117'}}>
                    <div className="container">
                        <h1 className="text-white">Course details</h1>
                    <div className="card border-dark" style={{width: 700, height: "auto"}}>
                        <img src={course.poster} className="card-img-top" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                                <p className="card-text"><small className="text-muted">Price: <strong>{course.price}$</strong></small>
                                </p>
                                <div className="d-grid gap-2 col-3 mx-auto text-right">
                                    <button className="btn btn-primary" type="button" onClick={handleShow}>Edit</button>
                                    <button className="btn btn-danger" type="button" onClick={deleteHandler}>Delete</button>
                                </div>
                            </div>
                        <div className="card-footer text-center">Author:
                             <a href={
                                 course.author === undefined ? null
                                 :
                                 course.author.url}> <strong>{course.author === undefined ? null : course.author.username}</strong></a>
                        </div>
                        </div>
                    </div>
                          <Modal className="my-modal" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">Edit course</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
            <label>Course title</label>
            <div className="input-group mb-3">
                <input type="text"
                       className="form-control mt-1"
                       placeholder="C++, Java or Python..."
                       value={title}
                       onChange={e => setTitle(e.target.value)}/>
            </div>
            <label>Description</label>
            <div className="input-group mb-3">
                <textarea
                    className="form-control mt-1"
                    placeholder="Describe your awesome course"
                    value={course.description}
                    onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <label>Choose a poster</label>
            <div className="input-group mb-3">
                <input type="file"
                       className="form-control mt-1"
                       onChange={handleFileSelect}/>
            </div>
            <label>Price and discount</label>
                <div className="row g-2">
                  <div className="col-md">
                    <input
                        className="form-control mt-1"
                        placeholder="150$"
                        value={course.price}
                        onChange={e => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-md">
                    <input
                        className="form-control mt-1"
                        placeholder="30%"
                        value={course.discount}
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
                        Save
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </main>
            <Footer/>
        </body>
    );
};

export default CourseDetail