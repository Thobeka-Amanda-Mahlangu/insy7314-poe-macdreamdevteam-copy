#  Secure International Payments Portal (Two-Portal Solution)

This project implements a secure, two-portal solution for processing international payments, separating the customer-facing initiation process from the internal employee verification and submission workflow.

The core goal is to provide **secure authentication**, a clear **audit trail**, and robust **Role-Based Access Control (RBAC)** across the system, adhering to strict security best practices (DevSecOps integration, input validation, token-based security).

---

##  Architecture and Setup

The system is built on a segregated architecture using two separate Node.js backends that share a single MongoDB database instance.

| Portal | Port | Audience | Key Functions |
| :--- | :--- | :--- | :--- |
| **Customer Portal** | `5001` | External Users | Registration, Login, **Payment Submission** (Status: `pending`), View Own Transactions. |
| **Employee Portal** | `5002` | Internal Staff | Static Login, View **Pending Payments**, **Accept/Reject** Transactions, Audit Review. |

### Prerequisites

* Node.js (v18+) and npm
* MongoDB Instance (Local or Hosted)
* Access to the `INTEGRATION_GUIDE.md` for full environment variable setup.

### Quick Start Setup

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd payments-portal
    ```

2.  **Install Dependencies:**
    ```bash
    # Install dependencies for the main customer portal
    cd payments-portal && npm install 
    # Install dependencies for the employee verification portal
    cd ../employee-portal && npm install 
    ```

3.  **Create Initial Employee Account (Required for Employee Portal Access):**
    The employee backend includes a utility to create the initial administrative account.
    ```bash
    cd employee-portal/backend
    npm run add-employee
    # Default Credentials: EMP00001 / AdminPass123!
    ```

4.  **Start the Backends (Simultaneously):**
    ```bash
    # Terminal 1: Start Customer Portal
    cd payments-portal/backend && npm start 
    
    # Terminal 2: Start Employee Portal
    cd ../../employee-portal/backend && npm start 
    ```
    *(Ensure your frontend applications are also running.)*

---

##  Core Features and Security

### 1. Transaction Workflow and Audit Trail

Payments follow a strict lifecycle managed by the `status` field:

* `pending`: Initial status after customer submission.
* `accepted`: Status when employee approves. Triggers submission to a simulated SWIFT route.
* `rejected`: Status when employee rejects. Requires a `rejectionReason`.

**Audit Fields:** Every review action includes `reviewedBy` (Employee ID) and `reviewedAt` (Timestamp) for a complete, non-repudiable audit trail.

### 2. Employee Portal API Endpoints (Port 5002)

All employee routes require a valid JWT via the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Security Note |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions/pending` | Retrieves all transactions requiring verification. | **RBAC enforced.** |
| `PATCH` | `/api/transactions/:id/accept` | Marks transaction as `accepted`, logs `reviewedBy`/`reviewedAt`. | High-privilege route. |
| `PATCH` | `/api/transactions/:id/reject` | Marks transaction as `rejected`, requires `rejectionReason`. | Handles required input validation (10-500 chars). |
| `GET` | `/api/stats/summary` | Provides dashboard analytics (e.g., total volume, rejected count). | |

### 3. DevSecOps Integration 

* **CI/CD:** Implemented using **CircleCI** for automated builds and testing.
* **Static Analysis:** **SonarQube** is integrated into the pipeline to scan for code quality, bugs, and security hotspots.
* **Security Audits:** Integration with **MobSF** (Mobile Security Framework) and **ScoutSuite** for dependency and cloud configuration scanning.

### 4. Frontend Security 

* **Input Validation:** Robust client-side validation (e.g., regex whitelisting for `employeeId`) using Yup/Formik.
* **Data Sanitization:** All displayed transaction data in the Employee Dashboard is sanitized to prevent **Cross-Site Scripting (XSS)** attacks.
* **Session Security:** Separate contexts (`AuthContext` and `EmployeeAuthContext`) ensure customer and employee sessions are completely isolated. Secure JWT token management (storage and clearing on 401 response).

---

##  Documentation

Refer to the following files for in-depth information:

* `INTEGRATION_GUIDE.md`: Full environment setup and dependency configuration.
* `QUICK_INTEGRATION_SETUP.md`: Step-by-step guide for first-time deployers.
* `ARCHITECTURE_OVERVIEW.md`: Visual diagrams of the two-portal structure and data flow.
