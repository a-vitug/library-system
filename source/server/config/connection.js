const mongoose = require('mongoose');

mongoose.connect( 'mongodb+srv://noteful-app:notefulclone123@noteful-app.fthcj.mongodb.net/test',
    process.env.MONGO_URI || 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

module.exports = mongoose.connection;