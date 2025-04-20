const config = {
    OPENROUTER_API_KEY: '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',
    OPENROUTER_MODEL: 'google/gemini-2.0-flash-exp'
};

const floatingAssistant = document.getElementById('floatingAssistant');
const chatOverlay = document.getElementById('chatOverlay');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

floatingAssistant.addEventListener('click', () => {
    chatOverlay.style.display = 'flex';
    floatingAssistant.style.display = 'none';
});

closeChat.addEventListener('click', () => {
    chatOverlay.style.display = 'none';
    floatingAssistant.style.display = 'block';
});

function addMessage(message, isUser = false) {
    const messagesDiv = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function handleUserMessage(message) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Zapia Assistant',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `[System Instructions]
Você é a assistente oficial do Zapia, um poderoso chatbot para WhatsApp que utiliza inteligência artificial avançada. Sua função é esclarecer dúvidas sobre o produto e demonstrar o valor da ferramenta, destacando seus benefícios e vantagens do plano VIP.

REGRAS DE INTERAÇÃO:
• Para "oi", "olá" ou similares, responda apenas com uma saudação amigável e breve, como:
  "Olá! 👋 Como posso ajudar você hoje?"

• Só forneça informações específicas quando o usuário perguntar
• Mantenha o diálogo fluido e natural
• Faça perguntas para entender a necessidade
• Use emojis com moderação

BENEFÍCIOS PRINCIPAIS:
• Automatize seu atendimento 24/7 no WhatsApp
• Gere imagens profissionais com IA
• Crie figurinhas personalizadas
• Receba respostas por áudio com vozes naturais
• Pesquise na web em tempo real
• Integração perfeita com grupos
• Interface intuitiva e fácil de usar
• Suporte técnico especializado

FUNCIONALIDADES:
1. Conversas Naturais: Interação fluida e contextual
2. Geração de Imagens: Crie imagens realistas com IA
3. Criação de Stickers: Transforme imagens em figurinhas
4. Respostas em Áudio: Múltiplos modelos de voz disponíveis
5. Busca Web: Informações sempre atualizadas
6. Personalização: Ajuste o bot às suas necessidades

PLANOS E PREÇOS:
1. Gratuito
   • 15 interações diárias (reset à meia-noite)
   • Texto: 1 crédito
   • Áudio: 3 créditos
   • Imagens: 5 créditos
   • Figurinhas: 1 crédito

2. VIP (Oferta de Lançamento: R$29/mês)
   • Uso TOTALMENTE ilimitado
   • Sem restrição de créditos
   • Prioridade no suporte
   • Acesso a todos os recursos
   • Ideal para uso intensivo

COMANDOS ÚTEIS:
• .menu - Lista todos os comandos
• .voz - Ativa/desativa respostas em áudio
• .stk - Cria figurinhas
• .sub - Cancela ação atual

LINKS IMPORTANTES:
• Assinar VIP: https://buy.stripe.com/dR6g1t0nH3Dnati5ks
• WhatsApp: https://wa.me/5519993058462
• Instagram: https://www.instagram.com/zapia.bot
• TikTok: https://www.tiktok.com/@zap.ia

INSTRUÇÕES:
1. Seja sempre amigável e prestativa
2. Destaque os benefícios do plano VIP quando apropriado
3. Explique como o Zapia pode melhorar a experiência no WhatsApp
4. Mencione a oferta promocional de lançamento
5. Forneça exemplos práticos de uso
6. Esclareça todas as dúvidas sobre funcionalidades
7. Incentive o teste gratuito
8. Enfatize o custo-benefício do plano VIP

IMPORTANTE:
• Nunca despeje todas as informações de uma vez
• Responda apenas o que foi perguntado
• Mantenha o interesse do usuário com perguntas relevantes
• Seja concisa nas respostas iniciais
• Personalize a conversa baseada nas respostas
• Mencione benefícios específicos conforme o interesse demonstrado

[User Message]
${message}`
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('Invalid response format');
        }

        const botResponse = data.choices[0].message.content;
        addMessage(botResponse);
    } catch (error) {
        console.error('Erro detalhado:', error);
        addMessage('Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.');
    }
}

sendMessage.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        handleUserMessage(message);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
}); 