import React, { useState, useEffect } from 'react';
import ListOfResult from './Components/ListOfResult';
import FormData from './Components/FormData';
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Login from './Components/Login';
import Register from './Components/Register';

function Home() {
  const [showModal, setShowModal] = useState(true); // Default to show modal
  const [isLogin, setIsLogin] = useState(true); // State to switch between Login and Register forms

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (sessionUser) {
      setShowModal(false); // Close modal if user is logged in
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem('sessionUser', JSON.stringify(userData)); // Save user data
    setShowModal(false); // Close modal
  };

  const handleSwitchToRegister = () => {
    setIsLogin(false); // Switch to Register form
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true); // Switch to Login form
  };

  return (
    <>
      <Row>
        <Col md={6} className="scrollable-list">
          <ListOfResult />
        </Col>
        <Col md={6}>
          <FormData />
        </Col>
      </Row>

      {/* Modal for Login/Register */}
      <Modal show={showModal} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>{isLogin ? "Login" : "Register"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLogin ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Register onRegisterSuccess={handleSwitchToLogin} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <Button variant="link" onClick={handleSwitchToRegister}>
                Register here
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button variant="link" onClick={handleSwitchToLogin}>
                Login here
              </Button>
            </p>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
