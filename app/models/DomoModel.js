var mongoose = require('mongoose');
var _ = require('lodash');

var DomoModel;

var setName = function (name) {
    return _.escape(name).trim();
};

var DomoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    age: {
        type: Number,
        min: 0,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
    createdData: {
        type: Date,
        default: Date.now
    }
});

DomoSchema.methods.toAPI = function () {
    return {
        name: this.name,
        age: this.age
    };
};

DomoSchema.statics.findByOwner = function (ownerId, cb) {
    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };
    return DomoModel.find(search).select("name age").exec(cb);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.Model = DomoModel;
module.exports.Schema = DomoSchema;
