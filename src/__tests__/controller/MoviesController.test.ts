import type { Request, Response } from "express";
import { MoviesController } from "../../controller";
import type { MoviesRepository } from "../../repository";
import { MoviesService } from "../../service";
import { movieEnum } from "../../types";

jest.mock("../../service/movies/MoviesService");

describe("MoviesController", () => {
  let moviesController: MoviesController;
  let moviesService: jest.Mocked<MoviesService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let moviesRepository: jest.Mocked<MoviesRepository>;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    moviesRepository = {
      addMovies: jest.fn(),
      addProducerAwards: jest.fn(),
      getAllMovies: jest.fn(),
      getProducerAwards: jest.fn(),
    } as any;

    moviesService = new MoviesService(
      moviesRepository,
    ) as jest.Mocked<MoviesService>;
    moviesController = new MoviesController(moviesService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAllMovies", () => {
    it("should return all movies", async () => {
      const mockMovies = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: movieEnum.YES,
        },
      ];

      moviesService.getAllMovies.mockResolvedValue(mockMovies);

      await moviesController.getAllMovies(req as Request, res as Response);

      expect(moviesService.getAllMovies).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMovies);
    });

    it("should handle errors and return 500", async () => {
      const mockError = new Error("Database error");
      moviesService.getAllMovies.mockRejectedValue(mockError);

      await moviesController.getAllMovies(req as Request, res as Response);

      expect(moviesService.getAllMovies).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch movies.",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching movies:",
        mockError,
      );
    });
  });

  describe("getProducerAwards", () => {
    it("should return producer awards", async () => {
      const mockMinAwards = [
        {
          producer: "Producer 1",
          interval: 1,
          previousWin: 2020,
          followingWin: 2021,
          type: movieEnum.MIN,
        },
      ];
      const mockMaxAwards = [
        {
          producer: "Producer 1",
          interval: 1,
          previousWin: 2020,
          followingWin: 2021,
          type: movieEnum.MAX,
        },
      ];

      moviesService.getProducerAwards.mockResolvedValueOnce(mockMinAwards);
      moviesService.getProducerAwards.mockResolvedValueOnce(mockMaxAwards);

      await moviesController.getProducerAwards(req as Request, res as Response);

      expect(moviesService.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MIN,
      );
      expect(moviesService.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MAX,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        min: mockMinAwards,
        max: mockMaxAwards,
      });
    });

    it("should return 404 if no awards are found", async () => {
      moviesService.getProducerAwards.mockResolvedValueOnce([]);
      moviesService.getProducerAwards.mockResolvedValueOnce([]);

      await moviesController.getProducerAwards(req as Request, res as Response);

      expect(moviesService.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MIN,
      );
      expect(moviesService.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MAX,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No awards found." });
    });

    it("should handle errors and return 500", async () => {
      const mockError = new Error("Service error");
      moviesService.getProducerAwards.mockRejectedValue(mockError);

      await moviesController.getProducerAwards(req as Request, res as Response);

      expect(moviesService.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MIN,
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch producer awards.",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching producer awards:",
        mockError,
      );
    });
  });
});
