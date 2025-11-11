# V1 Scope & Security Exclusions

## 1. Purpose

This document clarifies the features and standards that are **explicitly out of scope** for the V1 release of the Mayer platform. 

The goal of V1 is to deliver the core, business-critical functionality outlined in the `IMPLEMENTATION_PLAN.md`. Advanced security, compliance, and data management features will be prioritized and implemented in subsequent versions (V2, V3, etc.). This approach allows us to deliver value quickly while planning for robust security in the long term.

---

## 2. Security & Data Protection

While V1 will be built with security best practices in mind (e.g., using HTTPS, parameterized database queries to prevent SQL injection, and secure authentication), the following advanced measures are **out of scope for V1**.

### Data Encryption
- **Encryption at Rest:** Application-level encryption of specific sensitive fields in the database (e.g., encrypting a user's address) is not included. We will rely on the default database and filesystem encryption provided by the hosting environment.

### Data Masking & Anonymization
- **Data Masking:** Data will not be dynamically masked in API responses or logs for different user roles. For example, an admin will see a customer's full contact information.
- **Data Anonymization:** There will be no process for creating anonymized data sets for analytics or testing in V1.

### Access Control
- **Granular Role-Based Access Control (RBAC):** V1 will implement a simple, binary role system (`Customer` vs. `Admin`). A more granular system where admins can have specific permissions (e.g., a "Finance" role that can see billing but not plans) is a V2 feature.
- **Two-Factor Authentication (2FA/MFA):** The V1 authentication system will be based on username and password only. 2FA/MFA is a high-priority V2 feature.

---

## 3. Compliance & Auditing

### Regulatory Compliance
- **No Specific Compliance:** The V1 platform will **not** be certified for any specific regulatory standard like **SOC 2, HIPAA, or CCPA**. Achieving such compliance requires dedicated audits and processes that are out of scope for this initial build.

### Auditing
- **Comprehensive Audit Trails:** V1 will not include a detailed, immutable audit trail that logs every action performed by every user. Standard application logging for debugging and error tracking will be implemented, but it will not be a formal audit log.

---

## 4. Advanced Platform Features

### Security Operations
- **Intrusion Detection & Advanced Rate Limiting / DDoS Protection:** V1 will rely on the default protections offered by our hosting provider and web server for DDoS mitigation. Application-specific rate limiting (e.g., "you have made too many login attempts") and advanced intrusion detection systems are out of scope for V1.
- **Security Information and Event Management (SIEM):** We will not be integrating with a SIEM system in V1.

### Data Management
- **Data Retention Policies:** There will be no automated system for enforcing data retention rules (e.g., automatically deleting user data 5 years after their last interaction). Data will be retained indefinitely in V1.

## 5. V1 Security Commitment

Even with these exclusions, V1 is committed to being **SAFE**. We will achieve this by:

- **Securing all data in transit** with TLS (HTTPS).
- **Storing all passwords** using **Argon2** for hashing.
- **Protecting against common web vulnerabilities** like SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF) by using standard, secure practices and frameworks.
- **Following the principle of least privilege** in our cloud and application configuration.
