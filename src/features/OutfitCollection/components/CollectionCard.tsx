interface CollectionCardProps {
  id: string;
  imgURL: string;
  onClick: (id: string, imgURL: string) => void;
}

const CollectionCard = ({
  id,
  imgURL,
  onClick,
}: CollectionCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id, imgURL)}
      className="
        group
        relative
        aspect-square
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-500
        transition-transform
        duration-200
        hover:scale-105
        cursor-pointer
      "
    >
      <img
        src={imgURL}
        alt="outfit"
        className="h-full w-full object-contain"
      />
    </button>
  );
};

export default CollectionCard;