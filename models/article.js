var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  subCategory: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  img: {
    type: String,
    trim: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
