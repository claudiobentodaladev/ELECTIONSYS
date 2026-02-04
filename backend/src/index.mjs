import express from "express";
import routes from "./routes/index.routes.mjs";
import config from "./config/general.config.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(config)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

app.use("/api", routes);