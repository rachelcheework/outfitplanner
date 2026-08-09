import { IoIosClose } from "react-icons/io";

interface CollectionCardProps {
    id: string;
    imgURL: string;
    onDelete: (id: string)=>void
}

const CollectionCard = ({id, imgURL, onDelete}: CollectionCardProps) => {
  return (
    <div
    key={id}
    id={id}
    className="group relative h-50 w-50 border border-gray-500 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105"
    >
        <img src={imgURL} alt="outfit" className="w-full object-cover"/>
        <button className="absolute top-2 right-2 hidden h-8 w-8 items-center justify-center border border-gray-900 bg-white rounded-full group-hover:flex"
        onClick={()=> onDelete(id)}>
            <IoIosClose size={24}/>
        </button>    
    </div>
  )
}

export default CollectionCard
