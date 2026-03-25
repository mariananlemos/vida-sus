import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: {
          message: 'OPENAI_API_KEY não configurada no servidor.',
        },
      });
    }

    const { history } = req.body ?? {};
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Payload inválido. Envie "history" como array de mensagens.',
        },
      });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: history,
        max_tokens: 350,
        temperature: 0.6,
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: {
          message: data?.error?.message || `Erro OpenAI ${upstream.status}`,
        },
      });
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({
        error: {
          message: 'Resposta inválida do provedor de IA.',
        },
      });
    }

    return res.json({ content });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Falha interna no servidor.',
      },
    });
  }
});

app.listen(port, () => {
  console.log(`VidaSUS API em http://localhost:${port}`);
});
