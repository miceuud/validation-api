const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require('multer')
const route = express.Router();
const upload = multer({ dest: "uploads/" });


route.post("/", upload.single('data'),  (req, res) => {

  const file = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), req.file.path), "utf-8")
  );
  
  // required fields
  const requiredFields = ["rule", "data"];
  const requiredRuleFields = ["field", "condition", "condition_value"];
  
  // check if required fields are passed
  requiredFields.forEach((field) => {
    if (!Object.keys(file).includes(field)) {   
      return res.status(400).json({
        message: `${field} is required.`,
        status: "error",
        data: null,
      });
      // return;
    }
  });
  
  // check types for rule and data
  for (const key in file) {
    if (key == "rule") {
      if (typeof file[key] !== "object") {
        return res.status(400).json({
          message: `${key} should be an object.`,
          status: "error",
          data: null,
        });
      } else {
        requiredRuleFields.forEach((rule) => {
          if (!Object.keys(file[key]).includes(rule))
            return res.status(400).json({
              message: "Invalid JSON payload passed.",
              status: "error",
              data: null,
            });
        });
      }
    }
  
    if (typeof file[key] !== "object" && typeof file[key] !== "string")
      return res.status(400).json({
        message: `${key} should be an object.`,
        status: "error",
        data: null,
      });
  }
  /* 
  check field existance
  check if its an object && nested object
  then check if first key exist
  then check if the second key exist
  check all conditions before submitting
  */
  
  let fieldToValidate = file.rule.field.split(".");
  let result;
  let fieldName;
  let fieldValue;
  
  // check its nested for nested object
  if (fieldToValidate.length > 1 && fieldToValidate.length === 2) {
    result = Object.keys(file.data).includes(fieldToValidate[0]);
  
    if (!result) {
      fieldToValidate = fieldToValidate.join(".");
      return res.status(400).json({
        message: `field ${fieldToValidate} is missing from data.`,
        status: "error",
        data: null,
      });
    }
  
    result = Object.keys(file.data[fieldToValidate[0]]).includes(
      fieldToValidate[1]
    );
    if (!result) {
      fieldToValidate = fieldToValidate.join(".");
      return res.status(400).json({
        message: `field ${fieldToValidate} is missing from data.`,
        status: "error",
        data: null,
      });
    }
    fieldValue = file.data[fieldToValidate[0]][fieldToValidate[1]];
  } else {
    // if not nested
    result = Object.keys(file.data).includes(file.rule.field);
  
    if (!result) {
      fieldToValidate = fieldToValidate.join(".");
      return res.status(400).json({
        message: `field ${fieldToValidate} is missing from data.`,
        status: "error",
        data: null,
      });
    }
    fieldValue = file.data[fieldToValidate[0]];
  }
  
  // validate again rules for "eq"
  if (file.rule.condition === "eq") {
    if (fieldValue === file.rule.condition_value) {
       res.status(200).json({
        message: `field ${file.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    } else {
      return res.status(200).json({
        message: `field ${file.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    }
  }
  
  // validate again rules for "neq"
  if (file.rule.condition === "neq") {
    if (fieldValue !== file.rule.condition_value) {
      res.status(200).json({
        message: `field ${file.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    } else {
      return res.status(200).json({
        message: `field ${file.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    }
  }
  
  // validate again rules for "gt"
  if (file.rule.condition === "gt") {
    if (fieldValue > file.rule.condition_value) {
      res.status(200).json({
        message: `field ${file.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    } else {
      return res.status(200).json({
        message: `field ${file.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    }
  }
  
  // validate again rules for "gte"
  if (file.rule.condition === "gte") {
    if (fieldValue >= file.rule.condition_value) {
      res.status(200).json({
        message: `field ${file.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    } else {
      return res.status(200).json({
        message: `field ${file.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    }
  }
  // check this tomorrow
  if (file.rule.condition === "contains") {
    if (fieldValue.includes(file.rule.condition_value)) {
      return res.status(200).json({
        message: `field ${file.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    } else {
      res.status(200).json({
        message: `field ${file.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${file.rule.field}`,
            field_value: fieldValue,
            condition: `${file.rule.condition}`,
            condition_value: `${file.rule.condition_value}`,
          },
        },
      });
    }
  }
    

});

//  create a variable to save the nested field/not nested field for comparison
// single comparison utility
// refactor the code consider performance
// clean up spageti code
module.exports = route;
