/*
    Regular expressions for input validation (whitelisting)

    Security & Technical References (Harvard style):
    1. OWASP, 2025. *Input Validation Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. Mozilla, 2025. *Regular Expressions (RegExp)*. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions> [Accessed 9 October 2025].
    3. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].
*/

const name = /^[a-zA-Z\s'-]{3,50}$/;            // Letters, spaces, apostrophes & hyphens, 3–50 chars
const idNumber = /^\d{13}$/;                    // 13-digit South African ID
const accountNumber = /^\d{5,15}$/;             // 5–15 digit bank account number
const password = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/; // Min 8 chars with uppercase, number & special char

export default { name, idNumber, accountNumber, password };
