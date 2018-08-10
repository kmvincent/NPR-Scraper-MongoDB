var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  // `title` is of type String
  title: {
    type: String,
    trim: true
  },

  body: {
    type: String,
    trim: true
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;