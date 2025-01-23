# NBA

## Statistics

This platform's goal was to create an application capable of monitoring and recording NBA game statistics in real-time. To achieve this, I developed two versions of the system: one using SQL database operations, and the other using a NoSQL database, CosmosDB. In both versions, the main interface is the Command Line Interface (CLI), but in the NoSQL version, I added the option to start an API from the Command Line. Through this project, I learned about database management and creation, as well as the use of interfaces like the CLI and RESTful API. I also used the Spectre.Console.Cli library for parsing command line arguments in a stylized way.

### Projects

- **[CLI with SQL Server](CLI%20with%20SQL%20Server)**: The goal of this project was to learn how to manipulate a SQL database from scratch, using stored procedures, triggers, scripts, models, schemas, and seed data. After learning to work with the database in SSMS, I created a CLI interface using both Entity Framework for query creation and database manipulation. At the end of the project, two repositories were established: SQL (which uses raw queries) and EF (which handles operations using LINQ).

- **[WebSite and RESTful API with CosmosDB](WebSite%20with%20CosmosDB)**: The goal of this project was to manipulate a NoSQL database, specifically CosmosDB. I created a GUI interface and a RESTful API using the Microsoft Azure Cosmos library. At the end of the backend development, a repository was set up for database manipulation, and all methods were adjusted to work with generics.

- **[Next.js with CosmosDB](Next%20with%20CosmosDB)**: This project uses the power of Next.js for routing and rendering, keeping everything client-side. The application is designed to interact with CosmosDB, leveraging its NoSQL capabilities for storing and managing NBA statistics. The solution offers an optimized approach for managing data directly from the client, with CosmosDB handling all the data persistence seamlessly.
