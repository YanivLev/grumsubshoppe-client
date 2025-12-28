import Grid from '@mui/material/Grid';
import getItems from "./actions/get-items";
import Item from "./item";

export default async function Items() {
    // Only one call to the backend
    const items = await getItems();

    if (!items || items.length === 0) {
        return <p className="text-center py-10">No items available.</p>;
    }

    return (
        // <Grid container spacing={3} sx={{width: '100%'}}>
        //     {/* The .map creates exactly one component per ID in your array */}
        //     {items.map((item: any) => (
        //         <Grid key={item.id} size={{ xs: 12, sm: 4, lg: 2 }}>
        //             <Item item={item} />
        //         </Grid>
        //     ))}
        // </Grid>

        <Grid container spacing={2}>
            {items.map((item: any) => (
                <Grid key={item.id} size={4}>
                    <Item item={item} />
                </Grid>
            ))}
        </Grid>
    );
}