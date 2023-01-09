EventEmitter.setMaxListeners(20); 

const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const config = require('./package.json');
const table = require("console.table");
const {Database, employeeDB} = require('./db');
const { EventEmitter } = require("stream");

console.log(logo(config,).render());

const question = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do? (Use arrow keys)",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
    }
];

const addEmployeeQuestions = [
    
    {
        type: "input",
        name: "firstname",
        message: "Please enter the new employee's first name."
    },

    {
        type: "input",
        name: "lastname",
        message: "Please enter the new employee's last name."
    },
    
    {
        type: "list",
        name: "role",
        message: "Select the role this employee will be assigned to: (Use arrow keys)",
        choices: async () => {
            const employeeDatabase = new Database(employeeDB);
            const data = await employeeDatabase.viewRoles();
            return data.map((role) => {
              return role.title;
            });  
        },
    }
];

const addRoleQuestions = [
    {
        type: "input",
        name: "role",
        message: "Please enter the role you would like to add:"
    },
    {
        type: "list",
        name: "department",
        message: "Please select a department to add your role to:",
        choices: async () => {
            const employeeDatabase = new Database(employeeDB);
            const data = await employeeDatabase.viewDepartments();
            return data.map((department) => {
              return department.name;
            });  
        },
    },
    {
        type: "confirm",
        name: "manager",
        message: "Is this role a management position?"
    },
    {
        type: "number",
        name: "salary",
        message: "Please enter the salary for your new role",
    }
];

const addDepartmentQuestion = [
    {
        type: "input",
        name: "name",
        message: "Please input the department you would like to add:"
    }
];

const updateRoleQuestions = [
    {
        type: "list",
        name: "employee",
        message: "Choose an employee to update role:",
        choices: async () => {
            const employeeDatabase = new Database(employeeDB);
            const data = await employeeDatabase.viewEmployees();
            return data.map((employee) => {
              return (employee.first_name + " " + employee.last_name);
            });  
        },
    },
    {
        type: "list",
        name: "role",
        message: "Choose a new role for the selected employee:",
        choices: async () => {
            const employeeDatabase = new Database(employeeDB);
            const data = await employeeDatabase.viewRoles();
            return data.map((role) => {
              return role.title;
            });  
        },
    },
]

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
            }  else if (response.menu === "Add Employee") {

                var thisID;

                inquirer.prompt(addEmployeeQuestions)
                .then( async (responses) => {
                    const data = await employeeDatabase.viewRoles();
                    const dataArray = data.map((role) => {
                        return {
                            name: role.title,
                            id: role.id,
                        }
                    });  

                    for (let i = 0; i < dataArray.length; i++) {
                        const thisRole = dataArray[i].name;

                        if (responses.role == thisRole) {

                            thisID = dataArray[i].id;

                            const database = employeeDatabase.addEmployee(responses.firstname, responses.lastname, thisID);
                            console.log(`${responses.firstname} ${responses.lastname} has been added to the system!`)
                            init();
                        }
                    } 
                });      
            } else if (response.menu === "Add Role") {

                var thisID;

                inquirer.prompt(addRoleQuestions)
                .then( async (responses) => {
                    const data = await employeeDatabase.viewDepartments();
                    const dataArray = data.map((department) => {
                        return {
                            name: department.name,
                            id: department.id,
                        }
                    }); 
                    
                    for (let i = 0; i < dataArray.length; i++) {
                        const thisDepartment = dataArray[i].name;

                        if (responses.department == thisDepartment) {

                            thisID = dataArray[i].id;

                            const database = employeeDatabase.addRole(responses.role, responses.manager, responses.salary, thisID);
                            console.log(`${responses.role} has been entered into the system!`);
                            init();
                            
                        }
                    } 

                });
            } else if (response.menu === "Add Department") {

                inquirer.prompt(addDepartmentQuestion)
                    .then(async (response) => {
                        const database = employeeDatabase.addDepartment(response.name);
                        console.log(`${response.name} has been entered into the system!`);
                        init();

                });

            } else {

                var thisRoleID;
                var thisEmployeeID;

                inquirer.prompt(updateRoleQuestions)
                .then(async (responses) => {
                    
                    const data = await employeeDatabase.viewRoles();
                    const dataArray = data.map((role) => {
                        return {
                            name: role.title,
                            id: role.id,
                        }
                    }); 
                    
                    for (let i = 0; i < dataArray.length; i++) {
                        const thisRole = dataArray[i].name;

                        if (responses.role == thisRole) {

                            thisRoleID = dataArray[i].id;

                            const moreData = await employeeDatabase.viewEmployees();
                            const anotherDataArray = data.map((employee) => {
                            return {
                                name: employee.first_name + " " + employee.last_name,
                                id: employee.id,
                            }
                            }); 

                            for (let i = 0; i < dataArray.length; i++) {
                                
                                const thisEmployee = dataArray[i].name;

                                if (responses.role == thisRole) {
                                    thisRoleID = dataArray[i].id;

                                    const database = employeeDatabase.updateRole(thisEmployeeID, thisRoleID);
                                    console.log(`${responses.employee}'s role has been changed to ${responses.role}`);
                                    init();
                                }
                            }
                                
                            
                        }
                    } 
                

                    
                    

                });
            }

        });    
};
 
init();