import type { Database } from "sqlite";
import type { MovieModel, ProducerAwardModel } from "../../models";

export class MoviesRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public async addMovies(movies: MovieModel[]): Promise<void> {
    const insertStatement =
      "INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)";
    for (const movie of movies) {
      const { year, title, studios, producers, winner } = movie;
      await this.db.run(
        insertStatement,
        year,
        title,
        studios,
        producers,
        winner,
      );
    }
  }

  public async getAllMovies(): Promise<MovieModel[]> {
    return this.db.all("SELECT * FROM movies");
  }

  public async addProducerAwards(
    producerAwards: ProducerAwardModel[],
  ): Promise<void> {
    const insertStatement =
      "INSERT INTO producer_awards (producer, interval, previousWin, followingWin, type) VALUES (?, ?, ?, ?, ?)";
    for (const award of producerAwards) {
      const { producer, interval, previousWin, followingWin, type } = award;
      await this.db.run(
        insertStatement,
        producer,
        interval,
        previousWin,
        followingWin,
        type,
      );
    }
  }

  public async getProducerAwards(type: string): Promise<ProducerAwardModel[]> {
    return this.db.all("SELECT * FROM producer_awards WHERE type = ?", type);
  }
}
