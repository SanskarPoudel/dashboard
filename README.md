# Project Setup Guide

This guide provides detailed instructions to set up and run the project on your local machine.

## Prerequisites

Ensure the following tools are installed on your system:

- MySQL Server (Version 8.0.36 or later)
- Node.js
- npm

## Database Setup

1. **Install MySQL Server**: Download and install MySQL Server from the [official MySQL website](https://dev.mysql.com/downloads/mysql/). Remember your MySQL root username and password.

2. **Create Database**:

   - Open MySQL command line tool and login as root.
   - Execute `CREATE DATABASE testdb;` to create your database.

3. **Import Database Schema**:
   - Navigate to where your `database.sql` file is located.
   - Import it to `testdb` using:
     ```bash
     mysql -u yourusername -p testdb < path/to/database.sql
     ```
     Replace `yourusername` with your actual MySQL username.

## Backend Setup

## Backend Environment Setup

1. **Navigate to Backend Directory**: Open your terminal and navigate to the `Backend` directory of the project:

   ```bash
   cd Backend
   ```

2. **Update Database Credentials**: Locate the `.env` file in the `Backend` directory. Then, update it with your MySQL database credentials. The default credentials are :

   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_DATABASE=testdb
   ```

   Adjust `DB_USER`, `DB_PASSWORD`, and `DB_NAME` according to your MySQL setup.

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Start Server**:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:8000`.

## Frontend Setup

1. **Navigate to Frontend**:

   ```bash
   cd Frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Launch Application**:
   ```bash
   npm run dev
   ```
   Access it at `http://localhost:3000`.

## Accessing the Application

- **Login Page**: Open `http://localhost:3000` to reach the login/signup page.

- **Default Login Credentials**:
  - Admin Access:
    - Email: `admin@example.com`
    - Password: `admin_password`
  - User Access:
    - Email: `test@gmail.com`
    - Password: `test123`

Use these credentials to log in and explore the functionalities provided in the dashboard. And you can further signup, create accounts and test other operations.
