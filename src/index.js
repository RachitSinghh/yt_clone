import { app } from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8000;

console.log(`listening to ${PORT}`);

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

/*
import express from "epxress";

const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("error", error);
    throw nerror;
  }
})();
*/
