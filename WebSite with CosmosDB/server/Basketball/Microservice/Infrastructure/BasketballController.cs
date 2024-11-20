using Microsoft.AspNetCore.Mvc;

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
                return StatusCode(404, response.Message);
            else
                return StatusCode(500, response.Message);
        }
    }
}