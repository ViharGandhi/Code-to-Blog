import express from "express";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import Anthropic  from "@anthropic-ai/sdk";
dotenv.config();

const app = express();
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN // Use the token from the .env file
});

const PORT = process.env.PORT;
const datarr = [];

// Allowed file extensions


// Directories to ignore
const IGNORED_DIRECTORIES = [
  'node_modules',
  '.git',
  'tests',
  '__pycache__',
  'test',
  'docs',
  'images',
  'assets'
];

app.get("/", async (req, res) => {
  await fetchRepoContent(); // Await the fetching process
  const data = await IntialSummary();
  res.json(data)
 
});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API, // defaults to process.env["ANTHROPIC_API_KEY"]
});

async function IntialSummary() {
  const blogPrompt = `You are an expert technical blog writer. Analyze the following project files and generate a comprehensive, engaging technical blog post.

  Project Files: ${JSON.stringify(datarr, null, 2)}
  
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
    model: 'claude-3-5-haiku-latest', // Latest Claude model as of July 2024
    max_tokens:4000,
    messages: [{ 
      role: 'user', 
      content: blogPrompt 
    }]
})  
  return response

}
async function fetchRepoContent(path = "") {
  const owner = "ViharGandhi"; // GitHub username or organization name
  const repo = "Link-Shorten"; // Repository name 

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    // Create an array of promises for each item in the directory
    const fetchPromises = data.map(async (item) => {
      const itemPath = path ? `${path}/${item.name}` : item.name;

      // Check if directory should be ignored
      if (IGNORED_DIRECTORIES.some(dir => itemPath.includes(dir))) {
        return;
      }

      if (item.type === "file") {
        // Get file extension
        const fileExtension = itemPath.slice(itemPath.lastIndexOf('.')).toLowerCase();

        // Check if file extension is allowed


        // If the item is a file, fetch and store its content
        console.log(`Fetching content of file: ${itemPath}`);
        const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/main/${itemPath}`);
        const object = {
          File: itemPath,
          content: response.data,
        };
        datarr.push(object); // Add the object to the array
      } else if (item.type === "dir") {
        // If the item is a directory, recursively fetch its contents
        console.log(`Entering directory: ${itemPath}`);
        await fetchRepoContent(itemPath); // Await the recursive call
      }
    });

    // Wait for all the promises to resolve
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error("Error fetching content:", error);
  }
}

export default app;