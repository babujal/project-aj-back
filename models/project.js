// models/hoot.js

const mongoose = require('mongoose'); //import the mongoose npm package

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  hostingLink: {
    type: String,
  },
  repoLink: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['hosted', 'finished' , 'in progress' , 'outdated']
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;



