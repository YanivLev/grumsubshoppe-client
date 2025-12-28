import {Card, Typography} from "@mui/material";
import {Item as IItem} from "./interfaces/item.interface";

interface ItemProps {
    item: IItem;
}

export default function Item({item}: ItemProps) {
    return (
        <Card className="p-4">
            <Typography variant="h5">{item.name}</Typography>
            <Typography>${item.price/100}</Typography>
        </Card>
    );
}