import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ListOfResult = () => {
  const [result, setResult] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dataToEdit, setDataToEdit] = useState({
    TransactionID: null,
    TruckName: "",
    SellerName: "",
    BuyerName: "",
    GoodsName: "",
    Specification: "",
    Gross: "",
    Tare: "",
    Net: "",
    
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((err) => console.error(err));
  }, []);

  const handleEditClick = (item) => {
    setDataToEdit(item);
    setShowModal(true);
  };

  const handleDelete = (e) => {
    if (window.confirm("Are you sure you want to delete this information?")) {
      fetch("http://localhost:3000", {
        method: "DELETE",
        body: JSON.stringify({ TransactionID: e.target.name }),
        headers: { "Content-Type": "application/json" },
      }).then(() => window.location.reload());
    }
  };

  const print = async (item) => {
    try {
        // Step 1: Send the item data to the second database (port 3001)
        const postResponse = await fetch("http://localhost:3001", {
            method: "POST",
            body: JSON.stringify(item),
            headers: { "Content-Type": "application/json" },
        });

        if (!postResponse.ok) {
            throw new Error("Failed to insert data on port 3001");
        }

        // Step 2: Remove the printed item from the frontend state
        setResult((prevResult) => prevResult.filter((data) => data.TransactionID !== item.TransactionID));

        // Step 3: Delete the item from the first database (port 3000)
        const deleteResponse = await fetch("http://localhost:3000", {
            method: "DELETE",
            body: JSON.stringify({ TransactionID: item.TransactionID }),
            headers: { "Content-Type": "application/json" },
        });

        if (!deleteResponse.ok) {
            throw new Error("Failed to delete data on port 3000");
        }

        // Navigate to the print page
        navigate("/printpage", { state: { item } });
    } catch (error) {
        console.error("Error handling print request:", error);
    }
};


  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataToEdit((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "Gross" || name === "Tare") {
        const gross = parseFloat(updatedData.Gross) || 0;
        const tare = parseFloat(updatedData.Tare) || 0;
        updatedData.Net = gross - tare;
      }
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = dataToEdit.TransactionID ? "PUT" : "POST";

    fetch("http://localhost:3000", {
      method,
      body: JSON.stringify(dataToEdit),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setShowModal(false);
        window.location.reload();
      })
      .catch((err) => console.error("Failed to save data:", err));
  };

  return (
    <div className="container">
      <h1>Logs</h1>
      {result.map((item) => (
        <section key={item.TransactionID} className="mb-3">
          <Card>
            <Card.Body>
              ScaleID: RIO-00{item.TransactionID} {item.Date} {item.TruckName} {item.SellerName} {item.BuyerName} {item.GoodsName} {item.Specification} {item.Gross} {item.Tare} {item.Net}
            </Card.Body>
          </Card>
          <div className="">
            <Button variant="outline-warning" onClick={() => handleEditClick(item)}>
              Edit
            </Button>
            <Button
              className=""
              name={item.TransactionID}
              onClick={handleDelete}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Button
              className=""
              variant="outline-success"
              onClick={() => print(item)} // Pass the item data
            >
              Print
            </Button>
          </div>
        </section>
      ))}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <Form onSubmit={handleSubmit}>
  <Form.Group controlId="formTruckName">
    <Form.Label>Truck Name</Form.Label>
    <Form.Control
      type="text"
      name="TruckName"
      value={dataToEdit.TruckName}
      onChange={handleChange}
      placeholder="Enter Truck Name"
    />
  </Form.Group>

  <Form.Group controlId="formSellerName" className="mt-3">
    <Form.Label>Seller Name</Form.Label>
    <Form.Control
      type="text"
      name="SellerName"
      value={dataToEdit.SellerName}
      onChange={handleChange}
      placeholder="Enter Seller Name"
    />
  </Form.Group>

  <Form.Group controlId="formBuyerName" className="mt-3">
    <Form.Label>Buyer Name</Form.Label>
    <Form.Control
      type="text"
      name="BuyerName"
      value={dataToEdit.BuyerName}
      onChange={handleChange}
      placeholder="Enter Buyer Name"
    />
  </Form.Group>

  <Form.Group controlId="formGoodsName" className="mt-3">
    <Form.Label>Goods Name</Form.Label>
    <Form.Control
      type="text"
      name="GoodsName"
      value={dataToEdit.GoodsName}
      onChange={handleChange}
      placeholder="Enter Goods Name"
    />
  </Form.Group>

  <Form.Group controlId="formSpecification" className="mt-3">
    <Form.Label>Specification</Form.Label>
    <Form.Control
      type="text"
      name="Specification"
      value={dataToEdit.Specification}
      onChange={handleChange}
      placeholder="Enter Specification"
    />
  </Form.Group>

  <Form.Group controlId="formGross" className="mt-3">
    <Form.Label>Gross Weight</Form.Label>
    <Form.Control
      type="number"
      name="Gross"
      value={dataToEdit.Gross}
      onChange={handleChange}
      placeholder="Enter Gross Weight"
    />
  </Form.Group>

  <Form.Group controlId="formTare" className="mt-3">
    <Form.Label>Tare Weight</Form.Label>
    <Form.Control
      type="number"
      name="Tare"
      value={dataToEdit.Tare}
      onChange={handleChange}
      placeholder="Enter Tare Weight"
    />
  </Form.Group>

  <Form.Group controlId="formNet" className="mt-3">
    <Form.Label>Net Weight</Form.Label>
    <Form.Control
      type="number"
      name="Net"
      value={dataToEdit.Net}
      onChange={handleChange}
      placeholder="Net Weight (calculated)"
      readOnly
    />
  </Form.Group>

  <Button onClick={handleSubmit} variant="outline-success" type="submit" className="mt-4">
    Save Changes
  </Button>
</Form>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListOfResult;
