import type { MovieModel, ProducerAwardModel } from "../../models";

export interface IMoviesService {
  createMoviesByCsv(filePath: string): Promise<void>;
  getAllMovies(): Promise<MovieModel[]>;
  getProducerAwards(type: string): Promise<ProducerAwardModel[]>;
}
