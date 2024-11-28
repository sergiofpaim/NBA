export class Participation {
    id: string;
    name: string;
    participationId: string;
    teamname: string;

    constructor(id: string, name: string, participationid: string, teamname: string) {
        this.id = id;
        this.name = name;
        this.participationId = participationid;
        this.teamname = teamname;
    }
}