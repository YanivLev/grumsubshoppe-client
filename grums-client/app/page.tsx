import MenuManager from "@/app/components/organisms/MenuManager";
import HeroSection from "@/app/components/organisms/HeroSection";
import getCategories from "./actions/menu/get-categories";

export default async function Home() {
    const categories = await getCategories();

  // if (!categories.items || categories.items.length === 0) {
  //   return <p className="text-center py-10">No items available.</p>;
  // }

  return (
    <>
      <HeroSection />
      <section id="menu" className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black uppercase italic">Menu</h2>
        <p className="text-gray-500">Choose a category to view items</p>
      </div>
      
        <MenuManager initialCategories={categories} />
      </section>
    </>
  );
}
