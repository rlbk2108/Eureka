import Footer from "./layout/Footer";
import {CustomNavbar} from "./layout/Navbar";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
const CourseDetail = () => {
    const {id} = useParams();
    const [course, setCourseData] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/courses/${id}/`)
            .then(response => setCourseData(response.data))
            .catch(error => console.log(error))
    })

    return (
        <body>
            <CustomNavbar/>
                <main>
                    <h1>{course.title}</h1>
                </main>
            <Footer/>
        </body>
    );
};

export default CourseDetail