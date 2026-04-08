# POST OFFICE SYSYEM

## 1. Introduction
The Post Office System is a web-based application that allows customers to create and manage parcel shipments online. 
The system enables users to generate shipping labels, make online payments, print labels, and drop parcels at post office branches for delivery.
The platform improves convenience by reducing waiting time at post offices and allowing customers to complete shipping preparation from home.
In addition, the system provides an administrative dashboard for post office staff to monitor parcel statistics and revenue reports. 
The system also supports shipment tracking, allowing customers to check the status and location of their parcels.

## 2. Objectives
- To develop an online parcel shipment system for Thailand Post services.
- To allow customers to create shipments and generate shipping labels online.
- To provide secure online payment methods for shipping services.
- To allow users to track parcel delivery status in real time.
- To provide an admin dashboard for monitoring parcel statistics and revenue.
- To improve operational efficiency and reduce congestion at physical post office branches.

## 3. Project Scope
### In Scope
The system will include the following features:
- Customer account registration with identity verification
- Account approval by post office staff
- Customer login and authentication
- Shipment creation for parcels or letters
- Shipping cost calculation
- Optional shipment insurance
- Electronic payment (PromptPay, Credit Card, TrueMoney Wallet)
- Shipping label generation in PDF format
- Parcel tracking system
- Customer shipment history
- Admin dashboard for viewing parcel and revenue statistics
- Report export in PDF format
### Out of Scope
The following features are not included in this system:
- Real-time integration with the physical logistics system
- Direct integration with external courier companies
- Mobile application development
- Automated parcel sorting system
- Real-time GPS tracking of delivery vehicles


## 4. Functional Requirements
FR-01: User Registration <br>
Customers must be able to register an account by providing personal information and uploading identity verification documents.

FR-02: Account Verification <br>
Post office staff must review and approve or reject customer registration requests.

FR-03: User Login <br>
Registered users must be able to log in using their email and password.

FR-04: Create Shipment <br>
Customers must be able to create a shipment by entering parcel information and receiver details.

FR-05: Shipping Cost Calculation <br>
The system must automatically calculate the shipping cost based on parcel type, size, weight, and destination.

FR-06: Insurance Option <br>
Customers must be able to optionally purchase shipment insurance based on the declared value of the item.

FR-07: Online Payment <br>
Customers must be able to pay shipping fees electronically using supported payment methods.

FR-08: Shipping Label Generation <br>
After successful payment, the system must generate a PDF shipping label containing shipment details and tracking information.

FR-09: Parcel Tracking <br>
Customers must be able to track parcel delivery status using a tracking number.

FR-10: Transaction History <br>
Customers must be able to view their previous shipment transactions.

FR-11: Admin Statistics Dashboard <br>
Post office staff must be able to view parcel statistics filtered by day, week, month, and parcel type.

FR-12: Revenue Report <br>
Admins must be able to view revenue statistics for selected time periods.

FR-13: Report Export <br>
Admins must be able to export parcel and revenue reports in PDF format.
 
## 5. Non-Functional Requirements
NFR-01: Availability <br>
The system must achieve 99.999% uptime availability, allowing a maximum downtime of approximately 5 minutes per year.

NFR-02: Performance <br>
System response time must be less than 1 second for normal operations such as searching zip codes, viewing shipment history, and tracking parcels.

NFR-03: Security <br>
The system must ensure protection of sensitive data such as personal information, national ID data, and payment information.

Security mechanisms must include:

- HTTPS encryption

- Encrypted database storage

- Secure authentication

- Protection against common attacks such as SQL Injection and Cross-Site Scripting (XSS)

NFR-04: Usability <br>
The user interface must be simple, intuitive, and easy to use for customers.

NFR-05: Branding <br>
The system UI must follow Thailand Post branding colors: red and white.


## 6. User Roles
Customer <br>
Customers are users who send parcels. They can register accounts, create shipments, pay for shipping, track parcels, and view shipment history.

Post Office Staff (Admin) <br>
Admins are post office employees who manage the system. They approve user registrations, view shipment statistics, monitor revenue data, and export reports.

Bank system  <br>
The system provided for implement the gate ways payment.
## 7. Tools and Technologies
Version Control

- GitHub

Programming Language

- HTML

- CSS

- JavaScript

Backend Framework

- Node.js

- Express.js

- Database

- PostgreSQL

Other Tools

- PDF Generation Library

- QR Code Generator

## 8. Assumptions and Constraints
Assumptions

- Users have internet access and a web browser.

- Customers have valid identification documents for verification.

- Users have access to electronic payment methods.

Constraints

- The system must follow Thailand Post branding guidelines.

- Payment integration depends on external payment provider APIs.

- System performance depends on hosting infrastructure and network conditions.






