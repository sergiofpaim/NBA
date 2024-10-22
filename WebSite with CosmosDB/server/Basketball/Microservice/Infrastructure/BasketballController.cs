using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;

namespace NBA.Infrastructure
{
    public class BasketballController : ControllerBase
    {
        protected ObjectResult Result<T>(BasketballResponse<T> response)
        {
            if (response.Code == 0)
                return Ok(new
                {
                    response.Message,
                    response.PayLoad
                });
            else if (response.Code == 128)
                return NotFound(response.Message);
            else
                return BadRequest(response.Message);
        }
    }
}