# NeuroTwin - Smart Student Productivity Tracker

NeuroTwin is a web application that helps university students log and track their daily habits (study time, sleep, screen time, physical activity) to monitor productivity and well-being.

## Project Structure
- `/client` - React Frontend Application
- `/server` - Node.js + Express Backend API
- `database.sql` - MySQL Database structure queries

## Windows Setup Instructions

### Prerequisites
1. **VS Code**: Recommended code editor.
2. **Node.js**: Download and install the Windows installer from [nodejs.org](https://nodejs.org/).
3. **MySQL Server**: Install MySQL server from [mysql.com](https://dev.mysql.com/downloads/installer/). Write down the `root` password you create during setup.

### Step 1: Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or MySQL Command Line).
2. Log in with your `root` password.
3. Open the file `database.sql` from this project folder.
4. Run all the SQL queries inside `database.sql` to create the `neurotwin` database and tables.

### Step 2: Backend Setup
1. Open **VS Code**.
2. Go to **File > Open Folder** and select the `neurotwin` project folder.
3. Open a new terminal in VS Code (**Terminal > New Terminal**).
4. Navigate to the server folder:
   ```cmd
   cd server
   ```
5. Install the required Node.js libraries:
   ```cmd
   npm install
   ```
6. Open `server/.env` and update the database password if it is different from empty:
   ```env
   DB_PASSWORD=your_mysql_root_password_here
   ```
7. Start the backend server:
   ```cmd
   npm run dev
   ```
   *You should see a message saying "Successfully connected to MySQL database" and "Server running on port 5000".*

### Step 3: Frontend Setup
1. Open **another** new terminal in VS Code (**Terminal > Split Terminal** or **Terminal > New Terminal**).
2. Navigate to the client folder from the root project folder:
   ```cmd
   cd client
   ```
3. Install the required React Node.js libraries:
   ```cmd
   npm install
   ```
4. Start the React development server:
   ```cmd
   npm start
   ```
   *A new browser window should automatically open pointing to `http://localhost:3000` showing the NeuroTwin app!*

### Usage Flow
1. Go to `http://localhost:3000/register` to create a new student account.
2. Log in with your new credentials.
3. Once on the Dashboard, navigate to **Daily Input** on the left menu.
4. Use the sliders to enter your daily study hours, sleep, screen time, and physical activity, then click **Save**.
5. Return to the **Dashboard** to see your Readiness Score and updated statistics!
