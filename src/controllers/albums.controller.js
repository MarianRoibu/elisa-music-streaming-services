const { albumModel, songModel, UserModel } = require("../models");
const fs = require("fs-extra");
const { uploadAlbum } = require("../utils/cloudinary");


const albumController = {
    getAllAlbum: async (req, res) => {
        try {
            const albums = await albumModel
                .find(
                    {
                        status: 1
                    }
                )
                .sort(
                    { _id: -1 }
                )
                .populate("songs")
                .limit(6);

            if (!albums) {
                res.status(404).send({
                    status: false,
                    msg: "We couldn't find albums",
                });
                return;
            }
            res.status(200).send(albums);
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            });
        }
    },
    getById: async (req, res) => {
        try {
            const albumId = req.params.id
            const album = await albumModel
                .findOne({
                    _id: albumId,
                    status: 1
                })
                .populate("songs")
                .lean()
                .exec();

            if (!album) {
                return res.status(404).send({
                    status: false,
                    msg: `album ${albumId} not found`
                })
            }
            res.status(200).send({
                status: true,
                msg: "Album found it",
                data: album
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            })
        }
    },
    getManyById: async (req, res) => {
        const { params: { ids } } = req;

        const arrayId = ids.split(",");

        try {
            const album = await albumModel
                .find({
                    _id: {
                        $in: arrayId
                    },
                    status: 1
                })
                .sort({
                    _id: -1
                })
                .lean()
                .exec();

            if (album.length < 1) {
                res.status(404).send({
                    status: false,
                    msg: "We couldn't find albums"
                });
                return;
            }

            res.status(200).send({
                status: true,
                msg: "We find albums",
                data: album
            })
        } catch (err) {
            res.status(503).send({
                status: false,
                msg: err.message
            })
        }
    },
    getByTitle: async (req, res) => {
        try {
            const albumTitle = req.params.title;
            const album = await albumModel
                .find({
                    title: albumTitle,
                    status: 1
                })
                .populate({
                    path: "songs",
                    populate: "album"
                });

            if (!album) {
                return res.status(404).send({
                    status: false,
                    msg: `Album with title "${albumTitle}" not found`,
                });
            }

            res.status(200).send({
                status: true,
                msg: "Album found",
                data: album,
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            });
        }
    },
    getByTitle: async (req, res) => {
        try {
            const albumTitle = req.params.title;
            const album = await albumModel
                .find({
                    "title": {
                        "$regex": albumTitle,
                        "$options": "i"
                    },
                    status: 1
                })
                .populate({
                    path: "songs",
                    populate: "album"
                });

            if (album.length <= 0) {
                return res.status(404).send({
                    status: false,
                    msg: `Album with title "${albumTitle}" not found`,
                });
            }

            res.status(200).send({
                status: true,
                msg: "Album found",
                data: album,
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            });
        }
    },
    createAlbum: async (req, res) => {
        const { body, files } = req
        if (!files.img) {
            res.status(409).send({
                status: false,
                msg: "You need to add a image",
            })
            return;
        }
        try {
            const { public_id, secure_url } = await uploadAlbum(files.img.tempFilePath)
            await fs.unlink(files.img.tempFilePath)

            const newAlbum = await albumModel.create({
                ...body,
                img: { public_id, secure_url }
            });
            const addAlbumToUser = await UserModel.findByIdAndUpdate(
                { _id: body.owner },
                { "$addToSet": { albums: newAlbum._id } },
                { new: true }
            );

            res.status(201).send({
                status: true,
                msg: "We create a new album",
                data: newAlbum,
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            })
        }
    },
    updateAlbum: async (req, res) => {
        try {
            const albumId = req.params.id

            const updatedAlbum = await albumModel.findByIdAndUpdate(
                albumId,
                req.body,
                { new: true },
            )
            res.status(201).send({
                status: true,
                msg: "Album update",
                data: updatedAlbum,
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            })
        }
    },
    
    deleteAlbum: async (req, res, next) => {
        const { id: albumId } = req.params;
        const { userId } = req.body;

        try {
            const deletedAlbum = await albumModel
                .findOneAndUpdate(
                    {
                        _id: albumId,
                        owner: userId
                    },
                    {
                        status: 0
                    }
                )

            if (!deletedAlbum) {
                return res.status(404).send({
                    status: false,
                    msg: `We can't delete the album`
                });
            }

            const user = await UserModel
                .findOneAndUpdate(
                    {
                        _id: userId
                    },
                    {
                        "$pull": { albums: albumId }
                    },
                    {
                        new: true
                    }
                )

            res.locals.user = user;

            next();
        } catch (err) {
            res.status(500).send({
                status: false,
                msg: err.message,
            })
        }
    },
    deleteManyAlbums: async (req, res) => {
        try {
            const { title } = req.params
            const titleRegex = new RegExp(`${title}`)
            const albumToDelete = await albumModel.find()
            const deletedAlbum = await albumModel.deleteMany(

            )
            if (!deletedAlbum) {
                return res.status(404).send({
                    status: false,
                    msg: `album ${albumId} not found`
                });
            }

            albumToDelete.map(async album => {
            })

            await songModel.deleteMany();

            res.status(200).send({
                status: true,
                msg: "Album and related songs deleted",
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                msg: error,
            })
        }
    }
}



module.exports = { albumController }