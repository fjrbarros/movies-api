import type { Request, Response } from "express";
import type { MoviesService } from "../../service";
import { movieEnum } from "../../types";
import type { IMoviesController } from "./IMoviesController";

export class MoviesController implements IMoviesController {
  private moviesService: MoviesService;

  constructor(moviesService: MoviesService) {
    this.moviesService = moviesService;
  }

  public async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const movies = await this.moviesService.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Failed to fetch movies." });
    }
  }

  public async getProducerAwards(req: Request, res: Response): Promise<void> {
    try {
      const minAwards = await this.moviesService.getProducerAwards(
        movieEnum.MIN,
      );
      const maxAwards = await this.moviesService.getProducerAwards(
        movieEnum.MAX,
      );

      if (!minAwards.length && !maxAwards.length) {
        res.status(404).json({ message: "No awards found." });
        return;
      }

      res.status(200).json({
        min: minAwards,
        max: maxAwards,
      });
    } catch (error) {
      console.error("Error fetching producer awards:", error);
      res.status(500).json({ message: "Failed to fetch producer awards." });
    }
  }
}
