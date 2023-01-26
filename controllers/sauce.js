// importe le modèle 'sauce'
const Sauce = require('../models/sauce')
// importe le module fs(filesysteme) qui permet d'interagir avec les fichiers du systeme
const fs = require('fs')




// fonction exportée qui sert pour créer une nouvelle sauce
exports.createSauce = async (req, res, next) => {
    try {
        // const qui converti le corps de la requete en objet JS, ici l'objet qui contien les propriétés de la sauce
        const sauceObject = JSON.parse(req.body.sauce);
        // on utilise new Sauce pour créer un nouvelle objet de type sauce et ajouter les propriétés userId et imageUrl
        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId,
            // url de l'image : http + recupere l'hote de la requête (localhost) + dossier images + nom du fichier 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        // sauvegarde de la sauce dans la base de données mongoDB
        await sauce.save();
        // si aucune erreur, on renvoi un status 201 + msg
        res.status(201).json({ message: 'sauce enregistré !' });
    } // si erreur, le bloc catch s'éxecute et renvoi un status 500 + msg erreur 
    catch (error) {
        res.status(500).json({ error });
    }
}


// fonction qui modifie une sauce deja existante
exports.modifySauce = async (req, res) => {
    try {
        // instruction ternaire pour vérifier si fichier dans la requete
        const sauceObject = req.file
            ? {
                // si oui, création d'un objet sauceObject avec les propriété de l'objet json.parse(req.body.sauce) et  la propriété de imageUrl
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/${process.env.IMAGE_FOLDER
                    }/${req.file.filename}`,
            } // sinon, création d'un objet sauceObject avec les propriéte de req.body
            : { ...req.body };
        // récuperation de l'id de la sauce dans l'url
        const sauce = await Sauce.findOne({ _id: req.params.id });
        // si userId de l'auteur de la sauce n'est pas le userId de l'utilisateur connecté -> erreur status 403 + msg
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({ error: "Invalid user ID." });
        } // sinon, si auteur = utilisateur connecté 
        else {
            // Si fichier image dans la requete ET une image qu'une imageUrl est associer à la sauce
            if (req.file && sauce.imageUrl) {
                // suppression de l'image précédente associée a la sauce
                fs.unlink(`${sauce.imageUrl.split("/").slice(3).join("/")}`, () => {
                    console.log(
                        ` Image deleted : ${sauce.imageUrl}`
                    );
                });
            } // mise à jour de l'id dans l'url et dans l'objet sauceObject
            await Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            );
            // si aucune erreur
            res.status(200).json({ message: "Objet modifié." });
        }
    } // si erreur, le bloc catch est exécuté 
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};




// fonction qui permet de supprimé une sauce
exports.deleteSauce = async (req, res, next) => {
    try {
        // on récupere l'id de la sauce dans l'url
        const sauce = await Sauce.findOne({ _id: req.params.id });
        // si userId auteur n'est pas celui de l'utilisateur connecté, return erreur 401 + msg
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        // sinon, si auteur = utilisateur on recupere le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        // on le transmet comme argument a la fonction unlikePromise()
        await unlinkPromise(`images/${filename}`);
        // on supprime la sauce correspondante a l'id récupéré dans la const sauce
        await sauce.deleteOne();
        res.status(200).json({ message: 'Objet supprimé !' });

    } catch (error) {
        res.status(500).json({ error });
    }
};

// fonction utilisé pour supprimer un fichier a partir de son chemin (path)
const unlinkPromise = (path) => {
    return new Promise((resolve, reject) => {
        // methode fs.unlike pour supprimer le fichier en utilisant le chemin spécifié + call back (err) appelé une fois la suppression terminé
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};




// fonction qui permet de récupérer une sauce grace a son id 
exports.getOneSauce = async (req, res, next) => {
    try {
        // methode findOne() de mongoose pour rechercher une sauce dans la base de données grace a l'id (récup dans l'url)
        const sauce = await Sauce.findOne({ _id: req.params.id });
        // si aucune sauce
        if (!sauce) {
            return res.status(404).json({ error: "Sauce not found" });
        } // sinon on renvoi la sauce
        res.status(200).json(sauce);
    } catch (error) {
        res.status(500).json({ error });
    }
}




// fonction qui récupere toute les sauces enregistrées dans la base de donnée
exports.getAllSauces = async (req, res, next) => {
    try {
        // methode find() de mongoose pour récupérer toute les sauces
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(500).json({ error });
    }
}

