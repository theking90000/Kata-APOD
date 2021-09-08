import express from "express";
import { existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { json } from "body-parser";
import cors from "cors";
import request from "request";

config({ path: resolve("../.env.local") });

const app = express();

if (existsSync(resolve("../dist"))) {
  app.use("/", express.static(resolve("../dist")));
}

app.use(json());
app.use(cors());

app.get("/api", async (req, res) => {
  request
    .get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}${
        req.query.count ? `?count=${req.query.count}` : ""
      }`
    )
    .pipe(res);
});

app.post("/api/image", async (req, res) => {
  console.log(req.body);
  if (
    req.body.url &&
    typeof req.body.url === "string" &&
    req.body.url.startsWith("https://apod.nasa.gov")
  ) {
    return request.get(req.body.url).pipe(res);
  }
  res.status(500).send("error");
});

app.listen(process.env.PORT || 8081, () =>
  console.log(`listening on ${process.env.PORT || 8081}`)
);
