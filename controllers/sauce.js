const Sauce = require('../models/sauce')
const fs = require('fs')
const sauce = require('../models/sauce')





exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await sauce.save();
        res.status(201).json({ message: 'sauce enregistré !' });
    } catch (error) {
        res.status(500).json({ error });
    }
}





exports.modifySauce = async (req, res) => {
    try {
        const sauceObject = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/${process.env.IMAGE_FOLDER
                    }/${req.file.filename}`,
            }
            : { ...req.body };

        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({ error: "Invalid user ID." });
        } else {
            if (req.file && sauce.imageUrl) {
                fs.unlink(`${sauce.imageUrl.split("/").slice(3).join("/")}`, () => {
                    console.log(
                        ` Image deleted : ${sauce.imageUrl}`
                    );
                });
            }
            await Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            );
            res.status(200).json({ message: "Objet modifié." });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};





exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const filename = sauce.imageUrl.split('/images/')[1];
        await unlinkPromise(`images/${filename}`);
        await sauce.deleteOne();
        res.status(200).json({ message: 'Objet supprimé !' });

    } catch (error) {
        res.status(500).json({ error });
    }
};

const unlinkPromise = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};





exports.getOneSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (!sauce) {
            return res.status(404).json({ error: "Sauce not found" });
        }
        res.status(200).json(sauce);
    } catch (error) {
        res.status(500).json({ error });
    }
}





exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(500).json({ error });
    }
}

