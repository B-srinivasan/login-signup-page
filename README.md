Login Page
Purpose: The login page allows registered users to securely access their accounts by entering their credentials.

Features:
A simple and responsive design for ease of use.
Fields for username and password input.
Client-side validation ensures that both fields are filled before submission.
On successful login, users receive a confirmation message, and a session token is generated for secure access to protected resources.

Signup Page
Purpose: The signup page enables new users to register for an account by providing their details.

Features:
Fields for username, createpassword, and password input.
Client-side validation ensures all fields are filled correctly before submission.
On successful signup, the user is added to the database, and a confirmation message is displayed.
Prevention of duplicate registrations with the same email address, ensuring unique user accounts.

Technologies Used

Frontend:
HTML/CSS: For designing a clean and modern user interface.
JavaScript: For client-side form handling and API communication.

Backend:
Node.js: To handle server-side logic and routing.
Express.js: For creating RESTful APIs to manage login and signup requests.

Database:
MongoDB: To securely store user information.
