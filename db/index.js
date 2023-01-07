const mysql = require('mysql2');

const employeeDB = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "employee_db"
    }
); 

employeeDB.connect((err) => {
    if (err) {
        console.log(err);
    }
});

class Database {

    constructor(db) {
        this.db = db;
    }

    viewEmployees() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    viewRoles() {
        return new Promise((resolve, reject) => {
          this.db.query('SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id;', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
    }

    viewDepartments() {
        return new Promise((resolve, reject) => {
          this.db.query('SELECT * FROM department', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
    } 

    
}

module.exports = {
    Database, 
    employeeDB
};