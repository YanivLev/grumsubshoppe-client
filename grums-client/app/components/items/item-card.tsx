import {Card, Typography} from "@mui/material";
import {Item as IItem} from "./interfaces/item.interface";
import rightArrow from "../icons/RightArrow.svg";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";

interface ItemProps {
    item: IItem;
}

export default function Item({item}: ItemProps) {
    return (
        
<Box id="Box" className="bg-linear-to-t from-white to-gray-100 w-110 h-20 rounded-3xl h-24 justify-center text-center flex 
                has-[button:hover]:shadow-2xl has-[button:hover]:-translate-y-2 has-[button:hover]:bg-green-50 transition-all duration-300 ease-in-out">
    
    <Stack direction="row" spacing={2} alignItems="center" className="w-full h-full px-2">

        <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
             {/* Placeholder for menuImageMap logic */}
        </div>

        <div className="text-left flex-grow">
            <Typography variant="h6" className="font-bold leading-tight">
                {item.name}
            </Typography>
            <Typography sx={{WebkitLineClamp: 2}} variant="body2" className="text-gray-500 line-clamp-1">
                Mayo, Lettuce, Onions, Tomato, 
                <br />
                Turkey, Provolone, Spices
            </Typography>
        </div>

        <div>
            {/* The Plus/Arrow Button */}
            <button className="flex cursor-pointer items-center justify-center">
                <img src={rightArrow.src} alt="Right Arrow" className="w-10 h-10"/>
            </button>
        </div>   
    </Stack>
</Box>   
    );
}