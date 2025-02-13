# Numismatic - Online Coin Shop

📜 Overview
Numismatic is an online shop platform where collectors and enthusiasts can explore and purchase coins with numismatic value dated after the 1700s. The application allows the owner of the store to list their coins with details and manage their inventory efficiently. The platform aims to provide a smooth and secure shopping experience.

🛠️ Technologies Used

### Frontend
- **React** (with Hooks for state management and lifecycle management)
- **Redux** (for centralized state management)
- **Axios** (for handling API requests)

### Backend
- **Node.js** (JavaScript runtime environment)
- **Express.js** (Web framework for Node.js)

### Database
- **PostgreSQL** (Relational database for storing coins and user information)

### Additional Tools
- **React Router** (for client-side routing)
- **JWT (JSON Web Tokens)** (for secure user authentication)
- **Local Storage** (for persisting authentication tokens)

---

💂️ Project Structure

```
📁 public/
📁 src/
  ┓ 📁 components/         # Reusable components
  ┓ 📁 hooks/              # Custom hooks (e.g., useApiRequest)
  ┓ 📁 pages/              # Page-level components
  ┓ 📁 services/           # API service functions
  ┓ 📁 styles/             # CSS styles for the whole webapp
  ┓ 💜 App.js              # Main React component
  ┓ 💜 App.css             # Global styles
  ┓ 💜 index.js            # ReactDOM render entry point
  ┓ 💜 index.css           # Global CSS
```

---

🚀 Features
- **Coin Listings:** Display detailed information about coins with numismatic value.
- **Search and Filter:** Find specific coins based on year, origin, or value.
- **Authentication:** Secure user login and registration using JWT.
- **CRUD Operations:** Add, edit, and delete coin listings.
- **Responsive Design:** Optimized for both desktop and mobile views.

---

🌟 Contribution Guide
- Fork the repository.
- Create a new branch for your feature (`git checkout -b feature/your-feature`).
- Commit your changes (`git commit -m "Added a new feature"`).
- Push to your fork (`git push origin feature/your-feature`).
- Create a pull request to the `main` branch.

---

📜 License
This project is licensed under the [MIT License](LICENSE).
---

💬 Contact
- Project Maintainer: [Your Name](https://github.com/your-username)
- Email: your-email@example.com
- GitHub Repository: [Numismatic](https://github.com/your-username/numismatic)
