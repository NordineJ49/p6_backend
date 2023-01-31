

// import des modules

// module de chiffrement de mdp
const bcrypt = require('bcrypt')
// module qui genere et verifie des token
const jwt = require('jsonwebtoken')
// schema user
const User = require('../models/user')




// fonction pour enregistrer un new user dans la base de données
exports.signup = async (req, res, next) => {
    try {
        // hash le mdp reçu
        const hash = await bcrypt.hash(req.body.password, 10)
        // creer objet user avec l'email fourni et hash pour le mdp 
        const user = new User({
            email: req.body.email,
            password: hash
        })
        // on enregistre le use dans la base de données avec la methode save de mongoose
        await user.save()
        res.status(201).json({ message: 'utilisateur créé !' })
    } catch (error) {
        res.status(500).json({ error })
    }
}




// fonction qui sert a l'authentification d'un user
exports.login = async (req, res, next) => {
    try {
        // on cherche le user dans la base de donnée pour verifier qu'il existe
        const user = await User.findOne({ email: req.body.email })
        // si pas de user a cette adresse email
        if (!user) {
            return res.status(401).json({ message: 'utilisateur non trouvé' })
        }
        // sinon on compare le mdp fourni avec le mdp hashé et enregistré dans la base de données
        const valid = await bcrypt.compare(req.body.password, user.password)
        // si ils ne sont pas identiques, erreur
        if (!valid) {
            return res.status(401).json({ message: 'mot de passe incorrecte' })
        }
        // si user trouvé et mdp ok , on genere un token avec le user id pour une durée de 24h
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}
