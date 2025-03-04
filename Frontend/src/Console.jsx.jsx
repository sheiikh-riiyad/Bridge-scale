import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";

function Console() {
  const [result, setResult] = useState([]);
  const [filters, setFilters] = useState({
    scaleID: '',
    startDate: '',
    endDate: '',
    truckName: '',
    sellerName: '',
    buyerName: '',
    goodsName: '',
    specification: '',
    gross: '',
    tare: '',
    net: '',
    GrossTime: "", 
    TareTime: "",
    Fees: "",
  });

  const printRef = useRef();

  fetch("http://localhost:3011")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Data fetched:", data);
    setResult(data);
  })
  .catch((err) => console.error("Error fetching data:", err));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredResults = result.filter((item) => {
    const itemDate = new Date(item.Date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (filters.scaleID === '' || item.TransactionID.toString().includes(filters.scaleID)) &&
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate) &&
      (filters.truckName === '' || item.TruckName.toLowerCase().includes(filters.truckName.toLowerCase())) &&
      (filters.sellerName === '' || item.SellerName.toLowerCase().includes(filters.sellerName.toLowerCase())) &&
      (filters.buyerName === '' || item.BuyerName.toLowerCase().includes(filters.buyerName.toLowerCase())) &&
      (filters.goodsName === '' || item.GoodsName.toLowerCase().includes(filters.goodsName.toLowerCase())) &&
      (filters.specification === '' || item.Specification.toLowerCase().includes(filters.specification.toLowerCase())) &&
      (filters.gross === '' || item.Gross.toString().includes(filters.gross)) &&
      (filters.tare === '' || item.Tare.toString().includes(filters.tare)) &&
      (filters.net === '' || item.Net.toString().includes(filters.net))
    );
  });

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Results');
    XLSX.writeFile(workbook, 'filtered_results.xlsx');
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const WindowPrint = window.open('', '', 'width=900,height=650');
    WindowPrint.document.write(printContent.outerHTML);
    WindowPrint.document.close();
    WindowPrint.focus();
    WindowPrint.print();
    WindowPrint.close();
  };
 
const navigate = useNavigate();
const print = (item) => {
  navigate("/printpage", { state: { item } });
};

  return (
    <>
      <Header />
      <div className="container">
        <h1>Logs</h1>

        <Form>
          <Row>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Scale ID"
                name="scaleID"
                value={filters.scaleID}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="date"
                placeholder="Start Date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="date"
                placeholder="End Date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Seller Name"
                name="sellerName"
                value={filters.sellerName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Buyer Name"
                name="buyerName"
                value={filters.buyerName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Goods Name"
                name="goodsName"
                value={filters.goodsName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Specification"
                name="specification"
                value={filters.specification}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Gross"
                name="gross"
                value={filters.gross}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Tare"
                name="tare"
                value={filters.tare}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Net"
                name="net"
                value={filters.net}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Button variant="outline-success" onClick={handlePrint}>Print</Button>
              <Button variant="outline-success" className='export' onClick={handleExport}>Export</Button>
            </Col>
          </Row>
        </Form>

        {/* Print Area */}
        <div ref={printRef} className="print-area">
          <table className="table mt-4">
            <thead>
              <tr>
                <th>ScaleID</th>
                <th>Date</th>
                <th>Truck Name</th>
                <th>Seller Name</th>
                <th>Buyer Name</th>
                <th>Goods Name</th>
                <th>Specification</th>
                <th>Gross</th>
                <th>Gross Time</th>
                <th>Tare</th>
                <th>Tare Time</th>
                <th>Net</th>
                <th>Fees</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <tr key={item.TransactionID}>
                    <td>RIO-00{item.TransactionID}</td>
                    <td>{item.Date}</td>
                    <td>{item.TruckName}</td>
                    <td>{item.SellerName}</td>
                    <td>{item.BuyerName}</td>
                    <td>{item.GoodsName}</td>
                    <td>{item.Specification}</td>
                    <td>{item.Gross}</td>
                    <td>{item.GrossTime}</td>
                    <td>{item.Tare}</td>
                    <td>{item.TareTime}</td>
                    <td>{item.Net}</td>
                    <td>{item.Fees}</td>
                    <Button onClick={() => print(item)} style={{ marginBottom: "1px" }} variant="outline-success">
                      Print
                    </Button> </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No data available for the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default Console;
