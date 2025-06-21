import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors()); // Allows all origins – use with caution
app.use(express.json());

interface GenerateRequestBody {
  topic: string;
}

app.get('/', (_req, res) => {
  res.send('Hello World! 🌍');
});

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.post('/generate', (async (req: Request, res: Response) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `Give me a fun idea about: ${topic}` }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const idea = response.data.choices[0].message.content;
    res.json({ idea });
  } catch (error: unknown) {
    console.error((error as Error).message);
    res.status(500).json({ error: 'OpenAI API error' });
  }
}) as express.RequestHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
