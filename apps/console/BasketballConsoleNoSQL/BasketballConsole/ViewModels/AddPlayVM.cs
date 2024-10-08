using NBA.Models;

namespace NBA.ViewModels
{
    public class AddPlayVM
    {
        public string GameId { get; set; }
        public string PlayerId { get; set; }
        public int Quarter { get; set; }
        public PlayType PlayType { get; set; }
    }
}
