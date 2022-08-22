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

let questionList = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "menuOptions",
          message: "Make a choice from the list:",
          choices: [
            "List of departments",
            "List of roles",
            "List of employees",
            "Enter a new department",
            "Enter a new role",
            "Enter a new employee",
            "Change an employee's role",
            "Exit",
          ],
        },
        {
            type: "input",
            name: "name",
            message: "What is the new department name?",
            when: function (data) {
              if (data.menuOptions == "Enter a new department") {
                return true;
              } else {
                return false;
              }
            },
        },
        {
          type: "input",
          name: "role",
          message: "What is the name of this new role?",
          when: function (data) {
            if (data.menuOptions == "Enter a new role") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "list",
          name: "department",
          message: "Choose a department:",
          choices: departmentsArray,
          when: function (data) {
            if (data.menuOptions == "Enter a new role") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "input",
          name: "salary",
          message: "How much does this new role earn?",
          when: function (data) {
            if (data.menuOptions == "Enter a new role") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
          when: function (data) {
            if (data.menuOptions == "Enter a new employee") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of the new employee?",
          when: function (data) {
            if (data.menuOptions == "Enter a new employee") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "list",
          name: "role",
          message: "What is the role for this new employee?",
          choices: rolesArray,
          when: function (data) {
            if (data.menuOptions == "Enter a new employee") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the manager for this employee?",
          choices: employeesArray,
          when: function (data) {
            if (data.menuOptions == "Enter a new employee") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "list",
          name: "employee",
          message: "Choose an employee for the new role",
          choices: employeesArray,
          when: function (data) {
            if (data.menuOptions == "Change an employee's role") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          type: "list",
          name: "new_role",
          message: "Choose a new role",
          choices: rolesArray,
          when: function (data) {
            if (data.menuOptions == "Change an employee's role") {
              return true;
            } else {
              return false;
            }
          },
        },
      ])
      .then((answers) => options(answers))
      .catch((err) => console.log(err));
};



