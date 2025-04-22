import { Router } from "express";
import type { Database } from "sqlite";
import { MoviesController } from "../controller";
import { MoviesRepository } from "../repository";
import { MoviesService } from "../service";

export function createRoutes(db: Database): Router {
  const moviesRepository = new MoviesRepository(db);
  const moviesService = new MoviesService(moviesRepository);
  const moviesController = new MoviesController(moviesService);

  const router = Router();

  router.get("/movies", moviesController.getAllMovies.bind(moviesController));
  router.get(
    "/awards",
    moviesController.getProducerAwards.bind(moviesController),
  );

  return router;
}
