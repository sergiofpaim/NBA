package com.nba.microservice.services;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.mongodb.client.model.Filters;
import com.nba.microservice.infrastructure.Basketball;
import com.nba.microservice.infrastructure.BasketballResponse;
import com.nba.microservice.infrastructure.BasketballService;
import com.nba.microservice.infrastructure.MongoDBRepo;
import com.nba.microservice.models.Game;
import com.nba.microservice.models.Participation;
import com.nba.microservice.models.Player;
import com.nba.microservice.models.Season;
import com.nba.microservice.models.Type.PlayType;
import com.nba.microservice.models.ValueObjects.GamePlay;
import com.nba.microservice.viewmodels.GameVM;
import com.nba.microservice.viewmodels.ParticipatingPlayerVM;
import com.nba.microservice.viewmodels.ParticipationVM;
import com.nba.microservice.viewmodels.SeasonVM;
import com.nba.microservice.viewmodels.TeamScalationVM;
import org.springframework.stereotype.Service;

@Service
public class TransactionService extends BasketballService {

    public static BasketballResponse<GameVM> addGame(String homeTeamId, String visitorTeamId, Date at) {
        List<Season> seasons = Basketball.getRepo().get(Season.class, Filters.empty(), c -> "Id", false, null);
        Optional<Season> lastSeason = seasons.stream()
                .max(Comparator.comparingInt(s -> Integer.parseInt(s.getId().substring(0, 2))));

        if (lastSeason.isEmpty()) {
            return error("There is no season registered yet.");
        }

        var homeTeam = lastSeason.get().getTeams().stream()
                .filter(t -> t.getId().equals(homeTeamId))
                .findFirst()
                .orElse(null);

        if (homeTeam == null) {
            return notFound("Home team not found.");
        }

        var visitorTeam = lastSeason.get().getTeams().stream()
                .filter(t -> t.getId().equals(visitorTeamId))
                .findFirst()
                .orElse(null);

        if (visitorTeam == null) {
            return notFound("Visitor team not found.");
        }

        var game = Game.factoryFrom(lastSeason.get().getId(), homeTeam, visitorTeam, at);

        System.out.println(game);

        Basketball.getRepo().create(game);

        if (game.getId() == null) {
            return error("Failed to add the game to the database.");
        }

        return success(GameVM.factorFrom(game), "Game added to the database with Id: " + game.getId());
    }

    public static BasketballResponse<ParticipationVM> addPlay(String playerId, String gameId,
            int quarter, PlayType type, int playsToTake) {
        Game game = Basketball.getRepo().getById(gameId, Game.class);
        if (game == null) {
            return notFound("Game not found.");
        }

        Boolean isHomePlayer = isPartOfHomeTeam(game, playerId);
        if (isHomePlayer == null) {
            return notFound("Player does not participate in the game.");
        }

        Player player = Basketball.getRepo().getById(playerId, Player.class);
        if (player == null) {
            return notFound("Player not found.");
        }

        var participations = Basketball.getRepo().get(Participation.class,
                Filters.and(Filters.eq("gameId", gameId), Filters.eq("playerId", playerId)), null, false, null);

        var participation = participations.isEmpty() ? null : participations.get(0);

        var newPlay = GamePlay.factoryFrom(quarter, type, game.getAt());

        final Participation[] participationHolder = new Participation[1];
        if (participation == null) {
            if (isHomePlayer) {
                participationHolder[0] = Participation.factoryFrom(game, player, game.getHomeTeamName(),
                        game.getHomeTeamId(), newPlay);
            } else {
                participationHolder[0] = Participation.factoryFrom(game, player, game.getVisitorTeamName(),
                        game.getVisitorTeamId(), newPlay);
            }
            Basketball.getRepo().create(participationHolder[0]);
        } else {
            participation.registerPlay(newPlay);
            participationHolder[0] = participation;
            Basketball.getRepo().update(participation);
        }

        participationHolder[0].trimPlays(playsToTake);
        if (participationHolder[0].getId() == null) {
            return error("Failed to add the play to the database.");
        } else {
            return success(ParticipationVM.factoryFrom(participationHolder[0]), "Play added to the database.");
        }
    }

    public static BasketballResponse<ParticipationVM> deletePlay(String participationId,
            String at, int playsToTake) {
        List<Participation> participations = Basketball.getRepo().get(Participation.class,
                Filters.eq("_id", participationId), null, false, null);

        Participation participation = participations.get(0);

        long atMillis = MongoDBRepo.getLongTimeSpanFromString(at);

        var toRemove = participation.getPlays().stream()
                .filter(p -> p.getAt() == atMillis)
                .findFirst()
                .orElse(null);

        if (toRemove == null) {
            return notFound("Play not found.");
        }

        participation.getPlays().remove(toRemove);

        Basketball.getRepo().update(participation);

        if (participation.getPlays().contains(toRemove)) {
            return error("Play was not successfully removed from the list.");
        }

        participation.trimPlays(playsToTake);

        return success(ParticipationVM.factoryFrom(participation), null);
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

        Season season = Basketball.getRepo()
                .get(Season.class, Filters.empty(), c -> "Id", false, null)
                .stream()
                .max(Comparator.comparingInt(s -> Integer.parseInt(s.getId().substring(0, 2))))
                .orElse(null);

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
        Season season = Basketball.getRepo()
                .get(Season.class, Filters.empty(), c -> "Id", false, null)
                .stream()
                .max(Comparator.comparingInt(s -> Integer.parseInt(s.getId().substring(0, 2))))
                .orElse(null);

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