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
                'View Employee', 'View Role', 'View Department', 'Update Employee Role'],
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

            default: connection.end();
        }
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
    const choices = await connection.query(
        'SELECT * FROM role'
    );
    const roleChoices = await choices.map(({ id, title }) => ({ name: title, value: id }));

    const { first_name, last_name, role_id } = await inquirer.prompt([
        {
            type: 'input',
            message: 'Employee first name',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Employee first name',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'Employee role:',
            name: 'role_id',
            choices: roleChoices
        }
        // {
        //     type: 'input',
        //     message: 'Employee first name',
        //     name: 'manager_id'
        // },

    ]);
    connection.query(
        'INSERT INTO employee SET ?',
        {
            first_name: first_name,
            last_name: last_name,
            role_id: role_id
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