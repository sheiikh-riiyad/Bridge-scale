import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAlert } from "./AlertContext";


function FormData() {
  // State for form data
  const [result, setResult] = useState([]);
  const [dataToInsert, setDataToInsert] = useState({
    TruckName: "",
    SellerName: "",
    BuyerName: "",
    GoodsName: "",
    Specification: "",
    Gross: "",
    Tare: "",
    Net: "",
    Date: new Date().toISOString().split("T")[0], // Sets today's date
    GrossTime: "", 
    TareTime: "",
    Fees: "",
  });
  const [redirected, setRedirected] = useState(false);

  const navigate = useNavigate();

  

  // Fetches data from backend on page load
  useEffect(() => {
    fetch("http://localhost:8888")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);

        // Find the item with the same TransactionID as the pathname
        const foundItem = data.find(
          (item) => window.location.pathname === `/modify/${item.TransactionID}`
        );

        if (foundItem) {
          setDataToInsert((prevState) => ({
            ...prevState,
            ...foundItem,
          }));
        } else if (!redirected) {
          setRedirected(true);
          navigate("/");
        }
      })
      .catch((err) => console.error(err));
  }, [redirected, navigate]);

  // Submits form data to backend
  
  const { showAlert } = useAlert();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataToInsert.GrossTime && !dataToInsert.TareTime) {
      showAlert("Both GrossTime and TareTime are empty!");
      
    return; // Prevent form submission if both are empty
  }

  
  
    // Update Date field on form submission
    const dataWithDate = {
      ...dataToInsert,
      Date: new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD
    };
  
    fetch("http://localhost:8888", {
      method: "POST",
      body: JSON.stringify(dataWithDate),
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.ok) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert("Data not sent to the server. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Failed to save data:", err);
      alert("Data not sent to the server. Please check your network or try again.");
    });
  };

  // Updates state and calculates Net dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataToInsert((prevData) => {
      const newData = { ...prevData, [name]: value };

      // Calculate Net as Gross - Tare if both fields have values
      if (name === "Gross" || name === "Tare") {
        const gross = parseFloat(newData.Gross) || 0;
        const tare = parseFloat(newData.Tare) || 0;
        newData.Net = gross - tare;
      }

      return newData;
    });
  };

  


   // **Function to get Date & Time in format: YYYY-MM-DD HH:MM:SS AM/PM**
   const getCurrentDateTime = () => {
     const now = new Date();
     const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // **Set Gross Date & Time**
  const setGrossTime = () => {
    setDataToInsert((prevData) => ({
      ...prevData,
      GrossTime: getCurrentDateTime(),
    }));
  };

  // **Set Tare Date & Time**
  const setTareTime = () => {
    setDataToInsert((prevData) => ({
      ...prevData,
      TareTime: getCurrentDateTime(),
    }));
  };

  const resetTimes = (e) => {
    e.preventDefault(); // Prevent form submission
    setDataToInsert((prevData) => ({
      ...prevData,
      GrossTime: "",
      TareTime: "",
    }));
  };

 let button = <button onClick={resetTimes}>Reset</button>



  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    const sellersFromStorage = JSON.parse(localStorage.getItem("sellers")) || [];
    const buyersFromStorage = JSON.parse(localStorage.getItem("buyers")) || [];
    setSellers(sellersFromStorage);
    setBuyers(buyersFromStorage);
  }, []);




  return (
    <div className="mt-2">
     
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTruckName">
          <Form.Control
            type="text"
            placeholder="Truck Name"
            name="TruckName"
            value={dataToInsert.TruckName}
            onChange={handleChange}
            required
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSellerName">
          <Form.Control
            className="seller"
            list="seller-list"
            type="text"
            placeholder="Seller Name"
            name="SellerName"
            value={dataToInsert.SellerName}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
            <div className= 'hidden' >Dual click For Option </div>

          <datalist id="seller-list">
            {sellers.map((seller, index) => (
            <option key={index} value={seller} />
            ))}
          </datalist>

          
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBuyerName">
          <Form.Control
            className="seller"
            list="buyer-list"
            type="text"
            placeholder="Buyer Name"
            name="BuyerName"
            value={dataToInsert.BuyerName}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
          <div className= 'hidden' >Dual click For Option</div>

          <datalist id="buyer-list">
            {buyers.map((buyer, index) => (
            <option key={index} value={buyer} />
            ))}
          </datalist>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGoodsName">
          <Form.Control
            type="text"
            placeholder="Goods Name"
            name="GoodsName"
            value={dataToInsert.GoodsName}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSpecification">
          <Form.Control
            type="text"
            placeholder="Specification"
            name="Specification"
            value={dataToInsert.Specification}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGross">
          <Form.Control
            type="text"
            placeholder="Gross Weight"
            name="Gross"
            value={dataToInsert.Gross}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTare">
          <Form.Control
            type="text"
            placeholder="Tare Weight"
            name="Tare"
            value={dataToInsert.Tare}
            onChange={handleChange}
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNet">
          <Form.Control
            type="number"
            placeholder="Net Weight"
            name="Net"
            value={dataToInsert.Net}
            readOnly
            style={{fontFamily: "Brush Script MT, cursive"}}
          />
        <input  onChange={handleChange}  name="Fees" value={dataToInsert.Fees} style={{marginTop: "5px", width: "80px", fontFamily: "Brush Script MT, cursive"}} type="number" placeholder="Fees" />

        <input  type="text"
            placeholder="Gross Time"
            name="GrossTime"
            value={dataToInsert.GrossTime}
            readOnly 
            style={{ marginLeft: "10px",fontFamily: "Brush Script MT, cursive" }}
             />
        <input  type="text"
            placeholder="Tare Time"
            name="TareTime"
            value={dataToInsert.TareTime}
            readOnly 
            style={{ marginLeft: "10px", marginRight: "5px",fontFamily: "Brush Script MT, cursive" }}/>
            <spain>{button}</spain>
        </Form.Group>
        
        <Button onClick={setGrossTime} style={{ margin: "5px" }} variant="outline-secondary">Gross</Button>
        <Button onClick={setTareTime} variant="outline-secondary">Tare</Button>
        

        <Button style={{marginLeft: "10px"}} variant="outline-primary" type="submit">
          Register
        </Button>
        
          <spain className="indicator">0000</spain>
        
      </Form>
    </div>
  );
}

export default FormData;
