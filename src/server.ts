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

    console.log("Initializing database and loading CSV data...");
    await moviesService.createMoviesByCsv(moviesCSVPath);
    console.log("Database initialized and CSV data loaded.");

    const routes = createRoutes(db);
    app.use("/v1", routes);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to initialize the application:", error);
    process.exit(1);
  });
