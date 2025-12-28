import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

app.get("/", (request, response) => {
    return response.status(200).send("API is working!")
})