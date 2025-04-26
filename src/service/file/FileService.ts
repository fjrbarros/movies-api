import csv from "csv-parser";
import fs from "node:fs";
import type { MovieModel } from "../../models";
import type {
  IFileService,
  IReadCSVResponse,
  ValidationError,
} from "./IFileService";

export class FileService implements IFileService {
  public async readCSV(filePath: string): Promise<IReadCSVResponse> {
    return new Promise((resolve, reject) => {
      const validMovies: MovieModel[] = [];
      const invalidMovies: ValidationError[] = [];
      let csvLineError = 0;

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on("data", (data) => {
          csvLineError++;
          const validation = this.validateMovie(data);
          if (validation.isValid) {
            validMovies.push({
              ...data,
              winner: this.getValidWinner(data.winner),
            });
          } else {
            invalidMovies.push({ csvLineError, errors: validation.errors });
          }
        })
        .on("end", () => resolve({ validMovies, invalidMovies }))
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  }

  private validateMovie(movie: MovieModel): {
    isValid: boolean;
    errors: string[];
  } {
    const { year, title, studios, producers } = movie;
    const errors: string[] = [];

    if (!this.validateYear(Number(year))) {
      errors.push(`Invalid year: ${year}`);
    }
    if (!this.validateNonEmptyString(title)) {
      errors.push("Title is empty or invalid");
    }
    if (!this.validateNonEmptyString(studios)) {
      errors.push("Studios is empty or invalid");
    }
    if (!this.validateNonEmptyString(producers)) {
      errors.push("Producers is empty or invalid");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateYear(year: number): boolean {
    return !Number.isNaN(year);
  }

  private validateNonEmptyString(value: string): boolean {
    return value.trim().length > 0;
  }

  private getValidWinner(value: string): string {
    return value.toLowerCase() === "yes" ? "yes" : "no";
  }
}
