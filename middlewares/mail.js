const validator = require('validator')


const validEmail = (req, res, next) => {
    const mail = req.body.email
    console.log(mail)
    if (!validator.isEmail(mail)) {
        return res.status(400).json({ error: `L'adresse email : "${mail}" n'est pas valide. Veuillez réessayer` })
    } else {
        next()
    }
}

module.exports = validEmail