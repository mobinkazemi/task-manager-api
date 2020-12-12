const express = require('express');
const volleyball = require('volleyball');
const chalk = require('chalk');
const User = require('./models/user');
const Task = require('./models/tasks');
require('./db/mongoose.js');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());//for ability to parse json with express
app.use(volleyball);



app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).json(user);
    }).catch((error) => {
        throw new Error(chalk.bgRed('Error: ', error));
    });
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        if(!users){
            return res.status(204).send();
        }
        
        res.status(200).json(users);
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
        if(!user){
            return res.status(204).send();
        }
        
        res.status(200).json(user);
    })
})



app.post('/tasks', (req, res) => {
const task = Task(req.body);
    task.save().then(() =>{
        res.status(201).json(task);
    }).catch((error) => {
        throw new Error(chalk.bgRed('Error: ', error));
    });
});

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        if(!tasks){
            return res.status(204).send();
        }

        res.status(200).json(tasks);
    }).catch((e) => {
        throw new Error('Error: ', e);
    });
});

app.get('/tasks/:title', (req, res) =>{
    const title = req.params.title;
    Task.find({title: title}).then((doc) => {
        if(!doc){
            return res.status(204).send();
        }

        res.status(200).json(doc);
    }).catch((e) => {
        throw new Error('Error: ', e);
    });
});


app.listen(port, () => {
    console.log('listening on port ' + port);
});