import React from 'react'
import ListOfResult from './Components/ListOfResult'
import FormData from './Components/FormData'
import {  Row, Col } from 'react-bootstrap';

function Home() {
  return (
    <>
         <Row>
            <Col md={6} className="scrollable-list">
              <ListOfResult />
            </Col>
            <Col md={6}>
              <FormData />
            </Col>
          </Row>
    </>
  )
}

export default Home
