// frontend/src/utils/sanitize.js

/*
    Data Sanitization Utilities for XSS Prevention
    
    Security References (Harvard style):
    1. OWASP, 2025. *Cross Site Scripting Prevention Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html> 
       [Accessed 9 October 2025].
    2. React Documentation, 2025. *DOM Elements*. [online] Available at: 
       <https://react.dev/reference/react-dom/components/common> [Accessed 9 October 2025].
*/

/**
 * Sanitize string to prevent XSS attacks
 * Removes potentially dangerous characters and HTML tags
 * @param {string} input - The string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
};

/**
 * Sanitize currency amount
 * Ensures only valid numeric values with decimals
 * @param {number|string} amount - The amount to sanitize
 * @returns {number} - Sanitized numeric value
 */
export const sanitizeAmount = (amount) => {
  if (typeof amount === 'number') return amount;
  if (typeof amount !== 'string') return 0;
  
  // Remove non-numeric characters except decimal point
  const cleaned = amount.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Sanitize currency code
 * Ensures only uppercase 3-letter codes (ISO 4217)
 * @param {string} currency - The currency code to sanitize
 * @returns {string} - Sanitized currency code
 */
export const sanitizeCurrency = (currency) => {
  if (typeof currency !== 'string') return 'ZAR';
  
  // Only allow A-Z, convert to uppercase, limit to 3 characters
  const cleaned = currency.replace(/[^A-Z]/gi, '').toUpperCase().substring(0, 3);
  
  return cleaned || 'ZAR';
};

/**
 * Sanitize SWIFT code
 * Ensures only alphanumeric characters, 8-11 length
 * @param {string} swift - The SWIFT code to sanitize
 * @returns {string} - Sanitized SWIFT code
 */
export const sanitizeSwift = (swift) => {
  if (typeof swift !== 'string') return '';
  
  // Only allow alphanumeric, uppercase, 8-11 characters
  const cleaned = swift.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  return cleaned.substring(0, 11);
};

/**
 * Sanitize employee ID
 * Ensures format: EMP followed by numbers only
 * @param {string} employeeId - The employee ID to sanitize
 * @returns {string} - Sanitized employee ID
 */
export const sanitizeEmployeeId = (employeeId) => {
  if (typeof employeeId !== 'string') return '';
  
  // Extract EMP prefix and numbers only
  const cleaned = employeeId.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Ensure it starts with EMP
  if (!cleaned.startsWith('EMP')) return '';
  
  return cleaned.substring(0, 13); // EMP + max 10 digits
};

/**
 * Sanitize account number
 * Removes non-alphanumeric characters
 * @param {string} accountNumber - The account number to sanitize
 * @returns {string} - Sanitized account number
 */
export const sanitizeAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== 'string') return '';
  
  // Only allow alphanumeric characters
  return accountNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 20);
};

/**
 * Sanitize date for display
 * Ensures valid date object
 * @param {string|Date} date - The date to sanitize
 * @returns {Date|null} - Valid Date object or null
 */
export const sanitizeDate = (date) => {
  if (!date) return null;
  
  const parsed = new Date(date);
  
  // Check if date is valid
  if (isNaN(parsed.getTime())) return null;
  
  return parsed;
};

/**
 * Sanitize transaction status
 * Ensures only valid status values
 * @param {string} status - The status to sanitize
 * @returns {string} - Sanitized status
 */
export const sanitizeStatus = (status) => {
  if (typeof status !== 'string') return 'pending';
  
  const validStatuses = ['pending', 'accepted', 'rejected'];
  const cleaned = status.toLowerCase().trim();
  
  return validStatuses.includes(cleaned) ? cleaned : 'pending';
};

/**
 * Sanitize MongoDB ObjectId
 * Ensures only valid hex characters, 24 length
 * @param {string} id - The ObjectId to sanitize
 * @returns {string} - Sanitized ObjectId
 */
export const sanitizeObjectId = (id) => {
  if (typeof id !== 'string') return '';
  
  // Only allow hex characters, exactly 24 length
  const cleaned = id.replace(/[^a-f0-9]/gi, '').toLowerCase();
  
  return cleaned.substring(0, 24);
};

/**
 * Sanitize rejection reason
 * Removes HTML and limits length
 * @param {string} reason - The rejection reason to sanitize
 * @returns {string} - Sanitized rejection reason
 */
export const sanitizeRejectionReason = (reason) => {
  if (typeof reason !== 'string') return '';
  
  // Remove HTML tags and trim
  let sanitized = reason.replace(/<[^>]*>/g, '').trim();
  
  // Limit to 500 characters
  sanitized = sanitized.substring(0, 500);
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

/**
 * Sanitize full name
 * Allows only letters, spaces, hyphens, apostrophes
 * @param {string} name - The name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  
  // Only allow letters, spaces, hyphens, apostrophes
  const cleaned = name.replace(/[^a-zA-Z\s'-]/g, '').trim();
  
  return cleaned.substring(0, 50);
};

/**
 * Sanitize entire transaction object
 * Applies appropriate sanitization to all fields
 * @param {object} transaction - The transaction object to sanitize
 * @returns {object} - Sanitized transaction object
 */
export const sanitizeTransaction = (transaction) => {
  if (!transaction || typeof transaction !== 'object') return null;
  
  return {
    _id: sanitizeObjectId(transaction._id || ''),
    userId: transaction.userId ? {
      fullName: sanitizeName(transaction.userId.fullName || ''),
      accountNumber: sanitizeAccountNumber(transaction.userId.accountNumber || ''),
      idNumber: sanitizeString(transaction.userId.idNumber || '')
    } : null,
    amount: sanitizeAmount(transaction.amount),
    currency: sanitizeCurrency(transaction.currency),
    swift: sanitizeSwift(transaction.swift),
    status: sanitizeStatus(transaction.status),
    reviewedBy: transaction.reviewedBy ? sanitizeEmployeeId(transaction.reviewedBy) : null,
    reviewedAt: transaction.reviewedAt ? sanitizeDate(transaction.reviewedAt) : null,
    rejectionReason: transaction.rejectionReason ? sanitizeRejectionReason(transaction.rejectionReason) : null,
    createdAt: sanitizeDate(transaction.createdAt),
    updatedAt: sanitizeDate(transaction.updatedAt)
  };
};

/**
 * Sanitize array of transactions
 * @param {array} transactions - Array of transaction objects
 * @returns {array} - Array of sanitized transactions
 */
export const sanitizeTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return [];
  
  return transactions.map(sanitizeTransaction).filter(t => t !== null);
};

export default {
  sanitizeString,
  sanitizeAmount,
  sanitizeCurrency,
  sanitizeSwift,
  sanitizeEmployeeId,
  sanitizeAccountNumber,
  sanitizeDate,
  sanitizeStatus,
  sanitizeObjectId,
  sanitizeRejectionReason,
  sanitizeName,
  sanitizeTransaction,
  sanitizeTransactions
};

