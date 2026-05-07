// server/api/chat/select-model.post.ts
export default defineEventHandler(async (event) => {
  const { message, detectedLanguage } = await readBody(event)
  
  // Select model based on language
  let selectedModel = 'qwen/qwen-3.5-max' // default
  
  if (detectedLanguage === 'km') {
    // Khmer language - use best multilingual models
    selectedModel = 'qwen/qwen-3.5-max'
  } else if (detectedLanguage === 'en') {
    // English - can use more cost-effective options
    selectedModel = 'meta-llama/llama-4-scout'
  }
  
  return { model: selectedModel }
})