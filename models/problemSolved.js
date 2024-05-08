const mongoose = require('mongoose');

// Define the schema for the problemSolved collection
const problemSolvedSchema = new mongoose.Schema({
  username: { type: String, required: true },
  question: { type: String, required: true },
  // Add any other fields you need for the problemSolved collection
});

// Create the model for the problemSolved collection
const ProblemSolved = mongoose.model('problemSolved', problemSolvedSchema);

module.exports = ProblemSolved;
