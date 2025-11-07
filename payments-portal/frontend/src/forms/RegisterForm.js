/*
    Frontend Registration & Validation References (Harvard style):

    1. OWASP, 2025. *Input Validation Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html> [Accessed 9 October 2025].

    2. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].

    3. Formik Docs, 2025. *Building Forms in React*. [online] Available at: 
       <https://formik.org/docs/overview> [Accessed 9 October 2025].

    4. Yup Docs, 2025. *Yup Validation Library*. [online] Available at: 
       <https://github.com/jquense/yup> [Accessed 9 October 2025].

    5. ISO 27001, 2025. *Information Security Management Guidelines*. [online] Available at:
       <https://www.iso.org/isoiec-27001-information-security.html> [Accessed 9 October 2025].
*/

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../api/api';

// --- Validation Schema (matches backend fields) ---
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[a-zA-Z\s'-]+$/, 'Full Name contains invalid characters.')
    .min(3, 'Full Name must be at least 3 characters.')
    .required('Full Name is required.'),
    
  idNumber: Yup.string()
    .matches(/^\d{13}$/, 'ID Number must be a valid 13-digit number.')
    .required('ID Number is required.'),
    
  accountNumber: Yup.string()
    .matches(/^[0-9]{5,15}$/, 'Account Number must be 5–15 digits.')
    .required('Account number is required.'),
    
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter.')
    .matches(/[0-9]/, 'Must contain at least one number.')
    .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character.')
    .required('Password is required.'),
});

const RegisterForm = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      setMessage('');
      setIsError(false);

      try {
        // --- Step 1: Get CSRF token ---
        const { data: { csrfToken } } = await publicApi.get('/auth/csrf-token');

        // --- Step 2: Send register request ---
        await publicApi.post(
          '/auth/register',
          {
            fullName: values.fullName,
            idNumber: values.idNumber,
            accountNumber: values.accountNumber,
            password: values.password,
          },
          { headers: { 'X-CSRF-Token': csrfToken } }
        );

        setMessage('✅ Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setIsError(true);
        setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 shadow-lg rounded bg-light">
      <h2 className="mb-4">Register Account</h2>

      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}

      {/* Full Name */}
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className={`form-control ${formik.touched.fullName && formik.errors.fullName ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('fullName')}
          disabled={isSubmitting}
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
          className={`form-control ${formik.touched.idNumber && formik.errors.idNumber ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('idNumber')}
          disabled={isSubmitting}
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
          className={`form-control ${formik.touched.accountNumber && formik.errors.accountNumber ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('accountNumber')}
          disabled={isSubmitting}
        />
        {formik.touched.accountNumber && formik.errors.accountNumber && (
          <div className="invalid-feedback">{formik.errors.accountNumber}</div>
        )}
      </div>

      {/* Password */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('password')}
          disabled={isSubmitting}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;