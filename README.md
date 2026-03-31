# Do — Task List

A clean and modern full-stack task management app built with **Spring Boot**, **Thymeleaf**, **JavaScript**, and **CSS**.

This project combines a polished frontend experience with a structured backend architecture for creating, viewing, updating, and deleting tasks. It is designed to keep task management simple, elegant, and responsive.

## Features

- Create tasks with:
  - title
  - description
  - priority level
- View all tasks instantly
- Update task priority dynamically
- Delete tasks with smooth UI feedback
- Light and dark theme toggle
- Toast notifications for actions
- Skeleton loading states
- Spring Boot backend with RESTful endpoints
- Thymeleaf-powered UI integration

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Frontend
- Thymeleaf
- HTML
- CSS
- JavaScript

### Database
- MySQL

## Project Structure

```bash
src/
├── main/
│   ├── java/com/todo/list/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── service/
│   │   └── TodolistApplication.java
│   │
│   └── resources/
│       ├── static/
│       │   ├── styles.css
│       │   └── script.js
│       ├── templates/
│       │   └── index.html
│       └── application.properties
```
API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
GET	/tasks/{id}	Get task by ID
POST	/tasks	Create a new task
PUT	/tasks/{id}	Update an existing task
DELETE	/tasks/{id}	Delete a task
How to Run
1. Clone the repository
git clone https://github.com/Tanjiro5834/todolist-springboot-app.git
cd todolist-springboot-app
2. Configure the database

Update your application.properties with your MySQL credentials:

spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
3. Run the application

Using Maven Wrapper:

./mvnw spring-boot:run

On Windows:

mvnw.cmd spring-boot:run
4. Open in browser
http://localhost:8080/
UI Preview

A minimal and elegant task list interface focused on usability, speed, and clean interaction.

Future Improvements
Mark task as completed
Filter tasks by priority
Search tasks
Authentication and user-specific task lists
Due dates and deadlines
Drag-and-drop sorting
Pagination or lazy loading
Why This Project?

This project was built to practice and demonstrate:

full-stack Spring Boot development
REST API integration with a server-rendered frontend
clean service and controller layering
practical CRUD architecture
modern UI behavior without overengineering the stack
Author

Nathaniel Coronacion
Software Engineer / Backend Developer

License

This project is for educational and portfolio purposes.
