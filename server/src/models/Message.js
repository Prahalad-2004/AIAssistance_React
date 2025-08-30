import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
