import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors()); // Allows all origins – use with caution

app.get('/', (_req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
