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

  const print = (item) => {
    navigate("/printpage", { state: { item } });
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
