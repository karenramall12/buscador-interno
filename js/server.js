import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';



app.post('/chatgpt', async (req, res) => {
    console.log("📩 Recebendo requisição para ChatGPT...");
    const { message } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: message }]
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API da OpenAI: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ response: data.choices[0].message.content }); // <- Aqui está corrigido!

    } catch (error) {
        console.error('🔥 ERRO AO ACESSAR A OPENAI:', error);
        res.status(500).json({ error: 'Erro ao acessar a API da OpenAI' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});
