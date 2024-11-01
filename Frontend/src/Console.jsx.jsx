import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
  });

  useEffect(() => {
    fetch("http://localhost:3001")
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((err) => console.error(err));
  }, []);

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

  return (
    <>
      <Header />
      <div className="container">
        <h1>Logs</h1>

        {/* Separate and Compact Search Fields */}
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
                placeholder="Truck Name"
                name="truckName"
                value={filters.truckName}
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
          </Row>
        </Form>

        {/* Display Filtered Results */}
        {filteredResults.map((item) => (
          <section key={item.TransactionID} className="mb-3">
            <Card>
              <Card.Body>
                ScaleID: RIO-00{item.TransactionID} {item.Date} {item.TruckName} {item.SellerName} {item.BuyerName} {item.GoodsName} {item.Specification} {item.Gross} {item.Tare} {item.Net}
              </Card.Body>
            </Card>
          </section>
        ))}
      </div>
    </>
  );
}

export default Console;
