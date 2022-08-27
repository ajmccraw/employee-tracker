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

const makeQuestionOptionArrays = () => {
    connection.query(`SELECT title
    FROM roles
    ORDER BY id ASC
    `, (err, rows) => {
      if (err) throw err;
      rows.map((element) => {
        rolesArray.push(element.title);
      });
    });
    connection.query(`SELECT * FROM departments`, (err, rows) => {
      if (err) throw err;
      rows.map((element) => {
        departmentsArray.push(element.name);
      });
    });
    connection.query(`SELECT first_name, last_name FROM employees`, (err, rows) => {
      if(err) throw err;
      rows.map((element) => {
        employeesArray.push(`${element.first_name} ${element.last_name}`)
      });
    })
};

let getDepartments = () => {
    connection.query('SELECT * FROM departments', (err, rows) => {
        if (err) throw err;
        console.table(rows);
    });
};

let getRoles = () => {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary, departments.name
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`,
        (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
};

let getEmployees = () => {
    connection.query(
        `SELECT E.ID, E.FIRST_NAME, E.LAST_NAME, R.TITLE, D.NAME AS dept, R.SALARY, M.FIRST_NAME AS manager_first, M.LAST_NAME AS manager_last
        FROM EMPLOYEES E
        left JOIN ROLES R ON E.ROLE_ID = R.ID
        left JOIN DEPARTMENTS D ON R.DEPARTMENT_ID = D.ID
        left JOIN EMPLOYEES M ON E.MANAGER_ID = M.ID`,
        (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
};
  
let enterNewDepartment = (data) => {
    connection.query(
        `INSERT INTO departments (name) VALUES (?)`,
        [data.name],
        (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
};

let enterNewRole = (data) => {
    let departmentId = departmentsArray.indexOf(data.department) + 1;
    connection.query(
        `INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)`,
        [data.role, departmentId, parseInt(data.salary)],
        (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
    rolesArray.push(data.name);
};
  
let enterNewEmployee = (data) => {
    let roleId = rolesArray.indexOf(data.role) + 1;
    let managerId = employeesArray.indexOf(data.manager) + 1;

    connection.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
        [data.first_name, data.last_name, roleId, managerId],
        (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
};

let updateEmployee = (data) => {
    employeeId = employeesArray.indexOf(data.employee) +1;
    roleId = rolesArray.indexOf(data.new_role) + 1;
    connection.query(`UPDATE employees SET role_id = ? WHERE employees.id = ?`, 
    [roleId, employeeId], 
    (err, rows) => {
        if (err) throw err;
        console.table(rows);
        }
    );
};

let whenConnected = (res, rej) => {
  
    makeQuestionOptionArrays();
    
    res("yay!");
    rej(err);

    console.log ("");
    console.log (company_name);
    console.log ("employee tracker");
    console.log ("");
};
    
  let begin = () => {
    new Promise(whenConnected).then(questionList).catch((error) => {
      console.log(error);
    });
  };
  
  begin();
