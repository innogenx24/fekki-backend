// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');

const path = require('path');
const cron = require('node-cron');

const { authMiddleware } = require('./middlewares/authMiddleware');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const consumerRoutes = require('./routes/consumerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const customerRoutes = require('./routes/customerRoutes');
const roleRoutes = require('./routes/roleRoutes');
const deportmentRoutes = require('./routes/deportmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const branchRoutes = require('./routes/branchRoutes');
const productTypeRoutes = require('./routes/productTypeRoutes');





const app = express();
const port = process.env.PORT || 3002;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});



-app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/department', deportmentRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/sub-category', subCategoryRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/product-type', productTypeRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
