package com.nba.microservice.infrastructure;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.nba.microservice.models.Game;
import com.nba.microservice.models.Participation;
import com.nba.microservice.models.Player;
import com.nba.microservice.models.Season;
import com.nba.microservice.models.Team;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.conversions.Bson;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
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

    private static ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.findAndRegisterModules();

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
    public <T extends BasketballModel> T create(T entity) {
        try {
            MongoCollection<T> collection = getCollection((Class<T>) entity.getClass());
            var result = collection.insertOne(entity);

            if (result.getInsertedId() != null) {
                return getById(entity.getId(), (Class<T>) entity.getClass());
            } else {
                throw new RuntimeException("Error inserting entity: " + entity);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error inserting entity: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends BasketballModel> T update(T entity) {
        try {
            MongoCollection<T> collection = getCollection((Class<T>) entity.getClass());
            T result = collection.findOneAndReplace(Filters.eq("_id", entity.getId()), entity);

            if (result != null) {
                return result;
            } else {
                throw new RuntimeException("No matching document found for update.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error updating entity: " + e.getMessage(), e);
        }
    }

    @Override
    public <T extends BasketballModel> T getById(String id, Class<T> clazz) {
        MongoCollection<T> collection = getCollection(clazz);
        T doc = collection.find(Filters.eq("_id", id)).first();
        if (doc != null)
            return doc;

        return null;
    }

    @Override
    public <T extends BasketballModel> List<T> get(Class<T> clazz, Bson filter, Function<Class<T>, String> order,
            boolean descending, Integer take) {

        MongoCollection<T> collection = getCollection(clazz);

        FindIterable<T> documents = collection.find(filter);

        if (order != null) {
            String orderField = order.apply(clazz);

            if (orderField != null)
                documents = documents.sort(descending ? Sorts.descending(orderField) : Sorts.ascending(orderField));
        }

        if (take != null && take > 0)
            documents = documents.limit(take);

        documents.into(new ArrayList<>());

        return documents.into(new ArrayList<>());
    }

    @Override
    public void reseed() {
        try {
            reseedCollection(Player.class);
            reseedCollection(Game.class);
            reseedCollection(Season.class);
            reseedCollection(Team.class);
            reseedCollection(Participation.class);
        } catch (Exception e) {
            throw new RuntimeException("Error reseeding database: " + e.getMessage(), e);
        }
    }

    private <T extends BasketballModel> void reseedCollection(Class<T> modelClass) throws IOException {
        MongoCollection<T> collection = getCollection(modelClass);
        collection.deleteMany(new Document());

        String filePath = "./src/main/resources/seed/" + modelClass.getSimpleName() + ".json";
        String content = new String(Files.readAllBytes(new File(filePath).toPath()));
        List<T> entities = objectMapper.readValue(content,
                objectMapper.getTypeFactory().constructCollectionType(List.class, modelClass));

        for (T entity : entities) {
            collection.insertOne(entity);
        }
        System.out.println("Reseeded " + modelClass.getSimpleName() + " collection.");
    }

    public static long getLongTimeSpanFromString(String at) {
        String[] timeParts = at.split("[:.]");
        long hours = Long.parseLong(timeParts[0]) * 3600000;
        long minutes = Long.parseLong(timeParts[1]) * 60000;
        long seconds = Long.parseLong(timeParts[2]) * 1000;
        String millisecondsStr = timeParts.length > 3 ? timeParts[3] : "0";
        millisecondsStr = millisecondsStr.length() > 3 ? millisecondsStr.substring(0, 3) : millisecondsStr;
        long milliseconds = Long.parseLong(millisecondsStr);
        long atMillis = hours + minutes + seconds + milliseconds;

        return atMillis;
    }

    public static String getStringTimeSpanFromLong(long at) {
        LocalTime time = LocalTime.ofNanoOfDay(at * 1_000_000);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss.SSSSSSS");

        return time.format(formatter);
    }

    public static boolean isTimeSpan(String at) {
        try {
            getLongTimeSpanFromString(at);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}