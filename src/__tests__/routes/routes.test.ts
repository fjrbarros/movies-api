import type { Database } from "sqlite";
import { MoviesController } from "../../controller/movies/MoviesController";
import { MoviesRepository } from "../../repository/movies/MoviesRepository";
import { createRoutes } from "../../routes";
import { MoviesService } from "../../service/movies/MoviesService";

jest.mock("express", () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock("../../controller/movies/MoviesController");
jest.mock("../../repository/movies/MoviesRepository");
jest.mock("../../service/movies/MoviesService");

describe("createRoutes", () => {
  let db: Database;

  beforeEach(() => {
    db = {} as Database;
  });

  it("should create routes and bind controller methods", () => {
    const mockMoviesRepository = new MoviesRepository(
      db,
    ) as jest.Mocked<MoviesRepository>;
    const mockMoviesService = new MoviesService(
      mockMoviesRepository,
    ) as jest.Mocked<MoviesService>;
    new MoviesController(mockMoviesService) as jest.Mocked<MoviesController>;

    createRoutes(db);

    expect(MoviesRepository).toHaveBeenCalledWith(db);
    expect(MoviesService).toHaveBeenCalledWith(mockMoviesRepository);
    expect(MoviesController).toHaveBeenCalledWith(mockMoviesService);
  });
});
