# 🤖 D3 AI Usage Log

> **Deliverable D3 — Transparent AI Usage Documentation**  
> This log records all AI tool usage during development, including prompts, decisions, and verification steps.

---

## 📊 Summary Table

| Entry | Date | Tool | Feature | Accepted | Rejected | Verified |
|-------|------|------|---------|----------|----------|----------|
| AI-001 | 2026-03-01 | Claude AI | User Dashboard | ✅ Partial | Heavy chart library | Mobile + Quick Track test |
| AI-002 | 2026-03-02 | Claude AI | Login Page | ✅ Full | Page reload on tab switch | Form validation + mobile |
| AI-003 | 2026-03-04 | Claude AI | Registration & KYC | ✅ Partial | Single scroll form | Password + avatar + upload |
| AI-004 | 2026-03-05 | Claude AI | Create Shipment Form | ✅ Partial | Modal for dimensions | Interactive UI checks |
| AI-005 | 2026-03-06 | Claude AI | Tracking & History | ✅ Partial | Real API calls | Spinner + timeline demo |
| AI-006 | 2026-03-08 | Claude AI | Payment & PDF Label | ✅ Partial | PDF in new tab | Overlay + A6 download |
| AI-007 | 2026-03-09 | Claude AI | Admin Dashboard | ✅ Partial | Duplicated navbar HTML | Dark theme + navigation |
| AI-008 | 2026-03-11 | Claude AI | Admin PDF Reports | ✅ Partial | HTML2Canvas screenshots | Cover + tables + footer |
| AI-009 | 2026-03-12 | PostgreSQL / Claude AI | Database Schema | ✅ Partial | PDF BLOBs in DB | ERD + 10ms lookup check |
| AI-010 | 2026-03-13 | Node.js / Bcrypt | Auth API | ✅ Partial | MD5 hashing | Postman 401/200 tests |
| AI-011 | 2026-03-14 | Multer / AWS S3 | KYC File Upload | ✅ Partial | Local /uploads folder | DB URL + badge check |
| AI-012 | 2026-03-15 | Express / Sequelize | Real-time Tracking | ✅ Partial | Long-polling | Live DB tracking test |
| AI-013 | 2026-03-17 | SQL / PDF Engine | Admin Analytics | ✅ Partial | Node.js totals calc | Real chart data check |

---

## 📝 Log Entries

---

### AI-001 — Figma Translation & User Dashboard Development

| Field | Details |
|-------|---------|
| **Date** | 2026-03-29 |
| **Tool Used** | Claude AI |
| **Feature** | `userdashboard.html` — Full user dashboard layout |
| **Prompt Used** | *"Analyze post office mockup theme. Create userdashboard.html that users hop to after login. Include sidebar navigation (links to Tracking, Create, History, Payment with active states/badges), topbar with greeting/search/notifications, 4 stats cards with trend indicators, recent shipments table, inline Quick Track widget (TH-2024-0089 test case), profile card, quick actions grid, notifications panel, 6-month activity bar chart, and recent activity timeline. Must be mobile responsive with a hamburger toggle."* |
| **What Was Accepted** | Responsive CSS Grid layout for dashboard components and animated 6-month shipment history chart |
| **What Was Rejected** | A complex JS charting library for the activity bar chart — opted for a lighter custom CSS/SVG implementation to improve load time |
| **Verification Method** | ✅ Dashboard collapses correctly on mobile screens. ✅ Hamburger menu toggles correctly on small viewports. ✅ Typing `TH-2024-0089` into the Quick Track widget returns instant inline results as expected |

---

### AI-002 — Login Page & Theme Establishment

| Field | Details |
|-------|---------|
| **Date** | 2026-03-1 |
| **Tool Used** | Claude AI |
| **Feature** | `LoginPage.html` — Login UI with User/Admin tab switcher |
| **Prompt Used** | *"Create a post office themed Login Page. Use a two-column layout: branded left panel with features, clean form on the right. Include User/Admin tab switcher that updates labels/button text dynamically. Add form validation (red highlights + error text), password show/hide icon toggle, remember me, forgot password link. Include a loading spinner on submit followed by success animation, floating envelope background decorations, and make it collapse to a single column on mobile."* |
| **What Was Accepted** | CSS keyframe animations for the floating envelope background and the success submit animation; dynamic DOM updates for User/Admin toggling |
| **What Was Rejected** | Reloading the page when switching between User and Admin tabs — built as a seamless client-side toggle instead |
| **Verification Method** | ✅ Form blocks submission when fields are empty and turns fields red with error text. ✅ Mobile view collapses gracefully to a single column. ✅ Password show/hide icon toggles input type correctly |

---

### AI-003 — Multi-Step Registration & KYC Flow

| Field | Details |
|-------|---------|
| **Date** | 2026-03-2 |
| **Tool Used** | Claude AI |
| **Feature** | `RegisterPage.html` — 3-step registration with ID verification |
| **Prompt Used** | *"Build a 3-step register page. Step 1: Personal info (Name, DOB, gender, national ID) + clickable emoji avatar picker. Step 2: Contact details (Phone, address, province dropdown, postal, notes). Step 3: Account setup (Username, password with live 4-bar Weak→Strong strength meter, confirm password mismatch check, role/branch selectors, terms checkbox). Add a polished ID verification section with two drag-and-drop upload zones: National ID flat photo and person holding ID."* |
| **What Was Accepted** | Segmented form logic allowing users to navigate back and forth between 3 steps without losing state; live regex checks for the 4-bar strength meter |
| **What Was Rejected** | Single massive scrollable form — split into steps to reduce cognitive load |
| **Verification Method** | ✅ Password mismatch throws an immediate UI error on Step 3. ✅ Avatar picker cycles through all emoji options successfully. ✅ ID drop zones accept image file types and preview the uploaded image |

---

### AI-004 — Interactive Create Shipment Form

| Field | Details |
|-------|---------|
| **Date** | 2026-03-3 |
| **Tool Used** | Claude AI |
| **Feature** | `CreateShipmentPage.html` — Package details with interactive selectors |
| **Prompt Used** | *"CreateShipmentPage UI. Include Sender Info and Receiver Info sections. Add Package Details with interactive selection: type cards (Parcel/Letter/Express/Registered), service level pills (Standard/Priority/Same Day), dimensions grid (W×L×H×weight), contents description, declared value input, special handling chips (Fragile, Keep Cold), and an insurance toggle switch."* |
| **What Was Accepted** | Interactive UI patterns — clickable cards, pills, and chips — instead of standard HTML `<select>` dropdowns for better user experience |
| **What Was Rejected** | Hiding the dimensions grid behind a modal — kept inline for faster data entry |
| **Verification Method** | ✅ Clicking service level pills correctly highlights the active selection and deselects others. ✅ Toggling the insurance switch dynamically updates the UI state. ✅ Special handling chips toggle on/off independently |

---

### AI-005 — Tracking & History Pages

| Field | Details |
|-------|---------|
| **Date** | 2026-03-4 |
| **Tool Used** | Claude AI |
| **Feature** | `TrackingPage.html`, `HistoryPage.html` |
| **Prompt Used** | *"Build a TrackingPage and HistoryPage based on the post office theme. For Tracking: Add a large Search Hero section, large tracking ID input with 'Enter' key support, and 4 clickable demo IDs that show different status scenarios. Show a loading spinner animation while 'fetching'. Ensure the HistoryPage seamlessly matches the established UI."* |
| **What Was Accepted** | Intercepting the `Enter` key press on the main input to trigger the loading spinner and mock API fetch |
| **What Was Rejected** | Real API calls at this stage — mocked the 4 demo IDs using `setTimeout` promises to simulate network latency for the UI demo |
| **Verification Method** | ✅ Clicking each demo ID clears the previous state and triggers the loading spinner. ✅ Each ID displays the correct simulated status timeline. ✅ `HistoryPage` layout matches the established theme without visual inconsistency |

---

### AI-006 — Payment Options & PDF Label Generation

| Field | Details |
|-------|---------|
| **Date** | 2026-03-5 |
| **Tool Used** | Claude AI |
| **Feature** | `PaymentPage.html` — Payment flow with A6 PDF label download |
| **Prompt Used** | *"Build PaymentPage with multiple payment options. Create a success overlay that appears after successful payment. In the overlay, include a prominent 'Download Shipping Label (PDF)' button at the top of the actions. Clicking it should instantly generate and download a styled A6 PDF label containing shipment details."* |
| **What Was Accepted** | Client-side PDF generation for the A6 label to ensure immediate download without requiring a backend round-trip |
| **What Was Rejected** | Opening the PDF in a new tab — forced a direct `.pdf` download to streamline the user workflow |
| **Verification Method** | ✅ Success overlay triggers correctly after payment confirmation. ✅ Clicking the download button drops an accurately sized A6 PDF into the browser's download folder. ✅ PDF contains correct shipment details |

---

### AI-007 — Admin Dashboard & Navigation Overhaul

| Field | Details |
|-------|---------|
| **Date** | 2026-03-6 |
| **Tool Used** | Claude AI |
| **Feature** | `Admindashboardpage.html`, `AdminLoginPage.html` — Admin dark theme + unified navbar |
| **Prompt Used** | *"Create Admindashboardpage and Admin login page elements. Build a dark sidebar theme specifically for the admin panel. Renew the navbar to be consistent across every admin part. Integrate FR-11, FR-12, FR-13 requirements into a dedicated Statistics & Reports page."* |
| **What Was Accepted** | CSS variable theming (dark mode) scoped specifically to the `/admin` route wrapper to keep it visually distinct from the user dashboard |
| **What Was Rejected** | Duplicating navbar HTML across pages — abstracted the renewed navbar into a single reusable component |
| **Verification Method** | ✅ Admin theme renders dark layout cleanly across all admin pages. ✅ Navigation transitions between Admin Dashboard and Reports without layout shift. ✅ Admin and user panels remain visually distinct |

---

### AI-008 — Advanced Admin PDF Reports Export

| Field | Details |
|-------|---------|
| **Date** | 2026-03-7 |
| **Tool Used** | Claude AI |
| **Feature** | `Adminreportspage.html` — Full A4 PDF export with jsPDF |
| **Prompt Used** | *"Implement Export PDF feature on the admin report page using jsPDF via cdnjs. Programmatically build a proper A4 PDF containing: Red cover page (period label + generation date), 5 KPI summary boxes, stacked vector bar chart (type per time slot), type breakdown table (counts, share %, revenue), green revenue line chart with area fill, revenue by type table, top routes list, period summary boxes. Add page numbers and 'CONFIDENTIAL' footer to every page, with clean auto-pagination for overflowing sections."* |
| **What Was Accepted** | jsPDF with the `autoTable` plugin to handle clean overflow of type breakdown and revenue tables across multiple pages |
| **What Was Rejected** | Screenshotting HTML canvas using `HTML2Canvas` for charts — opted to draw vector charts natively in jsPDF for crisp A4 printing |
| **Verification Method** | ✅ PDF exports instantly with a styled red cover page. ✅ Tables overflow to page 2 without cutting off any text. ✅ `CONFIDENTIAL` footer and page numbers appear on every page |

---

### AI-009 — Database Schema & Normalization

| Field | Details |
|-------|---------|
| **Date** | 2026-03-9 |
| **Tool Used** | PostgreSQL / Claude AI |
| **Feature** | Database schema — Users, Shipments, TrackingEvents, Payments tables |
| **Prompt Used** | *"Design a relational schema for the Post Office app. Include Users (with KYC fields), Shipments (linked to Sender/Receiver), Tracking Events (one-to-many with Shipments), and Payments. Use UUIDs for public-facing IDs and optimized indexes for tracking numbers like 'TH-2024-0089'."* |
| **What Was Accepted** | A `JSONB` column for Package Details (dimensions, fragile flags) to allow flexibility without altering the table structure for every new package type |
| **What Was Rejected** | Storing generated PDF labels directly in the DB as BLOBs — opted to store only metadata and generate on-the-fly to keep DB size lean |
| **Verification Method** | ✅ Schema supports 10ms lookups for tracking IDs via optimized indexes. ✅ ERD reviewed to confirm no orphaned tracking events occur when a shipment is deleted (cascading delete confirmed) |

---

### AI-010 — Authentication API & Password Security

| Field | Details |
|-------|---------|
| **Date** | 2026-03-9 |
| **Tool Used** | Node.js (Express) / Bcrypt |
| **Feature** | `POST /auth/register`, `POST /auth/login` — JWT authentication endpoints |
| **Prompt Used** | *"Create the /auth/register and /auth/login endpoints. Implement Bcrypt hashing for passwords. Step 3 of registration must validate password strength and confirm identity match before saving to the Users table. Issue a JWT (JSON Web Token) upon successful login for the User Dashboard."* |
| **What Was Accepted** | JWT with 24h expiry; refresh token stored in an HTTP-only cookie for better security against XSS attacks |
| **What Was Rejected** | Simple MD5 hashing — insecure; replaced with Bcrypt using a salt round of 10 |
| **Verification Method** | ✅ Postman test: login with incorrect password returns `401 Unauthorized`. ✅ Postman test: valid credentials return a JWT token and grant access to the protected Dashboard route. ✅ DB inspected to confirm passwords are stored as Bcrypt hashes, not plaintext |

---

### AI-011 — KYC File Upload & Logic

| Field | Details |
|-------|---------|
| **Date** | 2026-03-9 |
| **Tool Used** | Multer / AWS S3 |
| **Feature** | KYC upload backend — `national_id` and `selfie_holding_id` file handling |
| **Prompt Used** | *"Develop the backend logic for Entry 3's KYC flow. Handle two file uploads: national_id and selfie_holding_id. Save file paths to the user_profiles table and set kyc_status to 'pending'. Add a middleware to check if a user is 'verified' before allowing them to 'Create Shipment'."* |
| **What Was Accepted** | Using Multer to rename files with a timestamp prefix to prevent name collisions in storage |
| **What Was Rejected** | Storing images in the local `/uploads` folder — migrated to AWS S3 cloud storage for scalability and data persistence |
| **Verification Method** | ✅ Uploading a 5MB image successfully populates the `id_photo_url` field in the database. ✅ User Dashboard displays the "Pending Verification" badge after upload. ✅ Attempting to access Create Shipment without `kyc_status = verified` is correctly blocked |

---

### AI-012 — Real-time Tracking & Mock API

| Field | Details |
|-------|---------|
| **Date** | 2026-03-10 |
| **Tool Used** | Express / Sequelize |
| **Feature** | `GET /tracking/:id` — Live tracking endpoint with seed data |
| **Prompt Used** | *"Build the /tracking/:id GET endpoint. It must join the Shipments table with the TrackingEvents table to return a full timeline. Create a 'Seed' script that populates the 4 test cases (TH-2024-0089, etc.) with different statuses (In Transit, Delivered, etc.) for demo purposes."* |
| **What Was Accepted** | Auto-Update Trigger that adds a new "Processing" event to the `tracking_history` table as soon as a shipment is created |
| **What Was Rejected** | Long-polling for tracking updates — kept standard REST since shipment status does not change frequently enough to require it |
| **Verification Method** | ✅ Typing `TH-2024-0089` in the frontend tracking widget pulls real data from the SQL table instead of the hardcoded mock. ✅ All 4 seeded test cases return correct status timelines via the API |

---

### AI-013 — Admin Analytics & Reporting Engine

| Field | Details |
|-------|---------|
| **Date** | 2026-03-10 |
| **Tool Used** | SQL Aggregations / PDF Engine |
| **Feature** | `GET /admin/reports` — Analytics endpoint feeding the Entry 8 PDF export |
| **Prompt Used** | *"Create an /admin/reports endpoint. Write a complex SQL query to calculate: total revenue by month, shipment volume by service level (Express vs Standard), and top 5 most frequent routes. This data will feed the Entry 8 PDF export."* |
| **What Was Accepted** | Created a Database View (`v_admin_stats`) to pre-calculate these values, significantly speeding up load time for the Admin Dashboard |
| **What Was Rejected** | Calculating totals in Node.js on the frontend — moved all aggregation logic to SQL for better performance with large datasets |
| **Verification Method** | ✅ Admin Statistics page renders charts for 6-month activity history using real database sums rather than placeholder numbers. ✅ Query execution time confirmed faster with `v_admin_stats` view than inline aggregation |

---

## ✅ Verification Methods Reference

| Method | Example |
|--------|---------|
| **Manual code review** | Read generated code line by line to check logic |
| **Running tests** | `npm test` or `pytest` — include pass/fail result |
| **Static analysis** | ESLint, Pylint — note any warnings found |
| **Postman / API testing** | Sent request, checked response status and body |
| **Browser testing** | Opened page, confirmed UI behaviour visually |
| **DB inspection** | Checked records using DB Browser or CLI |
| **Example input validation** | Entered known input, confirmed expected output |
| **Peer review** | Another team member checked the accepted output |

---
 
