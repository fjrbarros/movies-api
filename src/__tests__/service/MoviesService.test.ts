import type { MovieModel, ProducerAwardModel } from "../../models";
import type { MoviesRepository } from "../../repository";
import { FileService, MoviesService } from "../../service";
import { movieEnum } from "../../types";

jest.mock("../../service/file/FileService");

describe("MoviesService", () => {
  let moviesService: MoviesService;
  let moviesRepository: jest.Mocked<MoviesRepository>;
  let fileService: jest.Mocked<FileService>;

  beforeEach(() => {
    moviesRepository = {
      addMovies: jest.fn(),
      addProducerAwards: jest.fn(),
      getAllMovies: jest.fn(),
      getProducerAwards: jest.fn(),
    } as any;

    fileService = new FileService() as jest.Mocked<FileService>;

    moviesService = new MoviesService(moviesRepository, fileService);
  });

  describe("createMoviesByCsv", () => {
    it("should throw an error if filePath is not provided", async () => {
      moviesService = new MoviesService(moviesRepository);

      await expect(moviesService.createMoviesByCsv("")).rejects.toThrow(
        "CSV file path is required",
      );
    });

    it("should log invalid movies and add valid movies to repository", async () => {
      const mockFilePath = "path/to/movies.csv";
      const validMovies: MovieModel[] = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: movieEnum.YES,
        },
      ];
      const invalidMovies = [
        { csvLineError: 2, errors: ["Invalid year: invalid"] },
      ];

      fileService.readCSV.mockResolvedValue({ validMovies, invalidMovies });

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      const consoleTableSpy = jest.spyOn(console, "table").mockImplementation();

      await moviesService.createMoviesByCsv(mockFilePath);

      expect(fileService.readCSV).toHaveBeenCalledWith(mockFilePath);
      expect(consoleLogSpy).toHaveBeenCalledWith("Invalid file data");
      expect(consoleTableSpy).toHaveBeenCalledWith([
        { "CSV line": 2, errors: "Invalid year: invalid" },
      ]);
      expect(moviesRepository.addMovies).toHaveBeenCalledWith(validMovies);

      consoleLogSpy.mockRestore();
      consoleTableSpy.mockRestore();
    });

    it("should calculate and store producer awards for valid movies", async () => {
      const mockFilePath = "path/to/movies.csv";
      const validMovies: MovieModel[] = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: movieEnum.YES,
        },
        {
          year: "2021",
          title: "Movie 2",
          studios: "Studio 2",
          producers: "Producer 1",
          winner: movieEnum.YES,
        },
      ];
      const invalidMovies: any = [];

      fileService.readCSV.mockResolvedValue({ validMovies, invalidMovies });

      await moviesService.createMoviesByCsv(mockFilePath);

      const expectedAwards = [
        {
          producer: "Producer 1",
          interval: 1,
          previousWin: 2020,
          followingWin: 2021,
          type: movieEnum.MIN,
        },
        {
          producer: "Producer 1",
          interval: 1,
          previousWin: 2020,
          followingWin: 2021,
          type: movieEnum.MAX,
        },
      ];

      expect(moviesRepository.addProducerAwards).toHaveBeenCalledWith(
        expectedAwards,
      );
    });
  });

  describe("getAllMovies", () => {
    it("should return all movies from repository", async () => {
      const movies: MovieModel[] = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: movieEnum.YES,
        },
      ];
      moviesRepository.getAllMovies.mockResolvedValue(movies);

      const result = await moviesService.getAllMovies();

      expect(result).toEqual(movies);
      expect(moviesRepository.getAllMovies).toHaveBeenCalled();
    });
  });

  describe("getProducerAwards", () => {
    it("should return producer awards from repository", async () => {
      const awards: ProducerAwardModel[] = [
        {
          producer: "Producer 1",
          interval: 1,
          previousWin: 2020,
          followingWin: 2021,
          type: movieEnum.MIN,
        },
      ];
      moviesRepository.getProducerAwards.mockResolvedValue(awards);

      const result = await moviesService.getProducerAwards(movieEnum.MIN);

      expect(result).toEqual(awards);
      expect(moviesRepository.getProducerAwards).toHaveBeenCalledWith(
        movieEnum.MIN,
      );
    });
  });
});
