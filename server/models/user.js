const { Schema, Document, model } = require('mongoose');
const { ObjectID } = require('mongodb');

// Valid email address
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Minimum eight characters, at least one letter and one number:
// const passwordRegexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const userSchema = new Schema({
  _id: {
    type: ObjectID,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    // match: passwordRegexp,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegexp,
  },
  config: {
    type: Object,
  },
  alerts: {
    type: Array,
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = model('User', userSchema);
