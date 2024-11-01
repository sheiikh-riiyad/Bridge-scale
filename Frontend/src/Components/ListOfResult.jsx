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
              ScaleID: RIO-00{item.TransactionID} {item.TruckName} {item.SellerName} {item.BuyerName} {item.GoodsName} {item.Specification} {item.Gross} {item.Tare} {item.Net}
            </Card.Body>
          </Card>
          <div className="">
            <Button variant="outline-warning" onClick={() => handleEditClick(item)}>
              Edit
            </Button>
            <Button
              className="ms-2"
              name={item.TransactionID}
              onClick={handleDelete}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Button
              className="ms-2"
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
            {/* Form fields here */}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListOfResult;
