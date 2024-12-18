import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv'
dotenv.config()
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API, // defaults to process.env["ANTHROPIC_API_KEY"]
  });
export default async function blogCreatinon(projectFiles) {
    const blogPrompt = `You are an expert technical blog writer. Analyze the following project files and generate a comprehensive, engaging technical blog post.
  
    Project Files: ${JSON.stringify(projectFiles, null, 2)}
    
    Guidelines for the blog post:
    1. Provide a clear project overview
    2. Highlight key technologies and frameworks used
    3. Explain the project's architecture
    4. Discuss interesting code patterns or challenges
    5. Write in a professional yet conversational tone
    6. Include potential use cases or real-world applications
    7. Suggest potential future improvements or extensions
    
    Please generate a blog post that would be compelling for developers and technical readers.`
   
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', 
      max_tokens:4000,
      messages: [{ 
        role: 'user', 
        content: blogPrompt 
      }]
  })  
  for (const block of response.content) {
    if (block.type === 'text') {
       
        return block.text; // Or just return the text
    }
  }
   
  
}