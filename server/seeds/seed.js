const sequelize = require('../config/connection');
const POI = require('../models/POI');

const poiData = [
  { name: 'Education Hub', description: '12-acre woodland learning, therapeutic sessions, forest school.', category: 'Education', x_pos: 40, y_pos: 45 },
  { name: 'Therapy Glade', description: 'Quiet space for nature-based therapy and mindfulness.', category: 'Therapy', x_pos: 65, y_pos: 35 },
  { name: 'Wildlife Corridor', description: 'Protected area for local Essex bird species and deer.', category: 'Environment', x_pos: 60, y_pos: 60 }
];

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await POI.bulkCreate(poiData);
  console.log('Woodland Seeded!');
  process.exit(0);
};

seedDatabase();