package com.nba.basketball_microservice.infrastructure;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.nba.basketball_microservice.models.Game;
import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.Player;
import com.nba.basketball_microservice.models.Season;
import com.nba.basketball_microservice.models.Team;

import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.types.ObjectId;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public class MongoDBRepo implements IBasketballRepo {

    private static final String DATABASE_NAME = "NBA";

    private static final CodecRegistry pojoCodecRegistry = CodecRegistries.fromRegistries(
            MongoClientSettings.getDefaultCodecRegistry(),
            CodecRegistries.fromProviders(PojoCodecProvider.builder().automatic(true).build()));

    private static final MongoClientSettings settings = MongoClientSettings.builder()
            .codecRegistry(pojoCodecRegistry)
            .build();

    private static final MongoClient mongoClient = MongoClients.create(settings);

    private static final MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME)
            .withCodecRegistry(pojoCodecRegistry);

    private static final Map<Class<?>, MongoCollection<? extends BasketballModel>> collections = new HashMap<>();

    static {
        collections.put(Participation.class, database.getCollection("Participation", Participation.class));
        collections.put(Game.class, database.getCollection("Game", Game.class));
        collections.put(Player.class, database.getCollection("Player", Player.class));
        collections.put(Season.class, database.getCollection("Season", Season.class));
        collections.put(Team.class, database.getCollection("Team", Team.class));
    }

    private static <T extends BasketballModel> MongoCollection<T> getCollection(Class<T> clazz) {
        MongoCollection<?> collection = collections.get(clazz);

        if (collection == null) {
            throw new IllegalArgumentException("No collection found for class: " + clazz.getSimpleName());
        }

        if (!clazz.isAssignableFrom(collection.getDocumentClass())) {
            throw new IllegalArgumentException("Collection type mismatch for class: " + clazz.getSimpleName());
        }

        @SuppressWarnings("unchecked")
        MongoCollection<T> safeCollection = (MongoCollection<T>) collection;

        return safeCollection;
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> CompletableFuture<T> createAsync(T entity) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                MongoCollection<T> collection = getCollection((Class<T>) entity.getClass());
                var result = collection.insertOne(entity);

                if (result.getInsertedId() != null)
                    return getById(entity.getId(), (Class<T>) entity.getClass());
                else
                    throw new RuntimeException("Error inserting entity: " + entity);
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
                MongoCollection<T> collection = getCollection((Class<T>) entity.getClass());
                T result = collection.findOneAndReplace(Filters.eq("id", entity.getId()), entity);
                if (result != null)
                    return result;
                else {
                    throw new RuntimeException("No matching document found for update.");
                }
            } catch (Exception e) {
                throw new RuntimeException("Error updating entity: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public <T extends BasketballModel> T getById(String id, Class<T> clazz) {
        MongoCollection<T> collection = getCollection(clazz);
        T doc = collection.find(Filters.eq("id", new ObjectId(id))).first();
        if (doc != null)
            return doc;

        return null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> List<T> get(Function<T, Boolean> where, Function<T, Object> order,
            boolean descending, Integer take) {

        MongoCollection<T> collection = getCollection((Class<T>) where.getClass());
        FindIterable<T> documents = collection.find(Filters.eq("someField", where))
                .sort(descending
                        ? Sorts.descending(order.apply(null).toString())
                        : Sorts.ascending(order.apply(null).toString()))
                .limit(take != null ? take : 0);

        return documents.into(new ArrayList<>());
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

    private <T extends BasketballModel> void reseedCollection(Class<T> modelClass) throws IOException {
        MongoCollection<T> collection = getCollection(modelClass);
        collection.deleteMany(new Document());

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.findAndRegisterModules();

        String filePath = "./src/main/resources/seed/" + modelClass.getSimpleName() + ".json";
        String content = new String(Files.readAllBytes(new File(filePath).toPath()));
        List<T> entities = objectMapper.readValue(content,
                objectMapper.getTypeFactory().constructCollectionType(List.class, modelClass));

        for (T entity : entities) {
            collection.insertOne(entity);
        }
        System.out.println("Reseeded " + modelClass.getSimpleName() + " collection.");
    }
}