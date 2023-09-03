const inquirer = require('inquirer');
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function main() {
    // Step 1: Ask for MySQL database config
    const mysqlConfig = await inquirer.prompt([
        {
            type: 'input',
            name: 'mysqlHost',
            message: 'Enter MySQL host:',
        },
        {
            type: 'input',
            name: 'mysqlUser',
            message: 'Enter MySQL username:',
        },
        {
            type: 'input',
            name: 'mysqlPassword',
            message: 'Enter MySQL password:',
        },
        {
            type: 'input',
            name: 'mysqlDatabase',
            message: 'Enter MySQL database:',
        },
    ]);

    // Step 2: Ask for Nodemailer config
    const nodemailerConfig = await inquirer.prompt([
        {
            type: 'input',
            name: 'smtpHost',
            message: 'Enter SMTP host for Nodemailer:',
        },
        {
            type: 'input',
            name: 'smtpPort',
            message: 'Enter SMTP port for Nodemailer:',
        },
        {
            type: 'input',
            name: 'smtpUser',
            message: 'Enter SMTP username for Nodemailer:',
        },
        {
            type: 'input',
            name: 'smtpPassword',
            message: 'Enter SMTP password for Nodemailer:',
        },
    ]);

    // Step 3: Ask for logger configuration
    const loggerConfig = await inquirer.prompt([
        {
            type: 'list',
            name: 'loggerType',
            message: 'Select logger type:',
            choices: ['default', 'file', 'database'],
        },
        {
            type: 'input',
            name: 'loggerTimezone',
            message: 'Enter logger timezone:',
        },
    ]);

    // Step 4: Create a config file with the collected information
    const configData = `
    module.exports = {
      mysql: ${JSON.stringify(mysqlConfig, null, 2)},
      nodemailer: ${JSON.stringify(nodemailerConfig, null, 2)},
      logger: ${JSON.stringify(loggerConfig, null, 2)}
    };
  `;

    fs.writeFileSync('config.js', configData);

    //Step 5: Run npx prettier --write config.js
    await exec('npx prettier --write config.js');

    // Step 6: Run npm install
    console.log('Running npm install...');
    const { stdout, stderr } = await exec('npm install');
    console.log(stdout);
    console.error(stderr);

    // Step 7: Display a completion message
    console.log('Project is configured and ready to use.');
    console.log('To start the project, run "npm run start".');
}

main();
