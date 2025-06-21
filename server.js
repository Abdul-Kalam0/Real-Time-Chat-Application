const server = require("./index");
require("dotenv").config();
const connectDb = require("./src/config/db");

const PORT = process.env.config || 5001;
connectDb();

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
