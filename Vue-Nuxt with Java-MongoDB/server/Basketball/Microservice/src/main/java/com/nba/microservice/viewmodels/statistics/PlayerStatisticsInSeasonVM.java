package com.nba.microservice.viewmodels.statistics;

import com.nba.microservice.models.ValueObjects.GamePlay;
import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;
import com.nba.microservice.models.Type.PlayType;
import java.util.List;

public class PlayerStatisticsInSeasonVM extends BasketballViewModel {

    private int participations;
    private double ppg;
    private double apg;
    private double rpg;
    private double bpg;
    private int totalPoints;
    private Double ftConversion;

    public int getParticipations() {
        return participations;
    }

    public void setParticipations(int participations) {
        this.participations = participations;
    }

    public double getPpg() {
        return ppg;
    }

    public void setPpg(double ppg) {
        this.ppg = ppg;
    }

    public double getApg() {
        return apg;
    }

    public void setApg(double apg) {
        this.apg = apg;
    }

    public double getRpg() {
        return rpg;
    }

    public void setRpg(double rpg) {
        this.rpg = rpg;
    }

    public double getBpg() {
        return bpg;
    }

    public void setBpg(double bpg) {
        this.bpg = bpg;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Double getFtConversion() {
        return ftConversion;
    }

    public void setFtConversion(Double ftConversion) {
        this.ftConversion = ftConversion;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static PlayerStatisticsInSeasonVM factorFrom(int participations, List<GamePlay> plays) {
        int points = plays.stream()
                .mapToInt(play -> play.getPoints() != null ? play.getPoints() : 0)
                .sum();

        PlayerStatisticsInSeasonVM stats = new PlayerStatisticsInSeasonVM();
        stats.setParticipations(participations);
        stats.setPpg(roundToTwoDecimals((double) points / participations));
        stats.setApg(roundToTwoDecimals(
                (double) plays.stream().filter(p -> p.getType().equals(PlayType.Assist.name())).count()
                        / participations));
        stats.setRpg(roundToTwoDecimals(
                (double) plays.stream().filter(p -> p.getType().equals(PlayType.Rebound.name())).count()
                        / participations));
        stats.setBpg(roundToTwoDecimals(
                (double) plays.stream().filter(p -> p.getType().equals(PlayType.Block.name())).count()
                        / participations));
        stats.setTotalPoints(points);

        long fth = plays.stream().filter(p -> p.getType().equals(PlayType.FreeThrowHit.name())).count();
        long ftm = plays.stream().filter(p -> p.getType().equals(PlayType.FreeThrowMiss.name())).count();
        if (fth > 0 || ftm > 0) {
            stats.setFtConversion(roundToTwoDecimals((double) fth / (fth + ftm) * 100));
        }

        return stats;
    }

    private static double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

}