import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetchClothesByCategory from "../../../api/clothes";
import WardrobeCard from "../components/WardrobeCard";
import type { ClothingCategory } from "../../../constants/Categories";


export default function WardrobeDisplay() {
  const { category } = useParams<{ category: ClothingCategory }>();

  //fetch data from clothes_table using tan stack query depending on category
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clothes", category],
    queryFn: () => fetchClothesByCategory(category!),
    enabled: Boolean(category) //query is only enabled if category exists
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading items...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-500">
        {error instanceof Error ? error.message : "Failed to load items."}
      </p>
    );
  }

 
  return (
    <div>
      {/* <p className="mb-4 text-slate-600">
        Showing all items in {category}
      </p> */}

      {items && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <WardrobeCard 
            key={Number(item.id)} 
            id={Number(item.id)} 
            itemName={item.item_name} 
            category={item.category} 
            image_path={item.image_path}
            stickerUrl = {item.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}