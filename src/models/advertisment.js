const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    phone: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
      }
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
