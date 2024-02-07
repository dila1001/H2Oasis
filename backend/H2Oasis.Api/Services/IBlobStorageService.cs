namespace H2Oasis.Api.Services;

public interface IBlobStorageService
{
    Task UploadToBlobStorage(MemoryStream stream, string fileName);
    Task<byte[]> GetBlob(string key);
}