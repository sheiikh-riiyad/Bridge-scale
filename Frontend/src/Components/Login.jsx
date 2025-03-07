import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import bcrypt from 'bcryptjs';

function Login() {
  const [loginError, setLoginError] = useState('');

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
    onSubmit: (values) => {
      console.log('Entered values:', values); // Debugging log

      // Retrieve stored users (Array)
      const storedUserData = JSON.parse(localStorage.getItem('userData')) || [];
      
      if (storedUserData.length === 0) {
        setLoginError('No registered users found. Please register first.');
        return;
      }

      // Find the user by username
      const enteredUsername = values.username.trim().toLowerCase();
      const storedUser = storedUserData.find(user => user.username.trim().toLowerCase() === enteredUsername);

      if (!storedUser) {
        setLoginError('Username not found!');
        return;
      }

      // Compare hashed password
      const passwordMatch = bcrypt.compareSync(values.password, storedUser.password);
      console.log('Password match:', passwordMatch); // Debugging log

      if (!passwordMatch) {
        setLoginError('Incorrect password!');
        return;
      }

      // ✅ Store both username and password in sessionStorage
      sessionStorage.setItem(
        'sessionUser',
        JSON.stringify({ username: storedUser.username, password: values.password })
      );

      alert('Login Successful!');
      window.location.href = '/'; // Redirect to dashboard
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

        {/* Error Message */}
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Login
        </Button>

        
      </Form>
    </div>
  );
}

export default Login;
