import OpenAI from 'openai';

export const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || 'demo-key'
});
