import {FaFacebook, FaGithub, FaTwitter} from "react-icons/fa";
import React from "react";

const Footer = () => {
    return (
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
    );
};

export default Footer