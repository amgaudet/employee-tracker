use company_DB;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Rachel', 'Wright', 1, 4),
('Tom', 'Wells', 1, 4),
('Irene', 'Smith', 4, 4),
('Morris', 'Bianco', 2, 3),
('Nathaniel', 'Wilson', 4, 3),
('Sofia', 'Rodriguez', 4, 3),
('Roy', 'Halladay', 3, 2),
('Michael', 'Buckner', 3, 2),
('Claire', 'Buckner', 3, 2),
('Kyle', 'Phillips', 2, 1),
('Greg', 'Fowler', 2, 1),
('Susan', 'Lewis', 2, 1);

INSERT INTO department (name)
VALUES ('Accounting'),
('Sales'),
('Custodial'),
('Network');

INSERT INTO role (title, salary, department_id)
VALUES ('Accounting Manager', 96000, 1),
('Network Manager', 116000, 4),
('Custodial Manager', 66000, 3),
('Sales Manager', 106000, 2);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;