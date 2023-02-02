const passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator()


passwordSchema
    .is().min(8)                                    // Longueur minimale du mot de passe
    .is().max(100)                                  // Longueur maximale du mot de passe
    .has().uppercase()                              // Au moins une majuscule
    .has().lowercase()                              // Au moins une minuscule
    .has().digits()                                 // Au moins un chiffre
    .has().not().spaces();                         // Pas d'espaces

module.exports = (req, res, next) => {
    const password = req.body.password
    if (!passwordSchema.validate(password)) {
        return res.status(401).json({ error: 'Le mot de passe est invalide' })
    }
    next()
}
