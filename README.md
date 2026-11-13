# Result Portal

This is a Result Portal for schools, that allows schools to upload results online and students to view their results.

## Technology Stack

The following technologies have been used to develop this application:

-   HTML, CSS, and JavaScript for front-end development
-   Node.js 20.19+ for server-side development
-   Express as the backend framework
-   MongoDB with Mongoose as the database layer
-   EJS as the view engine
-   read-excel-file for reading uploaded result spreadsheets
-   Bootstrap as the CSS framework

## Features

-   Schools can upload student results online
-   Students can view their results
-   User-friendly interface for easy navigation

## Getting Started

To get started with the Result Portal, follow the instructions below:

1. Clone the repository by running the following command in your terminal:

```
git clone https://github.com/mohammadashphak/result-portal.git
```

2. Install the required dependencies by running the following command in the project folder:

```
pnpm install
```

(or `npm install` if you are not using pnpm)

3. Create a `.env` file with your MongoDB connection string and upload password:

```
DATABASE_URL=mongodb://127.0.0.1:27017/result_website
PASSWORD=your-upload-password
```

4. Start the development server by running the following command:

```
pnpm run dev
```

5. Access the application by navigating to `http://localhost:3000` in your browser.

## Contribution

We welcome contributions to the Result Portal. If you have any ideas or suggestions, feel free to create a pull request.
