const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const config = require('./package.json');
const table = require("console.table");
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_db'
    }
); 

console.log(logo(config,).render());

const question = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do? (Use arrow keys)",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
    }
];

var userResponse;

function init () {
    inquirer
    .createPromptModule(question)
    .then((response) => {

        if (response === "View All Employees") {

        } else if (response === "Add Employee") {

        } else if (response === "Update Employee Role") {

        } else if (response === "View All Roles") {
            
        } else if (response === "Add Role") {
            
        } else if (response === "View All Departments") {
            
        }  else if (response === "Add Department") {
            
        } else {

        }
    });
};