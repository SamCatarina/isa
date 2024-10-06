import express from "express";
import userRoutes from "./routes/rotas.js";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});