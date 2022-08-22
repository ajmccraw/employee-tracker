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

connection.connect(function(err) {
    if (err) throw err;
});

const options = (data) => {
    let con = true;
    switch (data.menuOptions) {
      case "List Employees":
        getEmployees();
        break;
      case "List Departments":
        getDepartments();
        break;
      case "List Roles":
        getRoles();
        break;
      case "Enter New Department":
        enterNewDepartment(data);
        break;
      case "Enter New Role":
        enterNewRole(data);
        break;
      case "Enter New Employee":
        enterNewEmployee(data);
        break;
      case "Change Employee's Role":
        updateEmployee(data)
        break;
      case "Exit":
        con = false;
        break;
    }
    if (!con) {
      console.log("Goodbye!");
      process.exit(0);
    } else {
      setTimeout(()=> {
      // ask user if they would like to keep going
        inquirer.prompt([
        {
          type: "confirm",
          name: "continue",
          message: "Would you like to keep going?",
          default: true
        }
      ])
      .then(answer => {
        if (answer.continue == true) {
          return begin()
        } else {
          console.log("program is done");
          process.exit(0)
        }
      })
    }, 500);
    }
};





