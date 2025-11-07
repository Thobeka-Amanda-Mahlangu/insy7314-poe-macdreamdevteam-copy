import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../api/api'; // axios instance

// --- SECURITY REQUIREMENT: Input Whitelisting using RegEx Patterns ---
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[a-zA-Z\s'-]+$/, 'Full Name contains invalid characters.')
    .min(3, 'Full Name must be at least 3 characters.')
    .required('Full Name is required.'),
    
  idNumber: Yup.string()
    .matches(/^\d{13}$/, 'ID Number must be a valid 13-digit number.')
    .required('ID Number is required.'),
    
  accountNumber: Yup.string()
    .matches(/^[0-9]{5,15}$/, 'Account Number must be 5-15 digits.')
    .required('Account number is required.'),
    
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.')
    .required('Password is required.'),
});

const RegisterPage = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      idNumber: '',
      accountNumber: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log("📤 Starting registration process"); // log start of registration
      setError(null);
      setSuccess(false);
      console.log("📤 Starting registration process"); // log start of registration
      try {
        console.log("📤 Sending registration data:", values); // log form values

        // --- STEP 1: Get CSRF token ---
        const { data: { csrfToken } } = await publicApi.get('/auth/csrf-token');
        console.log("🔒 CSRF Token:", csrfToken); // log CSRF token

        // --- STEP 2: Send register request with CSRF header ---
        const response = await publicApi.post(
          '/auth/register',
          {
            fullName: values.fullName,
            idNumber: values.idNumber,
            accountNumber: values.accountNumber,
            password: values.password,
          },
          { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
        );
        
        if (response.status === 201) {
          setSuccess(true);
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed.');
        console.error('Registration Error:', err.response?.data || err.message);
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center my-5">
        <div className="col-md-7 col-lg-6">
          <div 
            className="card shadow-lg p-4" 
            style={{backgroundColor: 'var(--color-light-bg)', border: '1px solid var(--color-secondary-orange)'}}
          >
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{color: 'var(--color-secondary-orange)'}}>
                <i className="bi bi-person-plus me-2"></i> New Customer Registration
              </h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">✅ Registration successful! Redirecting...</div>}

              <form onSubmit={formik.handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className={`form-control ${formik.touched.fullName && formik.errors.fullName ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('fullName')}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="invalid-feedback">{formik.errors.fullName}</div>
                  )}
                </div>
                
                {/* ID Number */}
                <div className="mb-3">
                  <label htmlFor="idNumber" className="form-label">ID Number</label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    placeholder="13-digit number"
                    className={`form-control ${formik.touched.idNumber && formik.errors.idNumber ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('idNumber')}
                  />
                  {formik.touched.idNumber && formik.errors.idNumber && (
                    <div className="invalid-feedback">{formik.errors.idNumber}</div>
                  )}
                </div>
                
                {/* Account Number */}
                <div className="mb-3">
                  <label htmlFor="accountNumber" className="form-label">Account Number</label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    placeholder="e.g., 123456789"
                    className={`form-control ${formik.touched.accountNumber && formik.errors.accountNumber ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('accountNumber')}
                  />
                  {formik.touched.accountNumber && formik.errors.accountNumber && (
                    <div className="invalid-feedback">{formik.errors.accountNumber}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Strong Password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-outline-success w-100 py-2">
                  <i className="bi bi-person-check me-2"></i> Register Account
                </button>
              </form>
            </div>
            
            <p className="text-center mt-3 small">
              <Link to="/login" style={{color: 'var(--color-primary-blue)'}}>
                Already have an account? Log in here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;