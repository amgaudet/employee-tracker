use company_DB;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jon', 'Wright', 1, 0),
('Tom', 'Ellis', 1, 4),
('Irene', 'Smith', 4, 4),
('Bill', 'Brasky', 2, 3),
('Nathaniel', 'Laramore', 4, 3),
('Sofia', 'Rodriguez', 4, 3),
('Roy', 'Halladay', 3, 2),
('Michael', 'Contreras', 3, 2),
('Claire', 'Buckner', 3, 2),
('Thomas', 'Phillips', 2, 1),
('Andy', 'Fowler', 2, 1),
('Susan', 'Rodriguez', 2, 1);

INSERT INTO department (name)
VALUES ('Accounting'),
('Sales'),
('Custodial'),
('Network');

INSERT INTO role (title, salary, department_id)
VALUES ('Accounting Manager', 96000, 1),
('Network Manager', 116000, 4),
('Custodial Manager', 66000, 3),
('Sales Manager', 106000, 2),
('Grunt', 55000, 2);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;