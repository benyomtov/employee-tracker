//requires all necessary packages and files

const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const config = require('./package.json');
const table = require("console.table");
const {Database, employeeDB} = require('./db');

//renders ascii art logo 

console.log(logo(config,).render());

//prompt question for main menu

const question = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do? (Use arrow keys)",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
    }
];

//prompt autofills role choices based on existing roles

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

//prompt autofills department choices based on existing departments

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

//autofills employee and role choices based on existing options

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

//initializes and runs application

function init () {

    //creates new instance of mySQL database

    const employeeDatabase = new Database(employeeDB);

    inquirer.prompt(question)
        .then((response) => {

            //if statement executing appropriate database method based on user selection

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

                    //before executing the addEmployee method, this else-if block matches the user selection for role with its corresponding role_id in the database and passes it as an argument to the method.

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

                    //before executing the addRole method, this else-if block matches the user selection for department with its corresponding department_id in the database and passes it as an argument to the method.

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

                //before executing the updateRole method, this else-if block matches the user selection for role  and employee with their corresponding role_id and employee.id in the database and passes them as arguments to the method,

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
                        }
                    } 

                    const moreData = await employeeDatabase.viewEmployees();
                    const anotherDataArray = moreData.map((employee) => {
                        return {
                            name: employee.first_name + " " + employee.last_name,
                            id: employee.id,
                        }
                    });

                    for (let i = 0; i < anotherDataArray.length; i++) {

                        const thisEmployee = anotherDataArray[i].name;

                        if (responses.employee == thisEmployee) {
                            thisEmployeeID = anotherDataArray[i].id;

                            const database = employeeDatabase.updateRole(thisEmployeeID, thisRoleID);
                            console.log(`${responses.employee}'s role has been changed to ${responses.role}`);
                            console.log(thisRoleID, thisEmployeeID);
                            init();
                        }
                    }


                    
                    

                });
            }

        });    
};
 
init();