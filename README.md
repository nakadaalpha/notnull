# 🚘 notnull — Premium Car Marketplace Web App

**notnull** is a modern web application built with PHP for managing the buying and selling of **premium cars**, both **new and pre-owned**. It is designed to streamline transactions and administrative tasks with a clean dashboard and full CRUD functionality.

## 🌟 Features

- 🔐 **User Authentication**  
  Secure login system for both admin and customers.

- 🧾 **CRUD Management**  
  - **Cars**: Add, update, delete, and view car listings.  
  - **Admins**: Manage admin users.  
  - **Customers**: Maintain customer records.  
  - **Transactions**: Track and manage all sales records.

- 📊 **Admin Dashboard**  
  Real-time overview of data and analytics related to transactions and inventory.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nakadaalpha/notnull.git
cd notnull
```

### 2. Install Dependencies

Make sure you have [Composer](https://getcomposer.org/) installed, then run:

```bash
composer install
```

### 3. Environment Setup

- Copy `.env.example` to `.env` and update the configuration as needed:
  ```bash
  cp .env.example .env
  ```
- Configure your database credentials and other settings in the `.env` file.

### 4. Set Directory Permissions

Ensure proper write access for:
- `storage/`
- `bootstrap/cache/`

### 5. Database Migration (if applicable)

```bash
php artisan migrate
```

### 6. Run the Development Server

```bash
php artisan serve
```

Access the app at: [http://localhost:8000](http://localhost:8000)

---

## 🗂 Project Structure

```
notnull/
├── application/         # App logic (Models, Controllers, Views)
├── public/              # Public-facing root directory
├── system/              # Core system/framework files
├── .env                 # Environment configuration
├── composer.json        # Dependency manager config
└── index.php            # Entry point
```

---

## 🤝 Contributing

Contributions are welcome!  
To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Submit a pull request 🚀

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 📬 Contact

Built with ❤️ by [@nakadaalpha](https://github.com/nakadaalpha)  
For inquiries or collaboration, feel free to reach out!
