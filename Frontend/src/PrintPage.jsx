import React from 'react';
import { useLocation } from 'react-router-dom';
import './Styles/App.css';

function PrintPage() {
  const location = useLocation();
  const { item } = location.state || {};

  if (!item) {
    return <div>No data available to print.</div>;
  }

  return (
    <>
    <div  style={{
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

    <h2>TALUKDER BRIDGE SCLAE</h2>
    <spain>islampur,muraripur,setabgonj,dinajpur</spain> <br/>
    <spain>contact: +8801710666995</spain>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
            <p><strong>Seller Name:</strong> {item.SellerName}</p>
            <p><strong>Scale ID:</strong> TARM-00{item.TransactionID}</p>
            <p><strong>Truck Name:</strong> {item.TruckName}</p>
            <p><strong>Date:</strong> {item.Date}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
              <p><strong>Buyer Name:</strong> {item.BuyerName}</p>
              <p><strong>GrossTime:</strong> {item.GrossTime}</p>
              <p><strong>Gross :</strong> {item.Gross} KG</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
            <p><strong>Goods Name:</strong> {item.GoodsName}</p>
            <p><strong>TareTime:</strong> {item.TareTime}</p>
            <p style={{textDecoration: "underline"}} ><strong>Tare :</strong> - {item.Tare} KG</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-5px" }}>
                <p><strong>Specification:</strong> {item.Specification} /BAG</p>
                
               
                <p><strong>Net :</strong> {item.Net} KG</p>
        </div>

        <div style={{display: "flex", justifyContent: "space-between",}}>
            <p style={{ textAlign: "right" }}><strong>OPERATOR:</strong> SHEIKH RIYAD</p>
            <p style={{ textAlign: "left" }}><strong>Fees BDT: {item.Fees}/- </strong> </p>
        </div>

    </div>

  </>
  );
}

export default PrintPage;
