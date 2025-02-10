package com.nba.basketball_microservice.services;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import com.mongodb.client.model.Filters;
import com.nba.basketball_microservice.infrastructure.Basketball;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;
import com.nba.basketball_microservice.infrastructure.BasketballService;
import com.nba.basketball_microservice.models.Game;
import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.Player;
import com.nba.basketball_microservice.models.Season;
import com.nba.basketball_microservice.models.Team;
import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
import com.nba.basketball_microservice.models.ValueObjects.TeamScalation;
import com.nba.basketball_microservice.viewmodels.GameVM;
import com.nba.basketball_microservice.viewmodels.ParticipatingPlayerVM;
import com.nba.basketball_microservice.viewmodels.ParticipationVM;
import com.nba.basketball_microservice.viewmodels.SeasonVM;
import com.nba.basketball_microservice.viewmodels.TeamScalationVM;
import org.springframework.stereotype.Service;

@Service
public class TransactionService extends BasketballService {

    public static CompletableFuture<BasketballResponse<GameVM>> addGameAsync(String homeTeamId, String visitorTeamId,
            LocalDateTime at) {
        return CompletableFuture
                .supplyAsync(() -> Basketball.getRepo().get(Season.class, Filters.empty(), null, false, null))
                .thenApply(seasons -> seasons.stream().findFirst())
                .thenCompose(lastSeason -> {
                    if (lastSeason.isEmpty())
                        return CompletableFuture.completedFuture(error("There is no season registered yet."));

                    var homeTeam = lastSeason.get().getTeams().stream()
                            .filter(t -> t.getId().equals(homeTeamId))
                            .findFirst()
                            .orElse(null);

                    if (homeTeam == null)
                        return CompletableFuture.completedFuture(notFound("Home team not found."));

                    var visitorTeam = lastSeason.get().getTeams().stream()
                            .filter(t -> t.getId().equals(visitorTeamId))
                            .findFirst()
                            .orElse(null);

                    if (visitorTeam == null)
                        return CompletableFuture.completedFuture(notFound("Visitor team not found."));

                    var game = Game.factoryFrom(lastSeason.get().getId(), homeTeam, visitorTeam, at);

                    System.out.println(game);

                    return Basketball.getRepo().createAsync(game)
                            .thenApply(ignored -> {
                                if (game.getId() == null)
                                    return error("Failed to add the game to the database.");

                                return success(GameVM.factorFrom(game),
                                        "Game added to the database with Id: " + game.getId());
                            });

                });
    }

    // public static BasketballResponse<ParticipationVM> addPlay(String playerId,
    // String gameId, int quarter,
    // PlayType type, int playsToTake) {
    // Game game = Basketball.getRepo().getById(Game.class, gameId);
    // if (game == null)
    // return BasketballResponse.notFound("Game not found.");

    // Boolean isHomePlayer = isPartOfHomeTeam(game, playerId);
    // if (isHomePlayer == null)
    // return BasketballResponse.notFound("Player does not participate in the
    // game.");

    // Player player = Basketball.getRepo().getById(Player.class, playerId);
    // if (player == null)
    // return BasketballResponse.notFound("Player not found.");

    // Participation participation = Basketball.getRepo()
    // .get(Participation.class, p -> p.getGameId().equals(game.getId()) &&
    // p.getPlayerId().equals(playerId))
    // .stream().findFirst().orElse(null);

    // GamePlay newPlay = GamePlay.factoryFrom(quarter, type, game.getAt());

    // Participation saved;
    // if (participation == null) {
    // participation = isHomePlayer
    // ? Participation.factoryFrom(game, player, game.getHomeTeamName(),
    // game.getHomeTeamId(), newPlay)
    // : Participation.factoryFrom(game, player, game.getVisitorTeamName(),
    // game.getVisitorTeamId(),
    // newPlay);

    // saved = Basketball.getRepo().create(participation);
    // } else {
    // participation.registerPlay(newPlay);
    // saved = Basketball.getRepo().update(participation);
    // }

    // participation.trimPlays(playsToTake);

    // return saved == null
    // ? BasketballResponse.error("Failed to add the play to the database.")
    // : BasketballResponse.success(ParticipationVM.factorFrom(participation), "Play
    // added to the database.");
    // }

    // public static BasketballResponse<ParticipationVM> deletePlay(String
    // participationId, Duration at, int playsToTake) {
    // Participation toUpdate = Basketball.getRepo().getById(Participation.class,
    // participationId);

    // if (toUpdate == null)
    // return BasketballResponse.notFound("Participation not found.");

    // GamePlay toRemove = toUpdate.getPlays().stream().filter(p ->
    // p.getAt().equals(at)).findFirst().orElse(null);

    // if (toRemove == null)
    // return BasketballResponse.notFound("Play not found.");

    // toUpdate.getPlays().remove(toRemove);
    // Participation saved = Basketball.getRepo().update(toUpdate);

    // saved.trimPlays(playsToTake);

    // return saved == null
    // ? BasketballResponse.error("Failed to remove the play from the database.")
    // : BasketballResponse.success(ParticipationVM.factorFrom(saved), "Play removed
    // from the database.");
    // }

    // public static BasketballResponse<ParticipationVM> getParticipation(String
    // gameId, String playerId,
    // int playsToTake) {
    // Participation participation = Basketball.getRepo()
    // .get(Participation.class, p -> p.getGameId().equals(gameId) &&
    // p.getPlayerId().equals(playerId))
    // .stream().findFirst().orElse(null);

    // if (participation == null)
    // return BasketballResponse.notFound("Player does not participate in the
    // game.");

    // participation.trimPlays(playsToTake);
    // return BasketballResponse.success(ParticipationVM.factorFrom(participation));
    // }

    // public static BasketballResponse<Player> getPlayer(String playerId) {
    // Player player = Basketball.getRepo().getById(Player.class, playerId);
    // return player == null ? BasketballResponse.notFound("Player not found.") :
    // BasketballResponse.success(player);
    // }

    // public static BasketballResponse<Game> getGame(String gameId) {
    // Game game = Basketball.getRepo().getById(Game.class, gameId);
    // return game == null ? BasketballResponse.notFound("Game not found.") :
    // BasketballResponse.success(game);
    // }

    // private static Boolean isPartOfHomeTeam(Game gameResult, String playerId) {
    // if (gameResult.getHomePlayerIds().contains(playerId))
    // return true;
    // if (gameResult.getVisitorPlayerIds().contains(playerId))
    // return false;
    // return null;
    // }

    // public static BasketballResponse<Object> reseed() {
    // Basketball.getRepo().reseedAsync();
    // return BasketballResponse.success(null, "Reseed completed.");
    // }

    // public static BasketballResponse<List<SeasonVM>> getSeasons() {
    // List<Season> seasons = Basketball.getRepo().get(Season.class, s -> true);
    // return BasketballResponse.success(
    // seasons.stream().sorted((a, b) ->
    // b.getId().compareTo(a.getId())).map(SeasonVM::factorFrom)
    // .collect(Collectors.toList()));
    // }

    // public static BasketballResponse<List<GameVM>> getSeasonGames(String
    // seasonId) {
    // List<Game> games = Basketball.getRepo().get(Game.class, g ->
    // g.getSeasonId().equals(seasonId));
    // return BasketballResponse.success(
    // games.stream().sorted((a, b) ->
    // b.getAt().compareTo(a.getAt())).map(GameVM::factorFrom)
    // .collect(Collectors.toList()));
    // }

    // public static BasketballResponse<List<GameVM>> getLastSeasonGames() {
    // Optional<Season> season = Basketball.getRepo().get(Season.class, s -> true,
    // Season::getId, true, 1).stream()
    // .findFirst();
    // return season.map(value ->
    // getSeasonGames(value.getId())).orElse(BasketballResponse.error("No season
    // found."));
    // }

    // public static BasketballResponse<List<ParticipatingPlayerVM>>
    // getParticipatingPlayers(String gameId) {
    // List<Participation> participations =
    // Basketball.getRepo().get(Participation.class,
    // p -> p.getGameId().equals(gameId));
    // return BasketballResponse.success(
    // participations.stream().sorted((a, b) ->
    // a.getPlayerName().compareTo(b.getPlayerName()))
    // .map(ParticipatingPlayerVM::factorFrom)
    // .collect(Collectors.toList()));
    // }

    // public static BasketballResponse<List<TeamScalationVM>> getSeasonTeams(String
    // seasonId) {
    // Season season = Basketball.getRepo().getById(Season.class, seasonId);
    // return season == null
    // ? BasketballResponse.error("Season not found.")
    // : BasketballResponse.success(
    // season.getTeams().stream().map(TeamScalationVM::factorFrom).collect(Collectors.toList()));
    // }

    // public static BasketballResponse<List<TeamScalationVM>> getLastSeasonTeams()
    // {
    // Optional<Season> season = Basketball.getRepo().get(Season.class, s -> true,
    // Season::getId, true, 1).stream()
    // .findFirst();
    // return season.map(value ->
    // getSeasonTeams(value.getId())).orElse(BasketballResponse.error("No season
    // found."));
    // }
}