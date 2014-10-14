// TODO make this backed by something that can really store keys efficiently. 
var History = function() {
  this.history = [];

  this.check = function(event) {
    return this.history.indexOf(event.eventID) > -1;
  }
  this.add = function(event) {
    this.history.push(event.eventID)
  }
 
};
module.exports = new History();
