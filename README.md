# Money Leaves, a Budget Manager Web Application

[![Docker](https://img.shields.io/badge/docker-20.10.8-blue?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-14.17.0-green?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.17.1-black?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Vue.js](https://img.shields.io/badge/Vue-3.5.3-brightgreen?style=flat&logo=vue&logoColor=white)](https://vuejs.org/)
[![Bootstrap](https://img.shields.io/badge/bootstrap-5.1.3-purple?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-4.4.6-green?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)


This web application was developed as a project for the Web Programming course. It serves as a budget manager that allows trusted registered users to add expenses, share them with other users, and view a balance of credits and debits.

## Overview

Money Leaves is a web application designed to help users manage and share their family and friends expenses. Users can:

- Register and authenticate using a unique username and password.
- Add new expenses with details such as date, description, category, total cost, and a list of users to share the expense with.
- View all expenses or filter them by year or month.
- Search for specific expenses or users.
- View personal and shared financial balances.

The application consists of a server-side part that handles data storage, authentication, and authorization, and a client-side part that provides the user interface to interact with the data. 

## Features

- **Personal Balance View**: A summary of the user's financial situation, showing the difference between income and expenses with respect to other users.
- **User-Specific Balance View**: Allows a user to view detailed expenses shared with another user.
- **Add New Expense**: Users can create a new expense with fields such as date, description, category, total cost, and a list of users to share with. Each user will have a specific share of the expense.
- **Expense Search**: Users can search their expenses using partial matches across multiple fields.
- **User Search**: Users can search for other users to view their balance with them, using similar partial match principles.
- **REST API**: Provides a RESTful API interface for all application operations, such as user registration, login, and CRUD operations for expenses.

## REST API Endpoints

The application provides a REST API with the following endpoints:

| Method | API Endpoint                     | Description                                                        |
|--------|-----------------------------------|--------------------------------------------------------------------|
| POST   | `/api/auth/signup`                | Register a new user                                                |
| POST   | `/api/auth/signin`                | User login                                                         |
| POST   | `/api/auth/signout`               | User signout                                                       |
| GET    | `/api/budget/`                    | Retrieve expenses of the logged-in user                            |
| GET    | `/api/budget/:year`               | Retrieve expenses of the logged-in user for the specified year     |
| GET    | `/api/budget/:year/:month`        | Retrieve expenses of the logged-in user for the specified month    |
| GET    | `/api/budget/:year/:month/:id`    | Retrieve details of a specific expense                             |
| POST   | `/api/budget/:year/:month`        | Add a new expense for a specific month                             |
| PUT    | `/api/budget/:year/:month/:id`    | Update an existing expense                                         |
| DELETE | `/api/budget/:year/:month/:id`    | Delete an existing expense                                         |
| GET    | `/api/balance`                    | Retrieve the credit/debit summary of the logged-in user            |
| GET    | `/api/balance/:id`                | Retrieve the balance between the logged-in user and another user   |
| GET    | `/api/budget/search?q=query`      | Search for an expense that matches the query string                |
| GET    | `/api/budget/whoami`              | If authenticated, returns information about the logged-in user     |
| GET    | `/api/users/search?q=query`       | Search for a user that matches the query string                    |

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- **Docker**: Install Docker from [here](https://www.docker.com/).
- **Node.js**: Install Node.js from [here](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/family-budget-manager.git
   cd family-budget-manager
   ```
2. Build and run the Docker containers:

    ```bash
    docker-compose up --build
    ```
3. The application should now be running on `http://localhost:3000.`

### Usage
1. Open a browser and navigate to http://localhost:3000.
2. Register a new user and log in. Alternatively, after running the application for the first time, the database is created and populated with some demo data. To view this data, log in with the credentials `Ale` `passwordA`
3. Start managing and sharing your expenses!
