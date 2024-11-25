export class Participation {
    id: string;
    name: string;
    participationid: string;
    teamname: string;

    constructor(id: string, name: string, participationid: string, teamname: string) {
        this.id = id;
        this.name = name;
        this.participationid = participationid;
        this.teamname = teamname;
    }
}