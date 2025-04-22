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
    const movies = await this.moviesService.getAllMovies();
    res.json(movies);
  }

  public async getProducerAwards(req: Request, res: Response): Promise<void> {
    const minAwards = await this.moviesService.getProducerAwards(movieEnum.MIN);
    const maxAwards = await this.moviesService.getProducerAwards(movieEnum.MAX);
    res.json({
      min: minAwards,
      max: maxAwards,
    });
  }
}
