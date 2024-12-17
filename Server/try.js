import axios  from "axios";
const res = await axios.get("https://raw.githubusercontent.com/ViharGandhi/python-project/main/Project.py")
console.log(res.data)