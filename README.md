# Candidate Loader

Candidate Loader is a full-stack web application to simplify the process of uploading, validating, and managing candidate information using Excel files. The backend is built with NestJS, and the frontend uses Angular 19.

## Features

- Upload candidate data from an Excel file.
- Validate and parse Excel data on the backend.
- Display and manage candidates in a table on the frontend.
- Persist candidate data using local storage.

## Technologies Used

### Backend

- **NestJS**: Framework for building scalable server-side applications.
- **ExcelJS**: Library for parsing and working with Excel files.

### Frontend

- **Angular 19**: Framework for building dynamic web applications.
- **Angular Material**: UI components for building responsive and accessible designs.

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Clone the Repository

```bash
git clone https://github.com/jbmc99/candidate-loader
cd candidate-loader
```

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend/nestjs-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run start
   ```
   The backend will run on `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   ng serve
   ```
   The frontend will run on `http://localhost:4200`.

---

## Usage

1. Open the frontend in your browser at `http://localhost:4200`.
2. Upload an Excel file containing candidate data.
3. View and manage the candidate list.

---

## Excel File Format

The Excel file must contain the following columns:

- **Seniority**: The seniority level of the candidate (e.g., Junior, Mid, Senior).
- **Years of Experience**: The number of years of experience.
- **Availability**: A boolean value indicating availability.

Example:

| Seniority | Years of Experience | Availability |
| --------- | ------------------- | ------------ |
| Senior    | 5                   | true         |

---

## Project Structure

### Backend

- **`src/main.ts`**: Entry point for the backend application. Configures CORS and starts the server on port 3000.
- **`src/candidate/candidate.controller.ts`**: Handles file uploads, Excel parsing, and validation.

### Frontend

- **`src/app/app.component.ts`**: Main component for managing the candidate list.
- **`src/app/services/candidate.service.ts`**: Service for communicating with the backend.

---

## Testing

### Backend

The backend tests are written using **Jest**. Run the tests with:

```bash
cd backend/nestjs-backend
npm run test
```

### Frontend

The frontend tests are written using **Karma**. Run the tests with:
Run frontend tests:

```bash
cd frontend
ng test
```
