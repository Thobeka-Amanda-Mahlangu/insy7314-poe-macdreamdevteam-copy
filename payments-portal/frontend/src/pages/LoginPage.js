// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Validation Schema
const LoginSchema = Yup.object().shape({
  idNumber: Yup.string()
    .matches(/^\d{13}$/, 'ID Number must be 13 digits.')
    .required('ID Number is required.'),
  accountNumber: Yup.string()
    .matches(/^[0-9]{5,15}$/, 'Account number must be 5–15 digits.')
    .required('Account Number is required.'),
  password: Yup.string().required('Password is required.'),
});

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      idNumber: '',
      accountNumber: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log("📤 Starting login process");
      console.log("📤 Sending login data:", values);

      setError(null);
      try {
        // Call AuthContext login with credential object
        const response = await login({
          idNumber: values.idNumber,
          accountNumber: values.accountNumber,
          password: values.password,
        });
        console.log("✅ Login successful:", response);

        navigate('/portal');
      } catch (err) {
        console.error("❌ Login Error:", err.response ? err.response.data : err.message);
        setError('Invalid login credentials. Please try again.');
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-5">
          <div 
            className="card shadow-lg p-4" 
            style={{backgroundColor: 'var(--color-light-bg)', border: '1px solid var(--color-primary-blue)'}}
          >
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{color: 'var(--color-primary-blue)'}}>
                <i className="bi bi-person-circle me-2"></i> Customer Login
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* ID Number */}
                <div className="mb-3">
                  <label htmlFor="idNumber" className="form-label text-white">ID Number</label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    className={`form-control ${formik.touched.idNumber && formik.errors.idNumber ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('idNumber')}
                  />
                  {formik.touched.idNumber && formik.errors.idNumber && (
                    <div className="invalid-feedback">{formik.errors.idNumber}</div>
                  )}
                </div>

                {/* Account Number */}
                <div className="mb-3">
                  <label htmlFor="accountNumber" className="form-label text-white">Account Number</label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    className={`form-control ${formik.touched.accountNumber && formik.errors.accountNumber ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('accountNumber')}
                  />
                  {formik.touched.accountNumber && formik.errors.accountNumber && (
                    <div className="invalid-feedback">{formik.errors.accountNumber}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-white">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2">
                  <i className="bi bi-box-arrow-in-right me-2"></i> Log In
                </button>
              </form>
            </div>
            <p className="text-center mt-3 small">
              <Link to="/register" style={{color: 'var(--color-secondary-orange)'}}>
                Don't have an account? Register here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
