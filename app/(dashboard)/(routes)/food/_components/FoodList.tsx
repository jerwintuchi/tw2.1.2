
interface FoodListProps {
    photos: { id: string; photo_name: string; photo_url: string }[]
    deletePhoto: (id: string, photo_url: string) => void
}

export default function FoodList({ photos, deletePhoto }: FoodListProps) {
    return (
        <div className="">FoodList</div>
    )
}
