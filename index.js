import inquirer from 'inquirer';
import { getAllDepartments, getAllEmployees, getAllRoles, addDepartment, addEmployee, addRole, updateEmployeeRole, disconnectFromDatabase, connectToDatabase } from './functions/functions.js';

export function start() { // This function starts the application.
    const userChoices = ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit']
    inquirer
        .prompt([{
            type: 'list',
            name: 'choices',
            message: 'Please select an action:',
            choices: userChoices
        }])
        .then((response) => {
            switch(response.choices) { // This switch case statement performs the respective function for what the user selects.
                case 'View All Departments':
                    getAllDepartments();
                    break;
                case 'View All Roles':
                    getAllRoles();
                    break;
                case 'View All Employees':
                    getAllEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Exit': // If the user exits, the process exits and the client is disconnected from the database by calling disconnectFromDatabase.
                    process.exit(0).then(()=> {
                        disconnectFromDatabase();
                    })
                    break;
            }
        })
}
connectToDatabase(); // This calls the function to connect to the database.
start(); // This calls the function to start the application.