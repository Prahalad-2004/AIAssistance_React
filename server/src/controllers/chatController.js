import Message from '../models/Message.js';
import { chatCompletion } from '../services/aiClient.js';

export async function getHistory(req, res) {
  const userId = req.user.id;
  const messages = await Message.find({ userId }).sort({ createdAt: 1 }).limit(200);
  res.json({ messages });
}

export async function clearHistory(req, res) {
  const userId = req.user.id;
  await Message.deleteMany({ userId });
  res.json({ ok: true });
}

export async function sendChat(req, res) {
  try {
    const userId = req.user.id;
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] required' });
    }

    // Persist incoming user message(s)
    const docs = await Message.insertMany(
      messages.map(m => ({ userId, role: m.role, content: m.content }))
    );

    const reply = await chatCompletion(messages);

    const assistantDoc = await Message.create({ userId, role: 'assistant', content: reply });

    res.json({ reply, message: assistantDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI request failed' });
  }
}
