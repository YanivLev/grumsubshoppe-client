import getItems from "@/app/actions/menu/get-items";
import getItemGroups from "@/app/actions/menu/get-item-groups";
import MenuManager from "@/app/components/organisms/MenuManager";

export default async function Home() {
  const items = await getItems();
  const itemGroups = await getItemGroups();

  if (!items || items.length === 0) {
    return <p className="text-center py-10">No items available.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black uppercase italic">Menu</h2>
        <p className="text-gray-500">Choose a category to view items</p>
      </div>
      <MenuManager initialItemGroups={itemGroups} initialItems={items} />
    </section>
  );
}
