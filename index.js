require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const User = require('./models/User')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({ extended: false }));

app.post('/api/users', async function(req, res) {
  const username = req.body.username;
  const newUser = new User({username: username});
  try{
    await newUser.save();
    return res.json({username: newUser.username, _id: newUser._id});
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: 'error creating user' });
  }
})

//67c31e0a5733ef8237b4ad8b

app.post('/api/users/:_id/exercises', async function(req, res) {
  try{
    //prepare the data
    const id = req.params._id;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const dateObj = new Date(req.body.date);


    //find the user
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'id not found' });
    }

    //update the user
    user.log.push({
      description: description,
      duration: duration,
      date: dateObj
    });
    await user.save();

    //return json obj
    return res.json({
      username: user.username,
      description: description,
      duration: duration,
      date: dateObj.toDateString(),
      _id: user._id
    });
  } catch (err) {
    return res.status(404).send({ message: 'update went wrong' });
  }
})

app.get('/api/users/:_id/logs', async function(req, res) {
  try{
  //all the params
    const id = req.params._id;
    const fromD = req.query.from;
    const toD = req.query.to;
    const limit = req.query.limit;

    //find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'id not found' });
    }

    let logs = user.log;
    const count = logs.length;
    if (fromD || toD) {
      const fromDate = fromD ? new Date(fromD) : new Date(0);
      const toDate = toD ? new Date(toD) : new Date();
      logs = logs.filter((log) => {
        const logDate = log.date;
        return logDate >= fromDate && logDate <= toDate;
      });
    }
    if (limit) {
      logs = logs.slice(0, Number(limit));
    }

    return res.json({
      username: user.username,
      count: count,
      _id: id,
      log: logs.map((log) => ({
        description: log.description,
        duration: log.duration,
        date: log.date.toDateString()
      }))
    });
  } catch (err) {
    return res.status(404).send({ message: 'get went wrong' });
  }
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
