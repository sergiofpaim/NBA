# CLI with SQL Server

## Learned

### **Database Languages and Operations**
I gained a solid understanding of SQL and its various components:

### **Database Management Skills**

I had the chance to define and modify database structures (DDL) and manipulate data through tasks like inserting, updating, and deleting records (DML). I learned how to execute queries efficiently (DQL), manage transactions (DTL), and control user permissions (DCL).

### **Architecture**
  
![Architecture Diagram](https://raw.githubusercontent.com/sergiofpaim/NBA/main/CLI%20with%20SQL%20Server/resource/img/NBASQL_architecture.png)

  This is the architecture of the first version of my system. In this version, I had the opportunity to understand how to run queries and communicate efficiently with a SQL database, using both manual mapping (DML) and Object-Relational Mapping (ORM) tools like Entity Framework. For the command-line interface, I utilized Spectre.Console.Cli to enhance the user experience. Additionally, I created scripts to automate tasks, such as setting up database objects and populating them with initial seed data. My next step will be to continue learning and expanding my skills.

### **Prerequisites**

1. **SQL Server Management Studio (SSMS)**
   - **Purpose**: A tool for managing SQL Server databases. Allows users to create and modify database structures, execute queries, and manage database objects.
   - **Download Link**: [Download SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)

2. **SQL Server Database Instance**
   - **Action**: Ensure that a SQL Server instance is installed and running. This could be SQL Server Express, Developer Edition, or any other version.

3. **Entity Framework Core**
   - **Purpose**: An object-relational mapper (ORM) for .NET that enables developers to work with a database using .NET objects.
   - **Installation**: You can add Entity Framework Core via NuGet Package Manager in Visual Studio or by using the command:
     ```bash
     dotnet add package Microsoft.EntityFrameworkCore
     ```

4. **Spectre.Console.Cli**
   - **Purpose**: A library to create beautiful command-line applications.
   - **Installation**: Add it through NuGet:
     ```bash
     dotnet add package Spectre.Console.Cli
     ```

5. **Required .NET SDK**
   - **Purpose**: Make sure you have the appropriate version of the .NET SDK installed for your project. Since you are using .NET 8, ensure that you have it installed.
   - **Download Link**: [Download .NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

6. **SQL Server Driver for .NET**
   - **Purpose**: To connect to SQL Server from your application.
   - **Installation**: Install via NuGet:
     ```bash
     dotnet add package Microsoft.Data.SqlClient
     ```

7. **Database Initialization Scripts**
   - **Action**: Create SQL scripts to set up your database schema, including tables, triggers, and stored procedures. These scripts can be executed from within SSMS or via your CLI application.
   - **Note**: Ensure these scripts are well-documented for easy understanding.

8. **Seed Data Scripts**
   - **Action**: Prepare SQL scripts or JSON files that contain the initial data to populate your tables. This can be done using INSERT statements or data seeding mechanisms provided by Entity Framework.

9. **CLI Commands Documentation**
   - **Action**: Ensure that users can access help commands by running `-h` in the CLI. This should include details on how to use each command and what parameters are required.
