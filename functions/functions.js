import pkg from 'pg';
const { Client } = pkg;
import inquirer from 'inquirer';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export function connectToDatabase() {
    client.connect()
        .then((response) => {
            console.log('Connected to the database successfully!');
        })
        .catch((err) => {
            console.error('ERROR connecting to the database:', err.stack);
        })
}
export function disconnectFromDatabase() {
    client.end()
        .then((response) => {
            console.log('Disconnected from the database successfully!');
        })
        .catch((err) => {
            console.error('ERROR disconnecting from the database:', err.stack)
        })
}

export function addDepartment() {
    inquirer
        .prompt([{
            type: 'input',
            name: 'name',
            message: 'Please enter the department name:'
        }])
        .then((answers) => {
            const query = 'INSERT INTO department(name) VALUES ($1) RETURNING id';
            return client.query(query, [answers.name]);
        })
        .then((res) => {
            console.log(`Department added with ID: ${res.rows[0].id}`);
        })
        .catch((err) => {
            console.log('ERROR adding department:', err.stack);
        });
    }
export function addRole() {
    client.query('SELECT id, name FROM department')
        .then((res) => {
            const departments = res.rows;
            const departmentChoices = departments.map(department => ({
                name: department.name,
                value: department.id
            }));

            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Please enter the role title:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Please enter the role salary:'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Please select the department:',
                    choices: departmentChoices
                }
            ]);
        })
        .then((answers) => {
            const query = 'INSERT INTO role(title, salary, department_id) VALUES ($1, $2, $3) RETURNING id';
            return client.query(query, [answers.title, answers.salary, answers.department_id]);
        })
        .then((res) => {
            console.log(`Role added with ID: ${res.rows[0].id}`);
        })
        .catch((err) => {
            console.log('ERROR adding role:', err.stack);
        });
    }
export function addEmployee() {
    client.query('SELECT id, first_name, last_name, role_id, manager_id FROM employee')
        .then((response) => {
            const employees = response.rows;
            const managerChoices = employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }));
            managerChoices.push({
                name: 'No manager',
                value: null
            });
            return client.query('SELECT id, title FROM role');
        })
        .then((response2) => {
            const roles = response2.rows;
            const roleChoices = roles.map(role => ({
                name: role.title,
                value: role.id
            }));
            return inquirer
                .prompt([{
                    type: 'input',
                    name: 'first_name',
                    message: 'Please enter first name:'
                },{
                    type: 'input',
                    name: 'last_name',
                    message: 'Please enter last name:'
                },{
                    type: 'list',
                    name: 'role_id',
                    message: 'Please select a role:',
                    choices: roleChoices
                },{
                    type: 'list',
                    name: 'manager_id',
                    message: 'Please select a manager if applicable:',
                    choices: managerChoices
                }]);
        })
        .then((answers) => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id';
            return client.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        })
        .then((response) => {
            console.log(`Employee added: ${response.rows[0].id}`);
        })
        .catch((err) => {
            console.error('ERROR adding employee:', err.stack);
        });
    };
export function updateEmployeeRole() {
    let employeeChoices;
    
    client.query('SELECT id, first_name, last_name FROM employee')
    .then((response) => {
        const employees = response.rows;
        employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
        return client.query('SELECT id, title FROM role');
    })
    .then((response2) => {
        const roles = response2.rows;
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));
        return inquirer
            .prompt([{
                type: 'list',
                name: 'employee',
                message: 'Please select the employee to update:',
                choices: employeeChoices
            },{
                type: 'list',
                name: 'role',
                message: 'Please select a new role to assign:',
                choices: roleChoices
            }]);
    })
    .then((answers) => {
        const query = `
            UPDATE employee
            SET role_id = $1
            WHERE id = $2
        `;
        return client.query(query, [answers.role, answers.employee]);
    })
    .then(() => {
        console.log('Employee role updated successfully!');
    })
    .catch((err) => {
        console.error('ERROR updating employee role:', err.stack);
    });
}
export function getAllRoles() {
    client.query('SELECT * FROM role')
        .then((response) => {
            console.table(response.rows);
        })
        .catch((err) => {
            console.error('ERROR getting all roles:', err.stack);
        })
}
export function getAllDepartments() {
    client.query('SELECT * FROM department')
        .then((response) => {
            console.table(response.rows);
        })
        .catch((err) => {
            console.error('ERROR getting all departments:', err.stack);
        })
}
export function getAllEmployees() {
    client.query('SELECT * FROM employee')
        .then((response) => {
            console.table(response.rows);
        })
        .catch((err) => {
            console.error('ERROR getting all employees:', err.stack);
        })
}
