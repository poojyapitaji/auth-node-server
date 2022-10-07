require('dotenv').config();

const corsOptions = {
    origin: (origin, callback) => {
        if ((process.env.ALLOWED_ORIGINS.split(',')).indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;