import express from "express";
import dotenv from "dotenv";
import blogCreatinon from "./Blogcreation.js";
import fetchRepoContent from "./githubFetcher.js";
import cors from 'cors'
import bodyParser from "body-parser";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json())
const PORT = process.env.PORT;

app.post("/blog-creation", async (req, res) => {
  const {url,importantFiles} = req.body

  
  try{
    const datarr = await fetchRepoContent(url,importantFiles); 
    const data = await blogCreatinon(datarr);
 
    res.status(200).json(data)
  
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Something went wrong"})
  }

});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});





