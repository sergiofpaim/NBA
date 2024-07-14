using System.Data.SqlClient;
using System.Text;

namespace NBA.Utils
{
    internal static class SqlCommandExtensions
    {
        public static string ShowCommand(this SqlCommand cmd)
        {
            StringBuilder commandText = new StringBuilder(cmd.CommandText);

            foreach (SqlParameter param in cmd.Parameters)
            {
                string parameterValue;

                // Handle NULL values
                if (param.Value == DBNull.Value)
                {
                    parameterValue = "NULL";
                }
                else if (param.Value is string || param.Value is DateTime)
                {
                    // Handle string and DateTime values by enclosing them in quotes
                    parameterValue = $"'{param.Value}'";
                }
                else
                {
                    // Handle other data types without quotes
                    parameterValue = param.Value.ToString();
                }

                // Replace parameter name with parameter value
                commandText.AppendFormat(" {0} = {1},", param.ParameterName, parameterValue);
            }

            if (cmd.Parameters.Count > 0)
            {
                // Remove the last comma
                commandText.Length--;
            }

            return commandText.ToString();
        }
    }
}
