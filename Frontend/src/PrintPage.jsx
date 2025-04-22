import React, { useState, useEffect } from 'react';  // Import useState and useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import './Styles/App.css';

function PrintPage() {
  const [operator, setOperator] = useState(''); // State to store the operator's username
  const location = useLocation();
  const { item } = location.state || {};
  const [company, setCompany] = useState(() => {
    const savedCompany = localStorage.getItem('company');
    return savedCompany ? JSON.parse(savedCompany) : null;
  });

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (sessionUser) {
      setOperator(sessionUser.username); // Set the operator's username from session storage
    }
  }, []);  // Empty dependency array to run only once when the component mounts

  if (!item) {
    return <div>No data available to print.</div>;
  }
  const handlePrint = () => {
    window.print(); // This will trigger the print dialog
  };
  const navigate = useNavigate();
  const handleExit = () => {
    navigate(-1) 
  };

  return (
    <>
      <div style={{
        width: "100%",
        maxWidth: "100%",
        textAlign: "center",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        background: "#fff",
        margin: "0 auto",
      }}>
        <h2>{company.name}</h2>
        <span>{company.address}</span> <br />
        <span>Contact: {company.contact}</span>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
          <p><strong>Seller Name:</strong> {item.SellerName}</p>
          <p><strong>Scale ID:</strong> TARM-00{item.TransactionID}</p>
          <p><strong>Truck Name:</strong> {item.TruckName}</p>
          <p><strong>Date:</strong> {item.Date}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
          <p><strong>Buyer Name:</strong> {item.BuyerName}</p>
          <p><strong>GrossTime:</strong> {item.GrossTime}</p>
          <p><strong>Gross:</strong> {item.Gross} KG</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
          <p><strong>Goods Name:</strong> {item.GoodsName}</p>
          <p><strong>TareTime:</strong> {item.TareTime}</p>
          <p style={{ textDecoration: "underline" }}><strong>Tare:</strong> - {item.Tare} KG</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
          <p><strong>Specification:</strong> {item.Specification} /BAG</p>
          <p><strong>Net:</strong> {item.Net} KG</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", }}>
          <p style={{ textAlign: "right" }}><strong>posted by:</strong> {operator || "Unknown"}</p>
          <p style={{ textAlign: "left" }}><strong>Fees BDT: {item.Fees}/-</strong></p>
        </div>
      </div>



      
             <button onClick={handlePrint}>print</button>
             <button onClick={handleExit} style={{marginLeft: "5px"}}>exit</button>
    </>
  );
}

export default PrintPage;
