import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";


function Header() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(); 
      const formattedTime = now.toLocaleTimeString(); 
      setDateTime(`${formattedDate} ${formattedTime}`); 
    }, 10); 

    return () => clearInterval(interval); // 
  }, []);

  const navigate = useNavigate();

  return (
    <>

    <Navbar expand="lg" className="navbar ">
      <Container>
        <Navbar.Brand href="/" className="text-white">
          TALUKDER BRIDGE SCALE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Button style={{ height: "40px", marginRight: "5px" }} onClick={() => navigate("/")} variant="outline-info">
              Home
            </Button>

            <Button style={{ height: "40px" }} onClick={() => navigate("/console")} variant="outline-info">
              Console
            </Button>

            <div>
              <p
                id="times"
                style={{
                  color: "white",
                  marginLeft: "150px",
                  marginTop: "10px",
                  cursor: "pointer",
                  width: "200px", // ✅ Fixed typo and added width
                  textAlign: "center",

                }}
              >
                {dateTime}
              </p>
            </div>
          </Nav>
        </Navbar.Collapse>
        <Button variant="outline-info" onClick={()=>{navigate("/profile")}}>Profile</Button>
      </Container>
    </Navbar>
    </>
  );
}

export default Header;
