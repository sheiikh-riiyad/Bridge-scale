import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
    Date: new Date().toISOString().split("T")[0] // Sets today's date
  });
  const [redirected, setRedirected] = useState(false);

  const navigate = useNavigate();

  

  // Fetches data from backend on page load
  useEffect(() => {
    fetch("http://localhost:3000")
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
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Update Date field on form submission
    const dataWithDate = {
      ...dataToInsert,
      Date: new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD
    };
  
    fetch("http://localhost:3000", {
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
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSellerName">
          <Form.Control
            type="text"
            placeholder="Seller Name"
            name="SellerName"
            value={dataToInsert.SellerName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBuyerName">
          <Form.Control
            type="text"
            placeholder="Buyer Name"
            name="BuyerName"
            value={dataToInsert.BuyerName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGoodsName">
          <Form.Control
            type="text"
            placeholder="Goods Name"
            name="GoodsName"
            value={dataToInsert.GoodsName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSpecification">
          <Form.Control
            type="text"
            placeholder="Specification"
            name="Specification"
            value={dataToInsert.Specification}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGross">
          <Form.Control
            type="number"
            placeholder="Gross Weight"
            name="Gross"
            value={dataToInsert.Gross}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTare">
          <Form.Control
            type="number"
            placeholder="Tare Weight"
            name="Tare"
            value={dataToInsert.Tare}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNet">
          <Form.Control
            type="number"
            placeholder="Net Weight"
            name="Net"
            value={dataToInsert.Net}
            readOnly // Prevents manual input as it is calculated
          />
        </Form.Group>

        <Button variant="outline-primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default FormData;
