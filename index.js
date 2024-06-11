import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import UserRoutes from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

(async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => console.log(`DB HOST :: ${conn.connection.host}`))
    .catch((err) => console.log(`Error while connecting db :: ${err}`));
})();

app.use("/api/v1/user", UserRoutes);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
