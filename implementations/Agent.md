# Post Office Management System – Development Guide

## Project Overview
This project is a web-based Post Office Management System that allows staff and customers to manage parcels, tracking, and payments.

## Technology Stack
Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL

Architecture:
- REST API
- MVC Pattern
- Client–Server architecture

## System Modules

1. Authentication
- Staff login
- Role management

2. Customer Management
- Create customer
- Update customer
- View customer profile

3. Parcel Management
- Create parcel shipment
- Generate tracking number
- Update parcel status
- View parcel history

4. Tracking System
- Search parcel by tracking number

5. Payment System
- Credit card
- QR PromptPay
- E-wallet

6. Notification System
- Send notification when parcel status changes

## Folder Structure

backend/
- routes
- controllers
- models
- config

frontend/
- pages
- css
- js

## Database
PostgreSQL is used as the primary database.

Main tables:
- customers
- staff
- parcels
- payments
- tracking_history

## Development Guidelines

- Use MVC architecture for backend.
- API endpoints should start with `/api`.
- All database queries should use parameterized queries.
- Use async/await for database operations.
- Frontend should call backend through REST API.

## Example API

GET /api/parcels  
POST /api/parcels  
GET /api/parcels/:trackingNumber  

## Goal

Build a complete Post Office Management System with clean architecture and modular design.