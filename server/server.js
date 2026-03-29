const express = require('express');
const cors = require('cors');
const sequelize = require('./config/connection');
const POI = require('./models/POI');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/pois', async (req, res) => {
  const pois = await POI.findAll();
  res.json(pois);
});

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});