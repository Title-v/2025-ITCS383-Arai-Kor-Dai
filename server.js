const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Routes
app.use('/api/users',         require('./routes/users'));        // register, login
app.use('/api/user',          require('./routes/users'));        // dashboard calls /api/user/profile/:id and /api/user/stats/:id
app.use('/api/shipments',     require('./routes/shipments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/activity',      require('./routes/activity'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));