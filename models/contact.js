var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contactSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    email: {type: String, max: 200},
    phone: {type: String, max: 50},
    note: {type: String, max: 200}
  }
);

// Virtual for book's URL
contactSchema
.virtual('url')
.get(function () {
  return '/contact/' + this._id;
});

//Export model
module.exports = mongoose.model('contact', contactSchema);