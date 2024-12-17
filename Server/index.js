import express from "express";
import dotenv from "dotenv";
import blogCreatinon from "./Blogcreation.js";
import fetchRepoContent from "./githubFetcher.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  const url = "https://github.com/ViharGandhi/Link-Shorten"
  const datarr = await fetchRepoContent(url); // Await the fetching process
  const data = await blogCreatinon(datarr);
  res.json(data)

});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});





