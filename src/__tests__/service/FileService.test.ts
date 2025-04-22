import fs from "node:fs";
import { FileService } from "../../service/file/FileService";

jest.mock("node:fs");
jest.mock("csv-parser");

describe("FileService", () => {
  let fileService: FileService;

  beforeEach(() => {
    fileService = new FileService();
  });

  describe("readCSV", () => {
    it("should read CSV file and return valid and invalid movies", async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: "yes",
        },
        {
          year: "invalid",
          title: "",
          studios: "Studio 2",
          producers: "Producer 2",
          winner: "no",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          if (event === "error") {
            callback(new Error("Stream error"));
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
      expect(result.validMovies).toEqual([
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: "yes",
        },
      ]);
      expect(result.invalidMovies).toEqual([
        {
          csvLineError: 2,
          errors: ["Invalid year: invalid", "Title is empty or invalid"],
        },
      ]);
    });

    it("should handle error when reading CSV file", async () => {
      const mockFilePath = "path/to/movies.csv";

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "error") {
            callback(new Error("Stream error"));
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      await expect(fileService.readCSV(mockFilePath)).rejects.toThrow(
        "Stream error",
      );
    });
  });

  describe("validateMovie", () => {
    it("should validate a valid movie", async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: "yes",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies).toEqual([
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: "yes",
        },
      ]);
      expect(result.invalidMovies).toEqual([]);
    });

    it("should validate an invalid movie", async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "invalid",
          title: "",
          studios: "Studio 2",
          producers: "Producer 2",
          winner: "no",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies).toEqual([]);
      expect(result.invalidMovies).toEqual([
        {
          csvLineError: 1,
          errors: ["Invalid year: invalid", "Title is empty or invalid"],
        },
      ]);
    });

    it("should validate movie with empty studios", async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 2",
          studios: "",
          producers: "Producer 2",
          winner: "no",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies).toEqual([]);
      expect(result.invalidMovies).toEqual([
        {
          csvLineError: 1,
          errors: ["Studios is empty or invalid"],
        },
      ]);
    });

    it("should validate movie with empty producers", async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 3",
          studios: "Studio 3",
          producers: "",
          winner: "no",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies).toEqual([]);
      expect(result.invalidMovies).toEqual([
        {
          csvLineError: 1,
          errors: ["Producers is empty or invalid"],
        },
      ]);
    });
  });

  describe("getValidWinner", () => {
    it('should return "yes" for "yes"', async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 1",
          studios: "Studio 1",
          producers: "Producer 1",
          winner: "yes",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies[0].winner).toBe("yes");
    });

    it('should return "no" for "no"', async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 2",
          studios: "Studio 2",
          producers: "Producer 2",
          winner: "no",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies[0].winner).toBe("no");
    });

    it('should return "no" for other values', async () => {
      const mockFilePath = "path/to/movies.csv";
      const mockData = [
        {
          year: "2020",
          title: "Movie 2",
          studios: "Studio 2",
          producers: "Producer 2",
          winner: "other",
        },
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (
          this: any,
          event: string,
          callback: Function,
        ) {
          if (event === "data") {
            for (const data of mockData) {
              callback(data);
            }
          }
          if (event === "end") {
            callback();
          }
          return this;
        }),
      };

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = await fileService.readCSV(mockFilePath);

      expect(result.validMovies[0].winner).toBe("no");
    });
  });
});
