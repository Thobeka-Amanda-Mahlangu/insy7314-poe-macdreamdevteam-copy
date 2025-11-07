import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';

// --- Validation Schema ---
const PaymentSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Amount must be at least 1.')
    .max(1000000, 'Maximum transfer amount is 1,000,000.')
    .test('is-decimal', 'Invalid amount format.', (value) =>
      value && /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .required('Amount is required.'),

  currency: Yup.string()
    .matches(/^[A-Z]{3}$/, 'Currency must be a 3-letter ISO code (e.g., USD, EUR, ZAR).')
    .required('Currency is required.'),

  swift: Yup.string()
    .matches(/^[A-Z0-9]{8,11}$/, 'SWIFT Code must be 8–11 characters.')
    .required('SWIFT Code is required.'),
});

const PaymentForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      amount: '',
      currency: 'USD',
      swift: '',
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);
      try {
        const response = await authApi.post('/transactions', {
          ...values,
          amount: parseFloat(values.amount).toFixed(2),
        });

        navigate('/confirm', { state: { transaction: response.data } });
      } catch (err) {
        console.error('Payment Submission Failed:', err.response || err);
        navigate('/error', {
          state: { message: 'Your payment could not be completed at this time.' },
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h5 className="mb-3 pt-3" style={{ color: 'var(--color-primary-blue)' }}>
        Transaction Details
      </h5>

      {/* Amount */}
      <div className="mb-3">
        <label htmlFor="amount" className="form-label" style={{ color: 'white' }}>
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          className={`form-control ${
            formik.touched.amount && formik.errors.amount ? 'is-invalid' : ''
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.amount}
        />
        {formik.touched.amount && formik.errors.amount && (
          <div className="invalid-feedback">{formik.errors.amount}</div>
        )}
      </div>

      {/* Currency */}
      <div className="mb-3">
        <label htmlFor="currency" className="form-label" style={{ color: 'white' }}>
          Currency
        </label>
        <select
          id="currency"
          name="currency"
          className={`form-select ${
            formik.touched.currency && formik.errors.currency ? 'is-invalid' : ''
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.currency}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="ZAR">ZAR</option>
        </select>
        {formik.touched.currency && formik.errors.currency && (
          <div className="invalid-feedback">{formik.errors.currency}</div>
        )}
      </div>

      {/* SWIFT */}
      <div className="mb-3">
        <label htmlFor="swift" className="form-label" style={{ color: 'white' }}>
          SWIFT/BIC Code
        </label>
        <input
          id="swift"
          name="swift"
          type="text"
          placeholder="e.g., NNDIZAJJXXX"
          className={`form-control ${
            formik.touched.swift && formik.errors.swift ? 'is-invalid' : ''
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.swift}
        />
        {formik.touched.swift && formik.errors.swift && (
          <div className="invalid-feedback">{formik.errors.swift}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100 py-3 mt-4" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Processing Payment...
          </>
        ) : (
          <>
            <i className="bi bi-box-arrow-right me-2"></i> Confirm and Pay Now
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;