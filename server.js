const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err=>{
  console.log("UNCAUGHT EXEPTION!!! Shutting down...")
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);
mongoose.connect(DB).then((con) => {
  console.log("DB connection succesful");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}.....`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!! Shutting down...")
  console.log(err.name, err.message)
  server.close(()=>{
    process.exit(1)
  })
});




