
# Movie Management Project - API

This project is a Node.js application using the Express framework to manage a movie database (in memory). The application allows you to initialize the database, import movies from a CSV file, and configure routes to manipulate the data.

## Documentation
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [How to Run the Project](#how-to-run-the-project)
- [More about the project](#more-about-the-project)
- [Test and Coverage](#test-and-coverage) 
 
## Project Structure
```
├── src
│   ├── routes
│   ├── controller
│   ├── service
│   ├── repository
│   ├── models
│   ├── database
│   ├── __tests__
│   └── server.ts
├── public
│   └── assets
│       └── movielist.csv
├── jest.config.js
├── tsconfig.json
├── biome.json
├── package.json
└── README.md
```

## Technologies Used

| Tool          | Specifically |
| ------------- | ------------- |
| Node.js  | Node.js is a cross-platform JavaScript runtime environment.  |
| Express | Framework written in JavaScript that runs on the node.js environment at runtime. |
| SqLite | SQLite is a library that implements a small, fast, self-contained, highly reliable, and complete SQL database engine. |
| csv-parser | Streaming CSV parser that aims for maximum speed . |
| TypeScript | Strongly typed programming language that builds on JavaScript. |
| @biomejs/biome | Code formatter. |
| Jest | Test code. |

## How to Run the Project

PS: You need to have the [Nodejs](https://nodejs.org/en) library and the [Yarn](https://yarnpkg.com/) package manager installed.


Clone the repository

```bash
https://github.com/fjrbarros/movies-api
```

install dependencies
```bash
yarn install
```

execute the project
```bash
yarn dev
```

## More about the project

When starting the project, a csv file (movielist) is automatically read, which is located in the path: `root/public/assets/movielist.csv`. 

The data must be in the format:

```
year;title;studios;producers;winner
```
After running the project and reading the file, if everything went well you will be able to see the following log:

`Server is running on port 3000`

After that, if any data in the file is inconsistent or invalid, you will be able to see a log showing exactly which line of the csv file and what errors occurred, as shown in the following image:

ps: the first line of the csv is ignored as it is the file header.

![image](https://github.com/user-attachments/assets/98bccd75-cbb9-48a5-9fa9-07b20d9a896a)


You can also access exactly all the data in the file (valid) in the database that is in memory, just access the route: `http://localhost:3000/v1/movies`


$${\color{red}ps: \space When \space the \space application \space is \space stopped \space all \space data \space is \space lost \space since \space the \space database \space is \space only \space in \space memory}$$

you will see the data in json format as shown in the image:

![image](https://github.com/user-attachments/assets/ab345393-9500-4188-be61-0709d117b414)


You can also access the endpoint that returns the min and max award range, just access the url:
`http://localhost:3000/v1/awards`

![image](https://github.com/user-attachments/assets/e358cdee-ad3c-47e9-a21a-a7399b6322af)


## Test and Coverage

The tests for this project were developed with the aim of ensuring the integrity of data, both input and output. To this end, only the components essential to the application flow were tested, including **routes**, **controllers** and **services**. Test coverage was focused on the critical parts of the application to ensure that the main operations work correctly and that data is handled securely and consistently.

To generate a test coverage report, use the command:
```bash
yarn coverage
```

##### Result example

![image](https://github.com/user-attachments/assets/fe7da17b-8fcf-4972-be05-b047e9b7d8ce)

