//everything up to line 18 sets of the connection to mySQL

const mysql = require('mysql2');

const employeeDB = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "employee_db",
    }
); 

employeeDB.connect((err) => {
    if (err) {
        console.log(err);
    }
});

//class Database contains methods for application functionality

class Database {

    constructor(db) {
        this.db = db;
    }

    //pulls up derived table where the corresponding role and department info are shown alongside the employee table info

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

    //pulls up derived table that joins role and department tables and shows info from both

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

    //pulls up department table

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

    //inserts a new employee into database and updates database so all information for that employee is correct

    addEmployee(firstName, lastName, roleID) {
        return new Promise((resolve, reject) => {
            this.db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [firstName, lastName, roleID], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    this.db.query('UPDATE employee e JOIN role r ON e.role_id = r.id SET e.are_manager = r.is_manager', (err) => { if (err) { console.log(err); } });
                    this.db.query('CREATE TABLE temp_table AS SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE temp_table q SET q.manager_id = (SELECT e2.id FROM (SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id) e2 WHERE e2.are_manager = 1 AND e2.department_id = q.department_id LIMIT 1) WHERE q.are_manager = 0;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee e INNER JOIN temp_table t ON e.id = t.id SET e.manager_id = t.manager_id;', (err) => { if (err) { console.log(err); } });
                    this.db.query('DROP TABLE temp_table;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee SET employee.manager = (SELECT CONCAT(first_name, " ", last_name) FROM (SELECT * FROM employee) AS temp WHERE temp.id = employee.manager_id);', (err) => { if (err) { console.log(err); } });
                    resolve(data);
                }
            });
        });
    }

    //inserts a new role

    addRole(newRole, managerConfirm, salary, departmentID) {
        return new Promise((resolve, reject) => {
            this.db.query('INSERT INTO role (title, is_manager, salary, department_id) VALUES (?, ?, ?, ?)', [newRole, managerConfirm, salary, departmentID], (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    //inserts a new department

    addDepartment(name) {
        return new Promise((resolve, reject) => {
            this.db.query('INSERT INTO department (name) VALUES (?)', [name], (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    //updates the role of a given employee and updates employee table to reflect changes

    updateRole(employee, role) {
        return new Promise((resolve, reject) => {
            this.db.query('UPDATE employee SET role_id = (?) WHERE id = (?)', [role, employee], (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    this.db.query('UPDATE employee e SET e.are_manager = (SELECT r.is_manager FROM (SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager FROM employee e JOIN role r ON e.role_id = r.id) r WHERE e.role_id = r.id);', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee e JOIN role r ON e.role_id = r.id SET e.are_manager = r.is_manager', (err) => { if (err) { console.log(err); } });
                    this.db.query('CREATE TABLE temp_table AS SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE temp_table q SET q.manager_id = (SELECT e2.id FROM (SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id) e2 WHERE e2.are_manager = 1 AND e2.department_id = q.department_id LIMIT 1) WHERE q.are_manager = 0;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee e INNER JOIN temp_table t ON e.id = t.id SET e.manager_id = t.manager_id;', (err) => { if (err) { console.log(err); } });
                    this.db.query('DROP TABLE temp_table;', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee SET employee.manager = (SELECT CONCAT(first_name, " ", last_name) FROM (SELECT * FROM employee) AS temp WHERE temp.id = employee.manager_id);', (err) => { if (err) { console.log(err); } });
                    this.db.query('UPDATE employee e SET e.manager = NULL, e.manager_id = NULL WHERE e.are_manager = 1;', (err) => { if (err) { console.log(err); } });
                    resolve(data);
                }
            });
        });
    }

    
}

//exports Database object and mySQL connection to main index file

module.exports = {
    Database, 
    employeeDB
};