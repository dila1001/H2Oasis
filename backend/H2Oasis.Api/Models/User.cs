using Postgrest.Attributes;
using Postgrest.Models;

namespace H2Oasis.Api.Models;

[Table("users")]
public class User : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("first_name")]
    public string FirstName { get; set; } = string.Empty;
    [Column("last_name")]
    public string LastName { get; set; } = string.Empty;
    
    [Reference(typeof(Plant), ReferenceAttribute.JoinType.Left)]
    public List<Plant> Plants { get; set; } = new();
}