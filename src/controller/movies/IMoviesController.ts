import type { Request, Response } from "express";

export interface IMoviesController {
  getAllMovies(req: Request, res: Response): Promise<void>;
  getProducerAwards(req: Request, res: Response): Promise<void>;
}
