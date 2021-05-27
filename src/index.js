const express = require('express');
const volleyball = require('volleyball');
const {notFoundController} = require('./controllers/notFoundController')
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
require('./db/mongoose.js');



const app = express();
app.use(volleyball);
app.use(express.json());
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.all('*', notFoundController);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port ' + port);
});