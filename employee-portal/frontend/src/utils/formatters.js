// frontend/src/utils/formatters.js

/*
    Data formatting utilities for professional display
    
    Features:
    - Account number masking for privacy
    - Currency formatting
    - Date formatting
    - ID number masking (GDPR/POPIA compliance)
    
    Security References (Harvard style):
    1. OWASP, 2025. *Data Minimization*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
    2. POPIA, 2025. *Protection of Personal Information Act*. [online] Available at:
       <https://popia.co.za/>
*/

/**
 * Mask account number for privacy
 * Shows first 3 and last 3 characters, masks the rest
 * Example: ACC123456 → ACC****456
 * 
 * @param {string} accountNumber - The account number to mask
 * @returns {string} - Masked account number
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || typeof accountNumber !== 'string') return 'N/A';
  
  const cleaned = accountNumber.trim();
  
  if (cleaned.length <= 6) {
    // If too short, just mask middle
    return cleaned.substring(0, 2) + '***' + cleaned.substring(cleaned.length - 1);
  }
  
  // Show first 3 and last 3, mask the middle
  const first = cleaned.substring(0, 3);
  const last = cleaned.substring(cleaned.length - 3);
  const middle = '*'.repeat(Math.min(cleaned.length - 6, 6));
  
  return `${first}${middle}${last}`;
};

/**
 * Mask ID number for privacy (POPIA compliance)
 * Shows only last 4 digits
 * Example: 9001015009087 → *********9087
 * 
 * @param {string} idNumber - The ID number to mask
 * @returns {string} - Masked ID number
 */
export const maskIdNumber = (idNumber) => {
  if (!idNumber || typeof idNumber !== 'string') return 'N/A';
  
  const cleaned = idNumber.trim();
  
  if (cleaned.length <= 4) return cleaned;
  
  const last4 = cleaned.substring(cleaned.length - 4);
  const masked = '*'.repeat(cleaned.length - 4);
  
  return `${masked}${last4}`;
};

/**
 * Format currency amount with symbol
 * Example: 1000, 'ZAR' → R 1,000.00
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (ISO 4217)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'ZAR') => {
  if (typeof amount !== 'number') return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format date for display
 * Example: 2025-01-06T10:30:00.000Z → Jan 6, 2025, 10:30 AM
 * 
 * @param {string|Date} dateString - The date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleString('en-US', options);
};

/**
 * Format date as relative time
 * Example: "2 hours ago", "3 days ago"
 * 
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString, false);
};

/**
 * Get initials from full name
 * Example: "John Doe" → "JD"
 * 
 * @param {string} fullName - The full name
 * @returns {string} - Initials (max 2 letters)
 */
export const getInitials = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return '??';
  
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  const first = parts[0][0] || '';
  const last = parts[parts.length - 1][0] || '';
  
  return (first + last).toUpperCase();
};

/**
 * Truncate text with ellipsis
 * Example: "Long text here" → "Long te..."
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format SWIFT code with spacing for readability
 * Example: ABCDEFGH123 → ABCD EFGH 123
 * 
 * @param {string} swift - SWIFT code
 * @returns {string} - Formatted SWIFT code
 */
export const formatSwift = (swift) => {
  if (!swift || typeof swift !== 'string') return 'N/A';
  
  const cleaned = swift.trim();
  
  // Add space after 4th and 8th character
  if (cleaned.length >= 8) {
    return cleaned.substring(0, 4) + ' ' + 
           cleaned.substring(4, 8) + ' ' + 
           cleaned.substring(8);
  }
  
  return cleaned;
};

export default {
  maskAccountNumber,
  maskIdNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getInitials,
  truncateText,
  formatSwift
};

