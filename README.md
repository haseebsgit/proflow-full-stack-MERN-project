\# 🚀 ProFlow - Project Management Tool



ProFlow is a modern, Full Stack Project Management application built with the MERN stack. It features secure authentication, team management, and a fully interactive \*\*Drag-and-Drop Kanban Board\*\* to manage tasks efficiently.



\## 🌟 Features



\* \*\*🔐 User Authentication:\*\* Secure Login and Registration using JSON Web Tokens (JWT).

\* \*\*📊 Dashboard:\*\* View all projects and teams at a glance.

\* \*\*📂 Project Management:\*\* Create and organize projects within teams.

\* \*\*✅ Task Management:\*\* Create tasks with priorities (High, Medium, Low).

\* \*\*🖱️ Drag \& Drop Kanban Board:\*\* Move tasks between "To Do", "In Progress", and "Done" columns using `@hello-pangea/dnd`.

\* \*\*🎨 Responsive UI:\*\* Built with \*\*React\*\* and styled with \*\*Tailwind CSS\*\*.



---



\## 🛠️ Tech Stack



\*\*Frontend:\*\*

\* React.js (Vite)

\* Tailwind CSS

\* React Router DOM

\* @hello-pangea/dnd (Drag and Drop)

\* Axios



\*\*Backend:\*\*

\* Node.js

\* Express.js

\* MongoDB (Mongoose)

\* JSON Web Token (JWT) for Auth



---



\## ⚙️ Installation \& Setup



Follow these steps to run the project locally on your machine.



\### 1. Clone the Repository

```bash

git clone \[https://github.com/haseebsgit/proflow-full-stack-MERN-project.git](https://github.com/haseebsgit/proflow-full-stack-MERN-project.git)

cd proflow-full-stack-MERN-project

2\. Backend Setup

Navigate to the server folder and install dependencies:



Bash



cd server

npm install

Create a .env file in the server folder and add the following:



Code snippet



PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/proflowdb

JWT\_SECRET=your\_super\_secret\_key\_123

Start the backend server:



Bash



npm run dev

(You should see "MongoDB Connected" in the terminal)



3\. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies:



Bash



cd client

npm install

Start the React development server:



Bash



npm run dev



4\. Access the App

Open your browser and visit: http://localhost:5173



Method,Endpoint,Description

POST,/api/auth/register,Register a new user

POST,/api/auth/login,Login user \& get Token

GET,/api/teams,Get user's teams

POST,/api/projects,Create a new project

GET,/api/projects/:id,Get project details

POST,/api/tasks,Create a new task

PUT,/api/tasks/:id,Update task status (Drag \& Drop)



🚀 Future Improvements

\[ ] Add "Delete" functionality for tasks and projects.



\[ ] Add User Profile page with Avatar upload.



\[ ] Real-time updates using Socket.io.



\[ ] Invite members to teams via email.



👤 Author

Haseeb Farooq



GitHub: haseebsgit

