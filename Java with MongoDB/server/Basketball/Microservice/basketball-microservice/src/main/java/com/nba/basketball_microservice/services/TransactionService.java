package com.nba.basketball_microservice.services;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
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
import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
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
                .supplyAsync(() -> Basketball.getRepo()
                        .get(Season.class, Filters.empty(), c -> "Id", false, null))
                .thenApply(seasons -> seasons.stream()
                        .max(Comparator.comparingInt(s -> Integer.parseInt(s.getId().substring(0, 2)))))
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

    public static CompletableFuture<BasketballResponse<ParticipationVM>> addPlayAsync(String playerId, String gameId,
            int quarter, PlayType type, int playsToTake) {
        Game game = Basketball.getRepo().getById(gameId, Game.class);
        if (game == null) {
            return CompletableFuture.completedFuture(notFound("Game not found."));
        }

        Boolean isHomePlayer = isPartOfHomeTeam(game, playerId);
        if (isHomePlayer == null) {
            return CompletableFuture.completedFuture(notFound("Player does not participate in the game."));
        }

        Player player = Basketball.getRepo().getById(playerId, Player.class);
        if (player == null) {
            return CompletableFuture.completedFuture(notFound("Player not found."));
        }

        var participations = Basketball.getRepo().get(Participation.class,
                Filters.and(Filters.eq("gameId", gameId), Filters.eq("playerId", playerId)), null, false, null);

        var participation = participations.isEmpty() ? null : participations.get(0);

        var newPlay = GamePlay.factoryFrom(quarter, type, game.getAt());

        CompletableFuture<Participation> futureSaved;

        final Participation[] participationHolder = new Participation[1];
        if (participation == null) {
            if (isHomePlayer) {
                participationHolder[0] = Participation.factoryFrom(game, player, game.getHomeTeamName(),
                        game.getHomeTeamId(),
                        newPlay);
            } else {
                participationHolder[0] = Participation.factoryFrom(game, player, game.getVisitorTeamName(),
                        game.getVisitorTeamId(), newPlay);
            }
            futureSaved = Basketball.getRepo().createAsync(participationHolder[0]);
        } else {
            participation.registerPlay(newPlay);
            participationHolder[0] = participation;
            futureSaved = Basketball.getRepo().updateAsync(participation);
        }

        return futureSaved.thenApply(saved -> {
            participationHolder[0].trimPlays(playsToTake);
            if (saved == null) {
                return error("Failed to add the play to the database.");
            } else {
                return success(ParticipationVM.factoryFrom(participationHolder[0]), "Play added to the database.");
            }
        });
    }

    public static BasketballResponse<ParticipationVM> getParticipation(String gameId, String playerId,
            int playsToTake) {
        List<Participation> participations = Basketball.getRepo().get(Participation.class,
                Filters.and(Filters.eq("gameId", gameId), Filters.eq("playerId", playerId)),
                null, false, null);
        Participation participation = participations.isEmpty() ? null : participations.get(0);
        if (participation == null) {
            return notFound("Player does not participate in the game.");
        } else {
            participation.trimPlays(playsToTake);
            return success(ParticipationVM.factoryFrom(participation), null);
        }
    }

    public static BasketballResponse<Player> getPlayer(String playerId) {
        Player player = Basketball.getRepo().getById(playerId, Player.class);
        if (player == null) {
            return notFound("Player not found.");
        } else {
            return success(player, null);
        }
    }

    public static BasketballResponse<Game> getGame(String gameId) {
        Game game = Basketball.getRepo().getById(gameId, Game.class);
        if (game == null) {
            return notFound("Game not found.");
        } else {
            return success(game, null);
        }
    }

    public static BasketballResponse<List<SeasonVM>> getSeasons() {
        List<Season> seasons = Basketball.getRepo().get(Season.class, Filters.empty(), c -> "Id", false, null);

        seasons.sort((s1, s2) -> s2.getId().compareTo(s1.getId()));

        List<SeasonVM> seasonVMs = seasons.stream()
                .map(SeasonVM::factorFrom)
                .collect(Collectors.toList());

        return success(seasonVMs, null);
    }

    public static BasketballResponse<List<GameVM>> getSeasonGames(String seasonId) {
        List<Game> games = Basketball.getRepo().get(Game.class, Filters.eq("seasonId", seasonId), g -> "Id", false,
                null);

        List<GameVM> gameVMs = games.stream()
                .sorted((g1, g2) -> g2.getAt().compareTo(g1.getAt()))
                .map(GameVM::factorFrom)
                .collect(Collectors.toList());

        return success(gameVMs, null);
    }

    public static BasketballResponse<List<GameVM>> getLastSeasonGames() {
        List<Season> seasons = Basketball.getRepo().get(Season.class, Filters.empty(), null, true,
                1);

        Season season = seasons.isEmpty() ? null : seasons.get(0);

        if (season != null)
            return getSeasonGames(season.getId());

        return notFound("No season found.");
    }

    public static BasketballResponse<List<ParticipatingPlayerVM>> getParticipatingPlayers(String gameId) {
        List<Participation> participations = Basketball.getRepo().get(Participation.class, Filters.eq("gameId", gameId),
                null, false, null);

        List<ParticipatingPlayerVM> players = participations.stream()
                .sorted(Comparator.comparing(Participation::getPlayerName))
                .map(ParticipatingPlayerVM::factorFrom)
                .collect(Collectors.toList());

        return success(players, null);
    }

    public static BasketballResponse<List<TeamScalationVM>> getSeasonTeams(String seasonId) {
        Season season = Basketball.getRepo().getById(seasonId, Season.class);

        if (season == null)
            return notFound("Season not found.");

        List<TeamScalationVM> teams = season.getTeams().stream()
                .map(TeamScalationVM::factorFrom)
                .collect(Collectors.toList());

        return success(teams, null);
    }

    public static BasketballResponse<List<TeamScalationVM>> getLastSeasonTeams() {
        List<Season> seasons = Basketball.getRepo().get(Season.class, Filters.empty(), null, true, 1);

        Season season = seasons.isEmpty() ? null : seasons.get(0);

        if (season != null)
            return getSeasonTeams(season.getId());

        return notFound("No season found.");
    }

    private static Boolean isPartOfHomeTeam(Game gameResult, String playerId) {
        if (gameResult.getHomePlayerIds().contains(playerId)) {
            return true;
        } else if (gameResult.getVisitorPlayerIds().contains(playerId)) {
            return false;
        }
        return null;
    }

}