import { useQuery } from "@tanstack/react-query";
import fetchOutfits from "../helper/fetchOutfits";

const CollectionPage = () => {

  const {
    data: outfits = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["outfits"],
    queryFn: fetchOutfits,
  });

  if (isLoading) {
    return <p>Loading outfits...</p>;
  }

  if (isError) {
    return (
      <p>
        {error instanceof Error
          ? error.message
          : "Failed to load outfits."}
      </p>
    );
  }
  return (
    <div>
      <main className="grid grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <article key={outfit.id}>
            {outfit.outfitImageUrl && (
              <img
                src={outfit.outfitImageUrl}
                alt={"outfit"}
                className="w-full rounded-lg object-cover border border-gray-500"
              />
            )}
          </article>
        ))}
      </main>
    </div>
  )
}

export default CollectionPage
