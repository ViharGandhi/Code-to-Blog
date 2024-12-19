import { Octokit } from "@octokit/rest";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

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

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

let datarr = [];

function extractRepoDetails(url) {
    const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);
    
    if (match && match.length === 3) {
        const username = match[1];
        const repoName = match[2];
        return { username, repoName };
    } else {
        throw new Error("Invalid GitHub URL format.");
    }
}

export default async function fetchRepoContent(url, filesArray, path = "") {
    const { username, repoName } = extractRepoDetails(url);
    const owner = username;
    const repo = repoName;

    try {
        const { data } = await octokit.repos.getContent({
            owner: username,
            repo: repoName,
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
                // Only fetch content if the file is in the filesArray
                if (filesArray.includes(itemPath)) {
                    console.log(`Fetching content of file: ${itemPath}`);
                    const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/main/${itemPath}`);
                    const object = {
                        File: itemPath,
                        content: response.data,
                    };
                    datarr.push(object);
                }
            } else if (item.type === "dir") {
                console.log(`Entering directory: ${itemPath}`);
                // Pass the filesArray to the recursive call
                await fetchRepoContent(url, filesArray, itemPath);
            }
        });

        // Wait for all the promises to resolve
        await Promise.all(fetchPromises);

        // Return the datarr after all iterations are complete
        return datarr;
    } catch (error) {
        console.error("Error fetching content:", error);
        throw error;
    }
}