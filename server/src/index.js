import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

(async () => {
  await connectDB();
  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
})();
