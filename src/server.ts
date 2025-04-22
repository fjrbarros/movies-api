import express from "express";
import { moviesCSVPath } from "../public";
import { initializeDatabase } from "./database";
import { MoviesRepository } from "./repository";
import { createRoutes } from "./routes";
import { MoviesService } from "./service";

const app = express();
app.use(express.json());

initializeDatabase()
  .then(async (db) => {
    const moviesRepository = new MoviesRepository(db);
    const moviesService = new MoviesService(moviesRepository);

    await moviesService.createMoviesByCsv(moviesCSVPath);

    const routes = createRoutes(db);
    app.use("/v1", routes);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(console.error);
