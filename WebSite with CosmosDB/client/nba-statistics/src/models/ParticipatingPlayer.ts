export class ParticipatingPlayer {
    id: string;
    name: string;
    participationId: string;
    teamId: string;
    teamname: string;

    constructor(id: string, name: string, participationid: string, teamId: string, teamname: string) {
        this.id = id;
        this.name = name;
        this.participationId = participationid;
        this.teamId = teamId;
        this.teamname = teamname;
    }
}