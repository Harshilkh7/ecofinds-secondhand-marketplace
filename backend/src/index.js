const express = require('express');
const { addItem } = require('./controllers/items'); // path corrected

const app = express();
app.use(express.json());

app.post('/add-item', async (req, res) => {
  const { name, description, price } = req.body;
  await addItem(name, description, price);
  res.send('Item added successfully!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
