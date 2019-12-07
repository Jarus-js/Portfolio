//npm packages
const express = require("express");
const mongoose = require("mongoose");

//importing file
const url = require("./config/keys");

//initializing app
const app = express();

//Db setup
mongoose.connect(
  url.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Connected to db..");
  }
);

//APP setup
app.get('/',(req,res)=>{
  res.json({msg:'Hello World Form api'})
})
//Middlewares - Incoming req to Server are passed to middleware
// parse application/x-www-form-urlencoded
app.use(express.json({ extended: false }));


app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

//SERVER setup
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
