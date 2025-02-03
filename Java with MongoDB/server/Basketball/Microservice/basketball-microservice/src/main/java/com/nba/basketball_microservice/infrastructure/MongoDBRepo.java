package com.nba.basketball_microservice.infrastructure;

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.UpdateResult;
import com.nba.basketball_microservice.models.Game;
import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.Player;
import com.nba.basketball_microservice.models.Season;
import com.nba.basketball_microservice.models.Team;

import org.bson.Document;
import org.bson.types.ObjectId;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MongoDBRepo implements IBasketballRepo {

    private static final String DATABASE_NAME = "NBA";
    private static final MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
    private static final MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME);

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<Class<?>, MongoCollection<Document>> collections = new HashMap<>();

    static {
        collections.put(Participation.class, database.getCollection("Participation"));
        collections.put(Game.class, database.getCollection("Game"));
        collections.put(Player.class, database.getCollection("Player"));
        collections.put(Season.class, database.getCollection("Season"));
        collections.put(Team.class, database.getCollection("Team"));
    }

    private static <T> MongoCollection<Document> getCollection(Class<T> clazz) {
        return collections.get(clazz);
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> CompletableFuture<T> createAsync(T entity) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Document document = Document.parse(objectMapper.writeValueAsString(entity));
                MongoCollection<Document> collection = getCollection((Class<T>) entity.getClass());
                collection.insertOne(document);
                return objectMapper.readValue(document.toJson(), (Class<T>) entity.getClass());
            } catch (Exception e) {
                throw new RuntimeException("Error inserting entity: " + e.getMessage(), e);
            }
        });
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> CompletableFuture<T> updateAsync(T entity) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Document document = Document.parse(objectMapper.writeValueAsString(entity));
                MongoCollection<Document> collection = getCollection((Class<T>) entity.getClass());
                UpdateResult result = collection.replaceOne(Filters.eq("_id", entity.getId()), document);
                if (result.getMatchedCount() > 0) {
                    return objectMapper.readValue(document.toJson(), (Class<T>) entity.getClass());
                } else {
                    throw new RuntimeException("No matching document found for update.");
                }
            } catch (Exception e) {
                throw new RuntimeException("Error updating entity: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public <T extends BasketballModel> T getById(String id, Class<T> clazz) {
        MongoCollection<Document> collection = getCollection(clazz);
        Document doc = collection.find(Filters.eq("_id", new ObjectId(id))).first();
        if (doc != null) {
            try {
                return objectMapper.readValue(doc.toJson(), clazz);
            } catch (Exception e) {
                throw new RuntimeException("Error deserializing entity: " + e.getMessage(), e);
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> List<T> get(Function<T, Boolean> where, Function<T, Object> order,
            boolean descending, Integer take) {
        MongoCollection<Document> collection = getCollection((Class<T>) where.getClass());
        FindIterable<Document> documents = collection.find(Filters.eq("someField", where))
                .sort(descending ? Sorts.descending(order.apply(null).toString())
                        : Sorts.ascending(order.apply(null).toString()))
                .limit(take != null ? take : 0);

        List<T> results = new ArrayList<>();
        for (Document document : documents) {
            try {
                results.add(objectMapper.readValue(document.toJson(), (Class<T>) where.getClass()));
            } catch (Exception e) {
                throw new RuntimeException("Error deserializing entity: " + e.getMessage(), e);
            }
        }
        return results;
    }

    @Override
    public CompletableFuture<Void> reseedAsync() {
        return CompletableFuture.runAsync(() -> {
            try {
                reseedCollection(Player.class);
                reseedCollection(Game.class);
                reseedCollection(Season.class);
                reseedCollection(Team.class);
                reseedCollection(Participation.class);
            } catch (IOException e) {
                throw new RuntimeException("Error reseeding database: " + e.getMessage(), e);
            }
        });
    }

    private <T extends BasketballModel> void reseedCollection(Class<T> clazz) throws IOException {
        MongoCollection<Document> collection = getCollection(clazz);
        collection.drop();

        String filePath = "./Seed/" + clazz.getSimpleName() + ".json";
        String content = new String(Files.readAllBytes(new File(filePath).toPath()));
        List<T> entities = objectMapper.readValue(content,
                objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));

        for (T entity : entities) {
            Document document = Document.parse(objectMapper.writeValueAsString(entity));
            collection.insertOne(document);
        }
        System.out.println("Reseeded " + clazz.getSimpleName() + " collection.");
    }
}
