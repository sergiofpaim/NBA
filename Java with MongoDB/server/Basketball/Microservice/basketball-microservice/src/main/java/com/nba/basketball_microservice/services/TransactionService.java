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

    private static Boolean isPartOfHomeTeam(Game gameResult, String playerId) {
        if (gameResult.getHomePlayerIds().contains(playerId)) {
            return true;
        } else if (gameResult.getVisitorPlayerIds().contains(playerId)) {
            return false;
        }
        return null;
    }

}