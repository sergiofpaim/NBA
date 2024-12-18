# WebSite with CosmosDB

## Scope

### **Business Domain (Problem)**

This project focuses on managing the statistics of an NBA season, addressing two core functional requirements (use cases):

1. **Game Analysts**: Registering plays for a given player participating in a game as they occur in real-time.
    
2. **Reporters**: Querying the statistics to provide live insights about teams, players, and the ongoing game for their audience.

### **Technical Domain (Solution)**

To provide an intuitive and seamless experience, a **Graphical User Interface (GUI)** was selected to facilitate data input and querying, supporting real-time game narration.

### **Architecture Overview**

![Technical Architecture Diagram](resource/NBACosmos_Technical_Architecture.png)

The technical architecture diagram showcases the system’s organization. It details the flow from view components to API calls made via Axios, passing through the backend and interacting with Cosmos DB containers.

![Business Architecture Diagram](resource/NBACosmos_Business_Architecture.png)

The business architecture diagram outlines how the business components are structured. It highlights the organization of pages, models, Redux stores, and reusable View Components created to ensure consistency across the application. 

My next goal is to explore how to integrate **Next.js** into the web application.

## Learnings

### **Database**

I gained a comprehensive understanding of **CosmosDB**, its architecture, and its various components, enabling me to efficiently design and manage data for a real-time application.

### **Model-View-ViewModel (MVVM)**

Through the creation of this system, I developed a strong understanding of the **MVVM** architectural pattern. I learned how to use this pattern to enhance the separation of concerns, providing a clear distinction between the user interface (View), the logic for data binding (ViewModel), and the data model (Model). By utilizing MVVM, I was able to implement a maintainable, scalable, and testable system where the View and Model are loosely coupled. This approach not only improved the code’s readability but also allowed for better reusability and ease of modification in the long run.

# **Runtime Requirements for Azure Cosmos Emulator**

1. **Azure Cosmos Emulator**
    - **Purpose**: A local emulator for developing and testing Cosmos DB applications without requiring a live Azure subscription.
    - **Installation**: Download and install the Azure Cosmos Emulator from the official Microsoft site:
        [Download Cosmos Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator)

2. **Required .NET SDK**
    - **Purpose**: Ensure that the correct version of the .NET SDK is installed for seamless interaction with the Cosmos Emulator.
    - **Download Link**: [Download .NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

3. **Cosmos DB SDK for .NET**
    - **Purpose**: Facilitates interaction with the Cosmos Emulator, enabling operations like reading, writing, and deleting data.
    - **Installation**: Install the Cosmos DB SDK via NuGet:
        ```bash
        dotnet add package Microsoft.Azure.Cosmos
        ```

# **Runtime Requirements for React Redux**

1. **React**
    - **Purpose**: React is a JavaScript library for building user interfaces, enabling the creation of dynamic single-page applications using a component-based architecture.
    - **Installation**: To set up React, ensure you have Node.js and npm installed. Then, create a new React project:
        ```bash
        npx create-react-app my-app
        ```

2. **Redux**
    - **Purpose**: Redux is a state management library for JavaScript applications. It helps manage application state predictably, making debugging and testing easier.
    - **Installation**: Install Redux and React-Redux to integrate Redux with React:
        ```bash
        npm install redux react-redux
        ```

3. **React-Redux**
    - **Purpose**: React-Redux connects React components to the Redux store, enabling them to access and modify the application state.
    - **Installation**: Install React-Redux using npm:
        ```bash
        npm install react-redux
        ```

4. **Redux Thunk**
    - **Purpose**: Redux Thunk allows you to write action creators that return functions, enabling asynchronous operations such as API calls.
    - **Installation**: Install Redux Thunk to handle asynchronous actions:
        ```bash
        npm install redux-thunk
        ```

5. **Node.js and npm**
    - **Purpose**: Node.js is the runtime environment for executing JavaScript, and npm is the package manager for managing dependencies in JavaScript projects.
    - **Installation**: Ensure Node.js and npm are installed. Download and install the latest stable version from:
        [Download Node.js](https://nodejs.org/)