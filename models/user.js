const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// schema d'un 'user' 
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

// verification qu'un user est unique grace a mongoose unique validator
userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)