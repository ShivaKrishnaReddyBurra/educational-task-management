## 📚 **Educational Task Management System**

The **Educational Task Management System** is a robust, collaborative platform designed to streamline task management and tracking between tutors and students. Built with a Spring Boot backend and a Next.js frontend, it provides an organized interface for creating, assigning, and monitoring tasks, ensuring efficient task completion, performance evaluation, and user interaction through features like calendars, settings, and real-time statistics.

---

## 🚀 **Features**

### **For Tutors**
- **Task Management**:
  - Create and assign tasks to students with titles, descriptions, subjects, and deadlines.
  - Update or delete tasks as needed.
  - View all tasks created and filter by student or status.
- **Progress Tracking**:
  - Monitor task completion rates and student progress over time (weekly, monthly, etc.).
  - Generate detailed statistics on task completion, subject performance, grade distribution, and submission timelines.
- **Calendar**:
  - Visualize tasks on a monthly calendar with highlighted deadlines.
  - Navigate between months to plan and review schedules.
- **Settings**:
  - Update account details (name, email, username, password) and notification preferences.

### **For Students**
- **Task Management**:
  - View tasks assigned by tutors with deadlines and details.
  - Submit progress reports with percentage completion.
  - Track task status (Pending, In Progress, Completed).
- **Calendar**:
  - See upcoming task deadlines on a dynamic calendar.
  - Receive a list of upcoming events/tasks for the next 30 days.
- **Settings**:
  - Manage personal account information and notification preferences (e.g., email notifications, task reminders).

### **General Features**
- **Real-Time Updates**: Task statuses and progress sync instantly across users.
- **Automatic Deadline Enforcement**: Overdue tasks are flagged automatically.
- **User Authentication**: Secure login with role-based access (Tutor/Student).
- **Statistics**: Comprehensive analytics for tutors to evaluate student performance.
- **Responsive Design**: Accessible on desktop and mobile devices via the Next.js frontend.

---

## 📦 **Installation**

### **Prerequisites**
- **Java 17+** (for Spring Boot backend)
- **Node.js 18+** and **npm** (for Next.js frontend)
- **MySQL/PostgreSQL** (or any JPA-supported database)
- **Git** (for cloning the repository)

### **Steps**

1. **Clone the Repository**:
```bash
git clone https://github.com/shivakrishnareddyburra/educational-task-management.git
cd educational-task-management
```

2. **Backend Setup**:
   - Navigate to the backend directory (assumed as `backend/taskmanagement`):
```bash
cd backend/taskmanagement
```
   - Configure the database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagement_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
   - Install dependencies and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```
   - The backend will be available at `http://localhost:8080`.

3. **Frontend Setup**:
   - Navigate to the frontend directory (assumed as `frontend`):
```bash
cd ../../frontend
```
   - Install dependencies:
```bash
npm install
```
   - Create a `.env.local` file to set the backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
   - Start the development server:
```bash
npm run dev
```
   - The frontend will be available at `http://localhost:3000`.

---

## 🚦 **Usage**

### **Initial Setup**
1. **Database Initialization**:
   - Ensure the database is running and configured.
   - The backend will create tables automatically (`spring.jpa.hibernate.ddl-auto=update`).

2. **Sign Up / Log In**:
   - Register as a tutor or student via the frontend (assuming an auth endpoint exists; if not, seed users manually in the DB).
   - Example credentials (seed manually if no signup endpoint):
     - **Tutor**: `email: "john@example.com"`, `password: "password123"`, `role: "TUTOR"`
     - **Student**: `email: "jane@example.com"`, `password: "password123"`, `role: "STUDENT"`

### **For Tutors**
1. **Task Management**:
   - Navigate to `/tasks`.
   - Create tasks by specifying title, description, subject, deadline, and assignees.
   - Assign tasks to students and monitor progress via the task list.
2. **Statistics**:
   - Go to `/statistics` to view completion rates, subject performance, grade distribution, and submission timelines.
   - Filter by student, subject, or time period (daily, weekly, monthly, yearly).
3. **Calendar**:
   - Visit `/calendar` to see task deadlines on a monthly grid.
   - Use navigation buttons to switch months and view upcoming events.
4. **Settings**:
   - Access `/settings` to update name, email, username, password, and notification preferences.

### **For Students**
1. **Task Management**:
   - Navigate to `/tasks` to view assigned tasks.
   - Submit progress updates (e.g., percentage complete) for each task.
   - Track status (Pending, In Progress, Completed) on the dashboard.
2. **Calendar**:
   - Check `/calendar` for upcoming deadlines and events.
   - Review tasks due within the next 30 days in the sidebar.
3. **Settings**:
   - Go to `/settings` to edit personal details and toggle notification preferences.

---

## 🛠️ **Development Details**

### **Backend**
- **Framework**: Spring Boot
- **Language**: Java 17
- **Database**: MySQL/PostgreSQL (configurable via JPA)
- **Key Endpoints**:
  - `/api/tasks`: CRUD operations for tasks.
  - `/api/users`: User management (get by role, update settings).
  - `/api/calendar`: Calendar data (tasks by month, upcoming events).
  - `/api/statistics`: Task completion and performance analytics.

### **Frontend**
- **Framework**: Next.js
- **Language**: JavaScript (React)
- **UI Library**: Tailwind CSS with custom components (e.g., `ui/button`, `ui/card`).
- **Key Pages**:
  - `/tasks`: Task creation and tracking.
  - `/calendar`: Monthly task overview.
  - `/settings`: User account and preferences management.
  - `/statistics`: Tutor-facing analytics (optional for students).

---

## 📝 **Contributing**
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

---

## 🙌 **Acknowledgments**
- Built with ❤️ together by:
  - Shiva Krishna Reddy Burra
  - Gummadi Nithin
  - Sathwika Janagam
- Enhanced with assistance from AI-assisted development tools.

---
