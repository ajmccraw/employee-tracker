const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const departmentsArray = [];
const employeesArray = [];
const rolesArray = [];



// name of business
let company_name = 'The Computer Company';

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "",
    database: "business"
  });

