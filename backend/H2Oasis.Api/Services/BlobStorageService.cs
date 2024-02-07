using Azure.Storage.Blobs;

namespace H2Oasis.Api.Services;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _client;

    public BlobStorageService(BlobServiceClient client)
    {
        _client = client;
    }

    public async Task UploadToBlobStorage(MemoryStream stream, string fileName)
    {
        var blobContainer = _client.GetBlobContainerClient("plantapp");
        await blobContainer.CreateIfNotExistsAsync();
        var blobClient = blobContainer.GetBlobClient(fileName);

        await blobClient.UploadAsync(stream, true);
    }

    public async Task<byte[]> GetBlob(string key)
    {
        var blobContainer = _client.GetBlobContainerClient("plantapp");
        await blobContainer.CreateIfNotExistsAsync();
        var blobClient = blobContainer.GetBlobClient(key);
        await using var stream = await blobClient.OpenReadAsync();
        using var br = new BinaryReader(stream);
        return br.ReadBytes((int)stream.Length);
    }
}