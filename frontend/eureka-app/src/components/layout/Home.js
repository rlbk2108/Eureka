import Carousel from "react-bootstrap/Carousel"
import React, { useState, useEffect} from 'react';
import '../../App.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {Link} from "react-router-dom";


const Home = () => {
  const [coursesData, setCoursesData] = useState([]);


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
              </div>
          </div>
      </main>
      <Footer/>
      </body>
  );
}

export default Home;