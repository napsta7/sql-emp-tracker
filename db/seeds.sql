INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 60000, 1),
    ('Marketing Specialist', 70000, 2),
    ('Software Developer', 80000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Peter', 'Parker', 3, NULL),
    ('Mary', 'Jane', 1, NULL),
    ('Edward', 'Brock', 2, NULL);