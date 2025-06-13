import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Image, Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Header from './Header';
import { useAlert } from "./AlertContext";
import Alertbar from './all alert/Alertbar';
import { AiOutlineDeleteRow } from "react-icons/ai";
import { IoIosPersonAdd } from "react-icons/io";





const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  contact: yup.string().required('Contact is required'),
  email: yup.string().email('Invalid email'),
  password: yup.string().required('Password is required'),
  role: yup.string().required('Duty position is required'),
});

function Profile() {
  
  const { showAlert, alertVisible, alertMessage } = useAlert();

  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8889');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCompany = () => {
    const companyData = JSON.parse(localStorage.getItem('company'));
    setCompany(companyData);
  };

  useEffect(() => {
    fetchUsers();
    fetchCompany();
  }, []);

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    reset();
    setPhotoFile(null);
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('companyname', company?.name || '');
    formData.append('address', company?.address || '');
    formData.append('contact', data.contact);
    formData.append('username', data.name);
    formData.append('password', data.password);
    formData.append('email', data.email);
    formData.append('position', data.role);
    if (photoFile) formData.append('photo', photoFile);
  
    try {
      const response = await fetch('http://localhost:8889/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        fetchUsers();
        handleClose();
      } else {
        const errorData = await response.json();
        showAlert(errorData.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showAlert('Error occurred while adding user');
    }
  };
  

  const deleteUser = async (id) => {
    try {
      const response = await fetch('http://localhost:8889', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SecurityID: id }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }

    
  };

  const updateCompany = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const companyData = {
      logo: formData.get('logo') || 'https://via.placeholder.com/100',
      name: formData.get('name'),
      contact: formData.get('contact'),
      address: formData.get('address'),
    };

    localStorage.setItem('company', JSON.stringify(companyData));
    setCompany(companyData);
    console.log('Company updated:', companyData);
  };



  const [seller, setSeller] = useState('');
  const [buyer, setBuyer] = useState('');
  const [product, setProduct] = useState('');
  const [truck, setTruck] = useState('');
  const [sellers, setSellers] = useState(JSON.parse(localStorage.getItem('sellers')) || []);
  const [buyers, setBuyers] = useState(JSON.parse(localStorage.getItem('buyers')) || []);
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  const [trucks, setTrucks] = useState(JSON.parse(localStorage.getItem('trucks')) || []);

  const addSeller = () => {
    if (!seller.trim()) return;
    const updatedSellers = [...sellers, seller];
    setSellers(updatedSellers);
    localStorage.setItem('sellers', JSON.stringify(updatedSellers));
    setSeller('');
  };

  const addProduct = () => {
    if (!product.trim()) return;
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProduct('');
  };

  const addTruck = () => {
    if (!truck.trim()) return;
    const updatedTrucks = [...trucks, truck];
    setTrucks(updatedTrucks);
    localStorage.setItem('trucks', JSON.stringify(updatedTrucks));
    setTruck('');
  };
  
  

  const addBuyer = () => {
    if (!buyer.trim()) return;
    const updatedBuyers = [...buyers, buyer];
    setBuyers(updatedBuyers);
    localStorage.setItem('buyers', JSON.stringify(updatedBuyers));
    setBuyer('');
  };

  const deleteSeller = (index) => {
    const updated = sellers.filter((_, i) => i !== index);
    setSellers(updated);
    localStorage.setItem('sellers', JSON.stringify(updated));
  };

const deleteProduct = (index) => {
  const updated = products.filter((_, i) => i !== index);
  setProducts(updated);
  localStorage.setItem('products', JSON.stringify(updated));
};

const deleteTruck = (index) => {
  const updated = trucks.filter((_, i) => i !== index);
  setTrucks(updated);
  localStorage.setItem('trucks', JSON.stringify(updated));
};

  const deleteBuyer = (index) => {
    const updated = buyers.filter((_, i) => i !== index);
    setBuyers(updated);
    localStorage.setItem('buyers', JSON.stringify(updated));
  };

  

  return (
    <>
      <Header />
      <Row >
        <Col>
        {alertVisible && <Alertbar message={alertMessage} />}
      <Container className="mt-5">
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
                  <p className="text-muted">{company.contact}</p>
                  <p className="text-muted">{company.address}</p>
                </Col>
              </Row>
            ) : (
              <p className="text-center text-danger">No company details found.</p>
            )}
          </Card.Body>
        </Card>

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
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" name="contact" defaultValue={company?.contact || ''} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Company Address</Form.Label>
                <Form.Control type="text" name="address" defaultValue={company?.address || ''} required />
              </Form.Group>

              <Button type="submit" className="mt-3">Save Company</Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-3">User Details</h2>
            {users.map(user => (
              <Row key={user.SecurityID} className="align-items-center text-center mb-3">
                <Col md={3}>
                  <Image
                    src={
                      user.photo
                        ? `http://localhost:8889/uploads/${user.photo}`
                        : 'https://via.placeholder.com/80'
                    }
                    roundedCircle
                    fluid
                    style={{ width: 80, height: 80 }}
                  />
                </Col>
                <Col md={6}>
                  <h4>{user.username}</h4>
                  <p className="text-muted">{user.contact}</p>
                  <p className="text-muted">{user.email}</p>
                  <p className="text-primary">{user.position}</p>
                </Col>
                <Col md={3}>
                  {/* <Button variant="outline-info" className="me-2">Edit</Button> */}
                  <Button variant="outline-danger" onClick={()=>{ deleteUser(user.SecurityID), showAlert("User Delete Successful")}}
                    
                    disabled={user.email === sessionStorage.getItem('email') }  
                    
                  >Delete</Button>
                </Col>
              </Row>
            ))}
            <Button onClick={handleShow} className="mt-3">Add User</Button>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Add New User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" {...register('name')} isInvalid={!!errors.name} />
        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Contact</Form.Label>
        <Form.Control type="text" {...register('contact')} isInvalid={!!errors.contact} />
        <Form.Control.Feedback type="invalid">{errors.contact?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" {...register('password')} isInvalid={!!errors.password} />
        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Duty Position</Form.Label>
        <Form.Control type="text" {...register('role')} isInvalid={!!errors.role} />
        <Form.Control.Feedback type="invalid">{errors.role?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Photo (optional)</Form.Label>
        <Form.Control type="file" name="photo" onChange={handlePhotoChange} accept="image/*" />
      </Form.Group>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" type="submit">Add User</Button>
      </Modal.Footer>
    </Form>
  </Modal.Body>
</Modal>

      </Container>

        </Col>

<Col>
      <Container>
        <Row>
          {/* Seller Column */}
          <Col>
            <Form>
              <Form.Label htmlFor="seller">Seller Name</Form.Label>
              <Form.Control
                name="seller"
                type="text"
                id="seller"
                placeholder="Seller Name"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
              />
              <Button style={{ margin: '2px' }} variant="outline-info" onClick={addSeller}>
                Add
              </Button>
            </Form>

            {sellers.map((name, index) => (
              <Card key={index} style={{ marginTop: '2px' }}>
                <Card.Body
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '2px',
                    marginRight: '2px',
                  }}
                >
                  <span>{name}</span>
                  <AiOutlineDeleteRow style={{ cursor: 'pointer' }} onClick={() => deleteSeller(index)} />
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Buyer Column */}
          <Col>
            <Form>
              <Form.Label htmlFor="buyer">Buyer Name</Form.Label>
              <Form.Control
                name="buyer"
                type="text"
                id="buyer"
                placeholder="Buyer Name"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                
              />
              <Button style={{ margin: '2px' }} variant="outline-info" onClick={addBuyer}>
                Add
              </Button>
            </Form>

            {buyers.map((name, index) => (
              <Card key={index} style={{ marginTop: '2px' }}>
                <Card.Body
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '2px',
                    marginRight: '2px',
                  }}
                >
                  <span>{name}</span>
                  <AiOutlineDeleteRow style={{ cursor: 'pointer' }} onClick={() => deleteBuyer(index)} />
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>





                <Container>
                  <Row>
                    <Col>
            <Form>
                <Form.Label htmlFor="Product">Product Name</Form.Label>
                <Form.Control
                name="Product"
                type="text"
                id="Product"
                placeholder="Product Name"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                
                
              />
              <Button style={{ margin: '2px' }} variant="outline-info" onClick={addProduct}>
                Add
              </Button>
            </Form>



              {products.map((name, index) => (
              <Card key={index} style={{ marginTop: '2px' }}>
                <Card.Body
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '2px',
                    marginRight: '2px',
                  }}
                >
                  <span>{name}</span>
                  <AiOutlineDeleteRow style={{ cursor: 'pointer' }} onClick={() => deleteProduct(index)} />
                </Card.Body>
              </Card>
            ))}
                    </Col>
                    <Col>

               <Form.Label htmlFor="Truck">Truck Name</Form.Label>
                <Form.Control
                name="Truck"
                type="text"
                id="Truck"
                placeholder="Truck Name"
                value={truck}
                onChange={(e)=> setTruck(e.target.value)}
                
              />
              <Button style={{ margin: '2px' }} variant="outline-info" onClick={addTruck}>
                Add
              </Button>


            {trucks.map((name, index) => (
              <Card key={index} style={{ marginTop: '2px' }}>
                <Card.Body
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '2px',
                    marginRight: '2px',
                  }}
                >
                  <span>{name}</span>
                  <AiOutlineDeleteRow style={{ cursor: 'pointer' }} onClick={() => deleteTruck(index)} />
                </Card.Body>
              </Card>
            ))}
                    </Col>
                  </Row>
                </Container>



    </Col>
      </Row>
      



    </>
  );
}

export default Profile;
