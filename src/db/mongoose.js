const chalk = require('chalk');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
    useNewUrlParser: true 
}).then(() => {
    console.log(chalk.bgGray('Successfully connected to MongoDB database...'));
}).catch((error) => {
    console.log(chalk.bgRed('Error: ', error));
})
