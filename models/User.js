const mongoose = require('mongoose');
console.log("User.js is running!");
console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Schema = mongoose.Schema;

const logEntrySchema = new Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true }, // You can also use `Date` type if you prefer
});

const userSchema = new Schema({
    username: { type: String, required: true },
    log: [logEntrySchema], // Array of log entries
});

const User = mongoose.model('User', userSchema);
module.exports = User;