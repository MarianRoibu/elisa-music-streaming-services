const cloudinary = require('cloudinary').v2;    
const {CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET} = require("../config/config");

cloudinary.config({
    // secure: true
    // cloud_name: CLOUD_NAME,
    // api_key: CLOUD_API_KEY,
    // api_secret: CLOUD_API_SECRET,
});

const uploadAlbum = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: "Home/albums"
    })
}

const uploadSong = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
        folder: "Home/songs"
    })
}

const uploadUserImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: "Home/users"
    })
}

const uploadPlaylistImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: "Home/playlists"
    })
}

module.exports = {
    uploadAlbum,
    uploadSong,
    uploadUserImage,
    uploadPlaylistImage
};