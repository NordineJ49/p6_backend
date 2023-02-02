const passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator()

passwordSchema
    .is().min(8)                                    // Longueur minimale du mot de passe
    .is().max(20)                                  // Longueur maximale du mot de passe
    .has().uppercase(1)                              // Au moins une majuscule
    .has().lowercase()                              // Au moins une minuscule
    .has().digits(1)                                 // Au moins un chiffre
    .has().symbols()                                // Au moins un symbole
    .has().not().spaces()                           // Pas d'espaces
    .is().not().oneOf(['Password123', 'Passw0rd', 'Motdepasse123'])        // mot de passe blacklisté

const isValidPassword = (req, res, next) => {
    const password = req.body.password
    console.log(password)
    if (!passwordSchema.validate(password)) {
        return res.status(400).json({ error: "Le mot de passe n'est pas valide. Veuillez réessayer" })
    }
    next()
}

module.exports = isValidPassword