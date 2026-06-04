import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css"

export default function MenuItemSkeleton() {
    return (
        <div className="mb-1.5">
            <div className="flex justify-center mb-4">
                <Skeleton className="!w-80 !h-20 md:!w-130 md:!h-24" borderRadius={24}/>
            </div>
        </div>
    )
}