const {Schema, model, Types} = require("mongoose");

const songSchema = new Schema ({
    owner: {
        type: Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: [true, "You must provide the title of the song"],
        max: [80, "You pass the max of 80 characters"],
        index: true
    },
    artist: {
        type: String,
        required: [true, "You must provide the artist of the album"],
        index: true
    },
    feat: [{
        type: String,
        required: false,
        max: [100, "You pass the max of 100 characters"],
        ref: "users"
    }],
    file: {
        public_id:{
            type: String,
            required: [true, "You need to add a file with public id"]
        },
        secure_url:{
            type: String,
            required: [true, "You need to add a file with secure url"]
        }
    },
    genre: [{
        type: Schema.Types.ObjectId,
        required: [false, "You must provide the genre of your song"],
        ref: 'genres'
    }],
    album: {
        type: Schema.Types.ObjectId,
        required: [true, "You must provide the album of the song"],
        max: [1, "The album could only be linked to 1 album"],
        ref: "albums",
        index: true
    },
    statistics: {
        type: Schema.Types.ObjectId,
        required: [false, "You must provide the ID of the statistics"],
        max: [1, "The statistic can be link to 1 ID only"]
    },
    status: {
        type: Number,
        default: 1
    }
});

const songModel = model('songs', songSchema);
module.exports = songModel;