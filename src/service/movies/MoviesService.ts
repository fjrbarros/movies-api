import { FileService } from "../";
import type { MovieModel, ProducerAwardModel } from "../../models";
import type { MoviesRepository } from "../../repository";
import { movieEnum } from "../../types";
import type { IMoviesService } from "./IMoviesService";

export class MoviesService implements IMoviesService {
  private moviesRepository: MoviesRepository;
  private fileService: FileService;

  constructor(moviesRepository: MoviesRepository, fileService?: FileService) {
    this.moviesRepository = moviesRepository;
    this.fileService = fileService || new FileService();
  }

  public async createMoviesByCsv(filePath: string): Promise<void> {
    if (!filePath) {
      throw new Error("CSV file path is required");
    }

    const { validMovies, invalidMovies } =
      await this.fileService.readCSV(filePath);

    if (invalidMovies.length) {
      console.log("Invalid file data");
      console.table(
        invalidMovies.map((invalid) => ({
          "CSV line": invalid.csvLineError,
          errors: invalid.errors.join(", "),
        })),
      );
    }

    await this.moviesRepository.addMovies(validMovies);

    await this.calculateAndStoreProducerAwards(validMovies);
  }

  private async calculateAndStoreProducerAwards(
    movies: MovieModel[],
  ): Promise<void> {
    const producerWins: { [key: string]: number[] } = {};

    for (const movie of movies) {
      if (movie.winner === movieEnum.YES) {
        const producers = movie.producers.split(",").map((p) => p.trim());
        for (const producer of producers) {
          if (!producerWins[producer]) {
            producerWins[producer] = [];
          }
          producerWins[producer].push(Number.parseInt(movie.year, 10));
        }
      }
    }

    const producerAwards = [];
    for (const producer in producerWins) {
      const wins = producerWins[producer].sort((a, b) => a - b);
      for (let i = 1; i < wins.length; i++) {
        const interval = wins[i] - wins[i - 1];
        producerAwards.push({
          producer,
          interval,
          previousWin: wins[i - 1],
          followingWin: wins[i],
          type: movieEnum.MIN,
        });
        producerAwards.push({
          producer,
          interval,
          previousWin: wins[i - 1],
          followingWin: wins[i],
          type: movieEnum.MAX,
        });
      }
    }

    const minInterval = Math.min(...producerAwards.map((a) => a.interval));
    const maxInterval = Math.max(...producerAwards.map((a) => a.interval));

    const minAwards = producerAwards.filter((a) => a.interval === minInterval);
    const maxAwards = producerAwards.filter((a) => a.interval === maxInterval);

    await this.moviesRepository.addProducerAwards(minAwards);
    await this.moviesRepository.addProducerAwards(maxAwards);
  }

  public async getAllMovies(): Promise<MovieModel[]> {
    return this.moviesRepository.getAllMovies();
  }

  public async getProducerAwards(type: string): Promise<ProducerAwardModel[]> {
    const data = await this.moviesRepository.getProducerAwards(type);

    return data.map(
      ({
        producer,
        interval,
        previousWin,
        followingWin,
      }: ProducerAwardModel) => ({
        producer,
        interval,
        previousWin,
        followingWin,
      }),
    );
  }
}
