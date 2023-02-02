const validator = require('validator')


module.exports = (req, res, next) => {
    const mail = req.body.email
    if (!validator.isEmail(mail)) {
        return res.status(400).json({ error: `L'adresse email : "${mail}" n'est pas valide. Veuillez réessayer` })
    } else {
        next()
    }
}

