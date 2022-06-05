const dotenv = require('dotenv');
const app=require("./app");

const http=require("http");

dotenv.config()

const PORT = process.env.PORT|| 5000;
app.set("PORT",PORT)
const server=http.createServer(app)
server.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}...`))
// this is hazem 