import express from "express";
import mailRoutes from "./routes/mail.routes";

const app = express();

app.use(express.json());
app.use("/api/mail", mailRoutes);

export default app;
