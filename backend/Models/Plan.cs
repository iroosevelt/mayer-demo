
namespace MayerDemo.API.Models;

public class Plan
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public string Name { get; set; }
    public string Status { get; set; }
    public string StoragePath { get; set; }
}
