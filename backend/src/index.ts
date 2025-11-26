import mongoose from "mongoose";
import App from "./App";
import config from "./config";

mongoose
  .connect(config.mongodbURI)
  .then(() => {
    const app = new App();

    app.listen();
  })
  .catch((err) => {
    console.log(err);
  });
