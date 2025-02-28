# Anonymous Grading Web Application

## Objective
Developing a web application which allows student projects to be graded by anonymous juries of colleagues.

## Description
The application allows student projects to be graded by anonymous juries of peers.

The application is built on a Single Page Application architecture and is accessible from the browser on desktop, mobile devices, or tablets.

## Functionalities

### Student
- Automatic eligibility as evaluator upon registration.
- Project registration with automatic association to a team.
- Uploading partial project deliverables.
- Adding demonstrative video links or deployed project links.
- Viewing all projects.
- Grading assigned projects anonymously if selected as a jury member.

### Professor
- Viewing teams and their members.
- Viewing projects.
- Random jury selection by providing the project ID and number of jurors (students not part of the project are selected).
- Viewing project grades (average grade calculated)

### Grading System
- Grades range between 1-10 with at most 2 fractional digits.
- Anonymous grading.
- Final grade calculated as a mean

## Technologies 🛠️
- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MySQL
- **ORM:** Sequelize

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/TECH_WEB_PROIECT_Juriu_Anonim.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd BACKEND
   npm install
   ```

3. Configure environment variables in `.env` file:
   ```env
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../FRONTEND
   npm install
   ```

6. Start the frontend server:
   ```bash
   npm start
   ```


## Permissions System
- Only jury members can add/modify their own grades.
- Modifications are allowed only for a limited period.
- Professors can only view results without identifying the jurors.

