import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Console() {
  const [result, setResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter the results based on the search query
  const filteredResults = result.filter((item) =>
    item.TruckName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.SellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.BuyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.GoodsName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Specification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container">
        <h1>Logs</h1>

        {/* Search Input */}
        <Form.Control
          type="text"
          placeholder="Search by Truck Name, Seller, Buyer, Goods, or Specification"
          className="mb-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Display Filtered Results */}
        {filteredResults.map((item) => (
          <section key={item.TransactionID} className="mb-3">
            <Card>
              <Card.Body>
                ScaleID: RIO-00{item.TransactionID} {item.TruckName} {item.SellerName} {item.BuyerName} {item.GoodsName} {item.Specification} {item.Gross} {item.Tare} {item.Net}
              </Card.Body>
            </Card>
          </section>
        ))}
      </div>
    </>
  );
}

export default Console;
