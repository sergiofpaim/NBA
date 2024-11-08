using NBA.Models;

namespace NBA.ViewModels
{
    public class ParticipatingPlayerVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ParticipationId { get; set; }
        public string TeamName { get; set; }

        internal static ParticipatingPlayerVM FactorFrom(Participation model)
        {
            return new()
            {
                Id = model.PlayerId,
                Name = model.PlayerName,
                ParticipationId = model.Id,
                TeamName = model.TeamName
            };
        }
    }
}