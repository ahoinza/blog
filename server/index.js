const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./src/app');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Connected to MongoDB Atlas.'))
  .catch((error) => console.log(error));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));
