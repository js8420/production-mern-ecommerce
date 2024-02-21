import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from "url";

// Import cors
import cors from "cors";

import colors from "colors";
const { bgRed } = colors;

// Configure env
dotenv.config();

// Connect database
connectDB();

// ES Modue Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a rest object so as to create the APIs
const app = express();

// configure Morgan (i.e. middleware)
app.use(morgan("dev"));
app.use(express.json({ limit: "5000mb" })); // To pass JSON data in request and response.

app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "5000mb",
  })
);
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(express.static(path.join(__dirname, "./client/build")));

// Use cor (middleware)
app.use(cors());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// create rest APIs
// app.get("/", (request, response) => {
//   response.send("<h1>Welcome to MERN Stack E-Commerce App</h1>");
// });
app.use("*", function (request, response) {
  response.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// PORT : In the development mode, it is not a big deal to export the PORT. However, during the production mode, we do not want to expose it. In that case, we will add it in the .env file.
const PORT = process.env.PORT;

// Run listen
app.listen(PORT, () => {
  console.log(`Server is running at PORT # ${PORT}`.bgBlue.white);
});
