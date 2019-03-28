'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const regionSchema = new Schema({
    title: String,
    variable: String,
    identifier: String,
    geo: {
      lat: Number,
      long: Number
    }
});

regionSchema.statics.findByTitle = function(name) {
  return this.findOne({ title : name});
};

module.exports = Mongoose.model('Regions', regionSchema);
