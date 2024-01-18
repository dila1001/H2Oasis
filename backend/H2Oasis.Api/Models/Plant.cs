using Postgrest.Attributes;
using Postgrest.Models;

namespace H2Oasis.Api.Models;

[Table("plants")]
public class Plant : BaseModel
{
    [PrimaryKey("id", false)]
    public int Id { get; set; }
    // [Column("user_id")]
    // public int? UserId { get; set; }
    [Column("name")]
    public string Name { get; set; } = string.Empty;
    [Column("species")]
    public string Species { get; set; } = string.Empty;
    [Column("image_url")]
    public string ImageUrl { get; set; } = string.Empty;
    [Column("watering_frequency_in_days")]
    public int WateringFrequencyInDays { get; set; }
    [Column("last_watered")]
    public DateTime LastWatered { get; set; }
}