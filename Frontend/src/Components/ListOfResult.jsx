import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAlert } from "./AlertContext";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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
    GrossTime: "", 
    TareTime: "",
    Fees: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8888")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
       
        setResult(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleEditClick = (item) => {
    setDataToEdit(item);
    setShowModal(true);
  };

  // const handleDelete = (e) => {
  //   const transactionId = e.target.name;
  
  //   if  (window.confirm("Are you sure you want to delete this information?")) {
  //     fetch("http://localhost:8888", {
  //       method: "DELETE",
  //       body: JSON.stringify({ TransactionID: transactionId }),
  //       headers: { "Content-Type": "application/json" },
  //     })
  //       .then((res) => {
  //         if (!res.ok) {
  //           throw new Error("Failed to delete");
  //         }
  //         showAlert(`Transaction ID ${transactionId} deleted successfully.`);
  //         setResult((prevResult) =>
  //           prevResult.filter((item) => item.TransactionID !== parseInt(transactionId))
  //         );
  //       })
  //       .catch((err) => {
  //         console.error("Error deleting item:", err);
  //         showAlert("Failed to delete. Please try again.");
  //       });
  //   }
  // };
  

  const { showAlert } = useAlert();
  const print = async (item) => {
    if (!(parseFloat(item.Gross) > 0 && parseFloat(item.Tare) > 0)) {
      showAlert("Gross and Tare cannot be empty or zero for printing.");
      return; // Prevent further processing if both fields are invalid (zero or empty)
    }
    try {
      
        // Step 1: Send the item data to the second database (port 3001)
        const postResponse = await fetch("http://localhost:8887", {
            method: "POST",
            body: JSON.stringify(item),
            headers: { "Content-Type": "application/json" },
        });

        if (!postResponse.ok) {
            throw new Error("Failed to insert data on port 8887");
        }

        // Step 2: Remove the printed item from the frontend state
        setResult((prevResult) => prevResult.filter((data) => data.TransactionID !== item.TransactionID));

        // Step 3: Delete the item from the first database (port 3000)
        const deleteResponse = await fetch("http://localhost:8888", {
            method: "DELETE",
            body: JSON.stringify({ TransactionID: item.TransactionID }),
            headers: { "Content-Type": "application/json" },
        });

        if (!deleteResponse.ok) {
            throw new Error("Failed to delete data on port 8888");
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

    if (!dataToEdit.Fees) {
      showAlert("You Need To Add Sclae Fees");
      return;
    }
    e.preventDefault();
    const method = dataToEdit.TransactionID ? "PUT" : "POST";

    fetch("http://localhost:8888", {
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
  setDataToEdit((prevData) => ({
    ...prevData,
    GrossTime: getCurrentDateTime(),  // ✅ Correctly updating dataToEdit
  }));
};

// **Set Tare Date & Time**
const setTareTime = () => {
  setDataToEdit((prevData) => ({
    ...prevData,
    TareTime: getCurrentDateTime(),  // ✅ Correctly updating dataToEdit
  }));
};












const [filterId, setFilterId] = useState(""); // <-- new state
const handleFilterChange = (e) => {
  setFilterId(e.target.value);
};





const [showDeleteModal, setShowDeleteModal] = useState(false);
const [transactionToDelete, setTransactionToDelete] = useState(null);


const handleDelete = (transactionId) => {
  setTransactionToDelete(transactionId);
  setShowDeleteModal(true);
};




const confirmDelete = () => {
  if (!transactionToDelete) return;

  fetch("http://localhost:8888", {
    method: "DELETE",
    body: JSON.stringify({ TransactionID: transactionToDelete }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      showAlert(`Transaction ID ${transactionToDelete} deleted successfully.`);
      setResult((prevResult) =>
        prevResult.filter((item) => item.TransactionID !== parseInt(transactionToDelete))
      );
    })
    .catch((err) => {
      console.error("Error deleting item:", err);
      showAlert("Failed to delete. Please try again.");
    })
    .finally(() => {
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    });
};

const cancelDelete = () => {
  setShowDeleteModal(false);
  setTransactionToDelete(null);
};





  return (

     <>
<Modal show={showDeleteModal} onHide={cancelDelete} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete transaction ID {transactionToDelete}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={cancelDelete}>
      No
    </Button>
    <Button variant="danger" onClick={confirmDelete}>
      Yes
    </Button>
  </Modal.Footer>
</Modal>

    <div className="container">
      <h1>Logs</h1>
      <Row>
                  <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Scale ID"
                      name="scaleID"
                      value={filterId}
                      onChange={handleFilterChange}
                    />
                  </Col>
      </Row>
      {result
  .filter((item) =>
    filterId === "" ? true : item.TransactionID.toString().includes(filterId)
  )
  .map((item) => (
        <section key={item.TransactionID} className="mb-3">
          <Card>
            <Card.Body>
              ScaleID: TARM-00{item.TransactionID} {item.Date} {item.TruckName} {item.SellerName} {item.BuyerName} {item.GoodsName} {item.Specification} {item.Gross} {item.Tare} {item.Net} {item.GrossTime} {item.TareTime} {item.Fees}
            </Card.Body>
          </Card>
          <div className="">
            <Button variant="outline-warning" onClick={() => handleEditClick(item)}>
              Edit
            </Button>
            <Button
              className=""
              // name={item.TransactionID}
              onClick={() => handleDelete(item.TransactionID)}
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
    <input required value={dataToEdit.Fees} onChange={handleChange} name="Fees"  style={{marginTop: "5px", width: "50px"}} type="text" placeholder="Fees" />

    <input  type="text"
            placeholder="Gross Time"
            name="GrossTime"
            value={dataToEdit.GrossTime} 
            readOnly 
            style={{ marginLeft: "10px" }}  />

        <input  type="text"
            placeholder="Tare Time"
            name="TareTime"
            value={dataToEdit.TareTime}
            readOnly 
            style={{ marginLeft: "10px" }}/>
  </Form.Group>
  <Button  disabled={!!dataToEdit.GrossTime} onClick={setGrossTime} style={{ margin: "5px" }} variant="outline-secondary">Gross</Button>
  <Button disabled={!!dataToEdit.TareTime} onClick={setTareTime} variant="outline-secondary">Tare</Button>
  
  <Button  onClick={handleSubmit} variant="outline-success" type="submit" className="mt-4">
    Save Changes
  </Button>
</Form>
          </Form>
        </Modal.Body>
      </Modal>
    </div>




    </>
  );
};

export default ListOfResult;
