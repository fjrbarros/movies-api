import type { MovieModel } from "../../models";

export interface ValidationError {
  csvLineError: number;
  errors: string[];
}

export interface IReadCSVResponse {
  validMovies: MovieModel[];
  invalidMovies: ValidationError[];
}

export interface IFileService {
  readCSV(filePath: string): Promise<IReadCSVResponse>;
}
