require("dotenv").config();
const express = require("express");
const validateRules = require("./routes/route");
const PORT = process.env.PORT || 5500

//initiate server
const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Validation-Rule Api",
    status: "success",
    data: {
      name: process.env.Name,
      github: process.env.Github,
      email: process.env.Email,
      mobile: process.env.Mobile,
      twitter: process.env.Twitter
  }
})
});

app.use("/validate-rule", validateRules);

app.listen(
  PORT,
  console.log(`server running on port: ${PORT}`)
);
