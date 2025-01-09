import inquirer from 'inquirer';
import { getAllDepartments, getAllEmployees, getAllRoles, addDepartment, addEmployee, addRole, updateEmployeeRole, disconnectFromDatabase } from './functions/functions.js';

function start() {
    const userChoices = ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit']
    inquirer
        .prompt([{
            type: 'list',
            name: 'choices',
            message: 'Please select an action:',
            choices: userChoices
        }])
        .then((response) => {
            switch(response.choices) {
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
                case 'Exit':
                    disconnectFromDatabase();
                    this.exit = true;
            }
        })
}

start();