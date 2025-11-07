// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Validation Schema for Employee Login
const LoginSchema = Yup.object().shape({
  employeeId: Yup.string()
    .matches(/^EMP\d{5,10}$/, 'Employee ID must be in format EMP##### (e.g., EMP12345)')
    .required('Employee ID is required.'),
  password: Yup.string().required('Password is required.'),
});

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log("📤 Starting employee login process");
      console.log("📤 Sending login data:", { employeeId: values.employeeId });

      setError(null);
      try {
        const response = await login({
          employeeId: values.employeeId,
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
            style={{backgroundColor: 'var(--color-light-bg)', border: '1px solid var(--color-primary-green)'}}
          >
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{color: 'var(--color-primary-green)'}}>
                <i className="bi bi-person-badge me-2"></i> Employee Login
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* Employee ID */}
                <div className="mb-3">
                  <label htmlFor="employeeId" className="form-label text-white">
                    <i className="bi bi-credit-card-2-front me-1"></i> Employee ID
                  </label>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    placeholder="e.g., EMP12345"
                    className={`form-control ${formik.touched.employeeId && formik.errors.employeeId ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('employeeId')}
                  />
                  {formik.touched.employeeId && formik.errors.employeeId && (
                    <div className="invalid-feedback">{formik.errors.employeeId}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-white">
                    <i className="bi bi-key me-1"></i> Password
                  </label>
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
            <p className="text-center mt-3 small" style={{color: 'var(--color-text-muted)'}}>
              <i className="bi bi-shield-lock me-1"></i>
              Secure employee authentication with token-based session validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
