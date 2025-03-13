import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Image, Button, Form, Modal } from 'react-bootstrap';
import Header from './Header';

function Profile() {
  // Load company data from localStorage (if exists)
  const [company, setCompany] = useState(() => {
    const savedCompany = localStorage.getItem('company');
    return savedCompany ? JSON.parse(savedCompany) : null;
  });

  useEffect(() => {
    // Save company details to localStorage whenever they change
    if (company) {
      localStorage.setItem('company', JSON.stringify(company));
    }
  }, [company]);

  const [users, setUsers] = useState([
    {
      id: 1,
      avatar: 'https://via.placeholder.com/80',
      name: 'John Doe',
      contact: '+880123456789',
      email: 'john.doe@example.com',
      role: 'Software Engineer',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    contact: '',
    email: '',
    role: '',
    password: '',
    avatar: 'https://via.placeholder.com/80',
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    const userToAdd = {
      id: users.length + 1,
      ...newUser,
    };
    setUsers([...users, userToAdd]);
    setNewUser({ name: '', contact: '', email: '', role: '', avatar: 'https://via.placeholder.com/80' });
    handleClose();
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const updateCompany = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setCompany({
      logo: formData.get('logo') || company?.logo || 'https://via.placeholder.com/100',
      name: formData.get('name'),
      address: formData.get('address'),
    });
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        {/* Company Details */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-3">Company Details</h1>
            {company ? (
              <Row className="align-items-center text-center">
                <Col md={3}>
                  <Image src={company.logo} roundedCircle fluid />
                </Col>
                <Col md={9}>
                  <h4>{company.name}</h4>
                  <p className="text-muted">{company.address}</p>
                </Col>
              </Row>
            ) : (
              <p className="text-center text-danger">No company details found. Please enter details below.</p>
            )}
          </Card.Body>
        </Card>

        {/* Update Company Form */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-3">Update Company Details</h2>
            <Form onSubmit={updateCompany}>
              <Form.Group>
                <Form.Label>Company Logo URL</Form.Label>
                <Form.Control type="text" name="logo" placeholder="Enter logo URL" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" name="name" defaultValue={company?.name || ''} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Company Address</Form.Label>
                <Form.Control type="text" name="address" defaultValue={company?.address || ''} required />
              </Form.Group>
              <Button type="submit" className="mt-3">Save Company</Button>
            </Form>
          </Card.Body>
        </Card>

        {/* User Details */}
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-3">User Details</h2>
            {users.map(user => (
              <Row key={user.id} className="align-items-center text-center mb-3">
                <Col md={3}>
                  <Image src={user.avatar} roundedCircle fluid />
                </Col>
                <Col md={6}>
                  <h4>{user.name}</h4>
                  <p className="text-muted">{user.contact}</p>
                  <p className="text-muted">{user.email}</p>
                  <p className="text-primary">{user.role}</p>
                </Col>
                <Col md={3}>
                  <Button variant="outline-info">Edit</Button>
                  <Button variant="outline-danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                </Col>
              </Row>
            ))}
            <Button onClick={handleShow} className="mt-3">Add User</Button>
          </Card.Body>
        </Card>

        {/* Add User Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={newUser.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" name="contact" value={newUser.contact} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newUser.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newUser.password} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" name="role" value={newUser.role} onChange={handleChange} required />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleAddUser}>Add User</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Profile;
