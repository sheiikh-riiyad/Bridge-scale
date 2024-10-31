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
    <div className="print-container">
      <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%', marginTop: '5px' }}>
        <tbody>
          <tr>
            <td colSpan="6" className="heading" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2>Your Company Name</h2>
            </td>
          </tr>
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>setabganj, dinajpur</td>
          </tr>
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>Contact: +8801710666995</td>
          </tr>
          <tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>ScaleID: RIO-00{item.TransactionID}</td>
</tr>
<tr>
  <td colSpan="6" className="bordered" style={{ textAlign: 'left' }}>Truck Name: {item.TruckName}</td>
</tr>
<tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>Seller Name: {item.SellerName}</td>
  <td colSpan="3" className="bordered" style={{ textAlign: 'right' }}>Buyer Name: {item.BuyerName}</td>
</tr>
<tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>Goods Name: {item.GoodsName}</td>
  <td colSpan="3" className="bordered" style={{ textAlign: 'right' }}>Specification: {item.Specification}</td>
</tr>
<tr>
  <td className="bordered" style={{ textAlign: 'left' }}>Gross Weight: {item.Gross}</td>
  <td className="bordered" style={{ textAlign: 'center' }}>Tare Weight: {item.Tare}</td>
  <td className="bordered" style={{ textAlign: 'right' }}>Net Weight: {item.Net}</td>
</tr>
<tr>
  <td colSpan="6" className="bordered" style={{ textAlign: 'right' }}>OPERATOR: SHEIKH RIYAD</td>
</tr>
        </tbody>
      </table>
      <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%', marginTop: '5px' }}>
        <tbody>
          <tr>
            <td colSpan="6" className="heading" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2>Your Company Name</h2>
            </td>
          </tr>
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>setabganj, dinajpur</td>
          </tr>
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>Contact: +8801710666995</td>
          </tr>
          <tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>ScaleID: RIO-00{item.TransactionID}</td>
</tr>
<tr>
  <td colSpan="6" className="bordered" style={{ textAlign: 'left' }}>Truck Name: {item.TruckName}</td>
</tr>
<tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>Seller Name: {item.SellerName}</td>
  <td colSpan="3" className="bordered" style={{ textAlign: 'right' }}>Buyer Name: {item.BuyerName}</td>
</tr>
<tr>
  <td colSpan="3" className="bordered" style={{ textAlign: 'left' }}>Goods Name: {item.GoodsName}</td>
  <td colSpan="3" className="bordered" style={{ textAlign: 'right' }}>Specification: {item.Specification}</td>
</tr>
<tr>
  <td className="bordered" style={{ textAlign: 'left' }}>Gross Weight: {item.Gross}</td>
  <td className="bordered" style={{ textAlign: 'center' }}>Tare Weight: {item.Tare}</td>
  <td className="bordered" style={{ textAlign: 'right' }}>Net Weight: {item.Net}</td>
</tr>
<tr>
  <td colSpan="6" className="bordered" style={{ textAlign: 'right' }}>OPERATOR: SHEIKH RIYAD</td>
</tr>
        </tbody>
      </table>
      <button onClick={() => window.print()}>Print</button>
    </div>
  );
}

export default PrintPage;
