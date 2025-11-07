/*
    Frontend Security & Validation References (Harvard style):

    1. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].

    2. OWASP, 2025. *Input Validation Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html> [Accessed 9 October 2025].

    3. Formik Docs, 2025. *Building Forms in React*. [online] Available at: 
       <https://formik.org/docs/overview> [Accessed 9 October 2025].

    4. Yup Docs, 2025. *Yup Validation Library*. [online] Available at: 
       <https://github.com/jquense/yup> [Accessed 9 October 2025].

    5. Mozilla Developer Network (MDN), 2025. *HTML Input Element*. [online] Available at: 
       <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input> [Accessed 9 October 2025].
*/

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext'; // To access the login function

// NOTE: Based on the POE, customers log in with username, account number, AND password[cite: 54].
// We will focus on username and password for simplicity, but the account number would also be a required field.

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required."),
  accountNumber: Yup.string()
    .matches(/^[0-9]{5,15}$/, "Account number must be 5-15 digits.")
    .required("Account Number is required."),
  password: Yup.string().required("Password is required."),
});

const LoginForm = () => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      accountNumber: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        await login(values); // AuthContext handles token + redirect
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "Invalid login attempt.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 shadow-lg rounded bg-light">
      <h2 className="mb-4">Customer Login</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Username */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className={`form-control ${formik.touched.username && formik.errors.username ? "is-invalid" : ""}`}
          {...formik.getFieldProps("username")}
          disabled={isSubmitting}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="invalid-feedback">{formik.errors.username}</div>
        )}
      </div>

      {/* Account Number */}
      <div className="mb-3">
        <label htmlFor="accountNumber" className="form-label">Account Number</label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          className={`form-control ${formik.touched.accountNumber && formik.errors.accountNumber ? "is-invalid" : ""}`}
          {...formik.getFieldProps("accountNumber")}
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
          className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
          {...formik.getFieldProps("password")}
          disabled={isSubmitting}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};