# WebSite with CosmosDB

### **Learned**

#### **Database Languages and Operations**
In this project, I dove deep into NoSQL database management, specifically working with Azure Cosmos DB. I learned how to effectively structure and manipulate data in a document-oriented environment, focusing on essential operations like creating, reading, updating, and deleting documents. Building a RESTful API allowed me to create smooth interactions with the Cosmos DB, making it easy to retrieve and manage data. I also enjoyed developing a CLI interface, which improved user interaction with the database. Throughout this experience, I became more comfortable using the Microsoft.Azure.Cosmos library, which helped me work with generics for flexible data handling. I gained valuable skills in deploying and managing Azure resources, deepening my understanding of cloud computing principles and best practices. Additionally, I learned how to create an application using React in TypeScript, with 

### **Prerequisites**

1. **Microsoft Azure Cosmos DB Account**
   - **Purpose**: An Azure service for NoSQL databases that supports various APIs, including SQL (Core), MongoDB, Cassandra, and others.
   - **Action**: Set up a Cosmos DB account through the Azure portal. Ensure you have the necessary connection strings and keys for authentication.

2. **Azure Storage Account (Optional)**
   - **Purpose**: If your application requires storage for files or blobs, an Azure Storage account may be necessary.
   - **Action**: Create a storage account in Azure if your application design includes using Azure Blob Storage or other storage services.

3. **.NET SDK**
   - **Purpose**: Ensure you have the .NET SDK installed to develop and run your web application.
   - **Download Link**: [Download .NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

4. **Microsoft.Azure.Cosmos Library**
   - **Purpose**: A client library to interact with Azure Cosmos DB.
   - **Installation**: Add it via NuGet Package Manager in Visual Studio or by using the command:
     ```bash
     dotnet add package Microsoft.Azure.Cosmos
     ```

5. **Entity Framework Core (Optional)**
   - **Purpose**: If you're using EF Core for data access with Cosmos DB, this ORM can simplify database operations.
   - **Installation**: Add EF Core via NuGet:
     ```bash
     dotnet add package Microsoft.EntityFrameworkCore
     dotnet add package Microsoft.EntityFrameworkCore.Cosmos
     ```

6. **ASP.NET Core Framework**
   - **Purpose**: Ensure you have the ASP.NET Core framework installed for building your RESTful API.
   - **Action**: You can create a new ASP.NET Core project using Visual Studio or the command line.

7. **Postman or Similar API Testing Tool**
   - **Purpose**: To test your RESTful API endpoints.
   - **Action**: Download Postman or any similar tool to send requests and verify your API functionality.

8. **IDE (Integrated Development Environment)**
   - **Purpose**: Use an IDE such as Visual Studio, Visual Studio Code, or JetBrains Rider for development.
   - **Download Links**:
     - [Visual Studio](https://visualstudio.microsoft.com/)
     - [Visual Studio Code](https://code.visualstudio.com/)

9. **Documentation and API Specification**
   - **Action**: Prepare documentation for your API endpoints, including request and response formats, error handling, and usage examples.

10. **CLI Commands Documentation**
    - **Action**: Ensure that users can access help commands by executing commands in the CLI. Include details on how to use each command and what parameters are required.