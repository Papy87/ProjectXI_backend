const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
//Uvoz svih ruta
const postRoutes = require('./routes/posts.route');
const commentRoutes = require('./routes/comments.route');
const userRoutes = require('./routes/users.route');
const path = require('path');

const app = express();

//Povezivanje sa Front Endom
const corsOptions = {
    origin: process.env.DB_ORIGIN,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//Parsiranje podataka sa Front End-a
app.use(bodyParser.json());

//Koriscenje Multera za slike
app.use('/images', express.static('images'))
app.use('/post', express.static('post'));


//Slusanje aplikacije
app.listen(port, () => {
    console.log(`Express Server is running at port Number:${port}`)
});

//Koriscenje ruta
app.use('', postRoutes);
app.use('', commentRoutes);
app.use('', userRoutes);





