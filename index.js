const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const config = require('./package.json');
const table = require("console.table");
const {Database, employeeDB} = require('./db');

console.log(logo(config,).render());

const question = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do? (Use arrow keys)",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
    }
];

function init () {
    const employeeDatabase = new Database(employeeDB);

    inquirer.prompt(question)
        .then((response) => {

            if (response.menu === "View All Employees") {
                const database = employeeDatabase.viewEmployees()
                    .then((data) => {
                        console.table(data);
                        init();
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            } else if (response.menu === "View All Roles") {

                const database = employeeDatabase.viewRoles()
                    .then((data) => {
                        console.table(data);
                        init();
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            } else if (response.menu === "View All Departments") {
                const database = employeeDatabase.viewDepartments()
                    .then((data) => {
                        console.table(data);
                        init();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            
        });    
};
 
init();