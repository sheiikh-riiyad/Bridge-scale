import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import bcrypt from 'bcryptjs'; // Import bcryptjs

function Register() {

 

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(/-/, "Username must contain a '-'")
      .required('Username is required'),
    password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Check if username already exists in localStorage
      const storedData = JSON.parse(localStorage.getItem('userData')) || [];

      // Find if the username already exists
      const existingUser = storedData.find(user => user.username === values.username);

      if (existingUser) {
        // Username already exists, show an alert or message
        alert('Username already exists. Please choose another one.');
        return; // Stop further execution if username exists
      }

      // Hash the password before saving it in local storage
      const hashedPassword = bcrypt.hashSync(values.password, 10); // Salt rounds set to 10

      // Save form data with hashed password in local storage
      const userData = { username: values.username, password: hashedPassword };
      
      // If users already exist, append the new user data to the array
      storedData.push(userData);
      localStorage.setItem('userData', JSON.stringify(storedData));

      console.log('Form Submitted:', userData);
      alert('Registration Successful!');

      window.location.href = "/";
    },
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <Form onSubmit={formik.handleSubmit}>
        {/* Username Field */}
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="User Name"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.username && formik.errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password Field */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Register
        </Button>
       
      </Form>
    </div>
  );
}

export default Register;
