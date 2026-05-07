export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { messages, userContext } = body
  
  // Fetch gallery context from your Django backend
  const galleryContext = await $fetch('https://your-django-api.com/api/gallery/context', {
    params: {
      user_agent: event.headers['user-agent'],
      referer: event.headers.referer
    }
  })

  const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': event.headers.referer || 'https://ramagallery.com',
      'X-Title': 'RamaGallery AI Assistant'
    },
    body: {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for RamaGallery. Context: ${JSON.stringify(galleryContext)}. 
          Help visitors with gallery content, artworks, and engagement features.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    }
  })

  return response
})

// 📊 Model Comparison for Khmer
// Model	Khmer Support	Quality	Speed	Cost
// Qwen 3.5 Max	⭐⭐⭐⭐⭐ Native	Excellent	Fast	$$
// Llama 4 Maverick	⭐⭐⭐⭐ Good	Excellent	Medium	$$
// Gemini 2.5 Pro	⭐⭐⭐⭐ Good	Excellent	Fast	Free tier
// Mistral Saba	⭐⭐⭐ Fair	Good	Fast	$