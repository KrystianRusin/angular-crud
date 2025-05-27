const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');
const app = express();

app.use(bodyParser.json());
app.use(cors())
app.use('/api/products', productsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));