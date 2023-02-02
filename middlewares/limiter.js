const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 60000,
    max: 3,
});

module.exports = limiter;