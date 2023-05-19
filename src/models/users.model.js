const { Schema, model, Types } = require("mongoose")

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is requerid']
    },
    email: {
        type: String,
        required: [true, 'The email is requerid'],
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20
    },
    img: {
        public_id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            required: true
        }
    },
    sub: {
        required: [true],
        type: String,
        unique: true
    },
    follows:[{
        type: Types.ObjectId,
        ref: "follows"
    }],
    followers: [{
        type: Types.ObjectId,
        ref: "followers"
    }],
    playlists: [{
        type: Types.ObjectId,
        ref: "playlists"
    }],
    likePlaylist: {
        type: Types.ObjectId
    },
    albums: [{
        type: Types.ObjectId,
        ref: "albums"
    }],
    genres: [{
        type: Types.ObjectId,
        ref: "genres"
    }],
    artists: [{
        type: Types.ObjectId,
        ref: "artists"
    }],
    role: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    }
})

const UserModel = model("User", UserSchema)

module.exports = UserModel