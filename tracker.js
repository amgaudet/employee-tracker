const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'company_db'
});

connection.query = util.promisify(connection.query);

const renderMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Add Role', 'Add Department',
                'View Employee', 'View Role', 'View Departments', 'Update Employee Role'],
            name: 'selection'
        }
    ]).then(res => {
        switch (res.selection) {
            case 'Add Employee': addEmployee();
                break;
            case 'Add Role': addRole();
                break;
            case 'Add Department': addDepartment();
                break;
            case 'View Departments': renderDeptList();
                break;
            case 'View Role': renderRoleList();
                break;
            case 'View Employee': renderEmployeeList();
                break;
            default: connection.end();
        };
    });
};

const renderDeptList = () => {
    connection.query(
        'SELECT * FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            renderMenu();
        }
    );
};

const renderRoleList = () => {
    query = 'SELECT role.department_id, role.title, role.salary, department.id, department.name ';
    query += 'FROM role INNER JOIN department ON (role.department_id = department.id)';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        renderMenu();
    });
};

const renderEmployeeList = () => {
    query = `SELECT first_name, last_name, role_id, role.id, salary, department_id, department.id, name
            FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON
            role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        renderMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter department name',
            name: 'name'
        }
    ]).then(res => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: res.name
            },
            (err, res) => {
                if (err) throw err;
                console.log('New department successfully added!');
                renderMenu();
            }
        );
    })
}

const addRole = async () => {
    const choices = await connection.query(
        'SELECT * FROM department'
    );
    const deptartmentChoices = await choices.map(({ id, name }) => ({ name: name, value: id }));

    const roleInfo = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new role',
            name: 'role'
        },
        {
            type: 'input',
            message: 'Enter role salary',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'What dept does role belong to?',
            name: 'department_id',
            choices: deptartmentChoices
        },
    ])
    connection.query(
        'INSERT INTO role SET ?',
        {
            title: roleInfo.role,
            salary: roleInfo.salary,
            department_id: roleInfo.department_id
        },
        (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            renderMenu();
        }
    )
};

const addEmployee = async () => {
    const role = await connection.query(
        'SELECT * FROM role'
    );
    const roleChoices = await role.map(({ id, title }) => ({ name: title, value: id }));

    const employees = await connection.query(
        'SELECT * FROM employee'
    );
    const managerChoices = await employees.map(({ id, first_name, last_name }) =>
        ({ value: id, Name: first_name + last_name }));

    console.log(managerChoices);

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            message: 'Employee first name',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Employee last name',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'Employee role:',
            name: 'role_id',
            choices: roleChoices
        },
        {
            type: 'list',
            message: 'Employee manager',
            name: 'manager_id',
            choices: managerChoices
        },

    ]);
    connection.query(
        'INSERT INTO employee SET ?',
        {
            first_name: first_name,
            last_name: last_name,
            role_id: role_id,
            manager_id: manager_id
        },
        (err, res) => {
            if (err) throw err;
            console.log("Employee added successfully!");
            renderMenu();
        });

}

connection.connect(err => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    renderMenu();
});