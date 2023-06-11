const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  product1: {
    type: String,
    required: true
  },
  product2: {
    type: String,
    required: true
  },
  offer: {
    type: Number,
    required: true
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
