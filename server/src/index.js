import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mangaRoutes from "./routes/mangaRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/manga", mangaRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
