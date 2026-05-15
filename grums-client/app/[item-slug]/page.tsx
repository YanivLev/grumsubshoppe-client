import getItemById from "@/app/actions/item/get-item";
import SubCustomizer from '@/app/components/organisms/SubCustomizer';
import { getModifierGroups, getModifiers } from "@/app/actions/item/get-modifiers";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";

export async function generateMetadata(props: { searchParams: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const itemData = await getItemById(searchParams.id);
  return {
    title: `${itemData.name} | Grums Subshoppe`,
  };
}

export default async function EditSubPage(props: {
  params: Promise<{ 'item-slug': string }>;
  searchParams: Promise<{ id: string; edit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const slug = params['item-slug'];
  const editCartItemId = searchParams.edit;
  const itemId = searchParams.id;

  const item = await getItemById(itemId);

  const groups = await getModifierGroups(itemId);
  const modifierGroups = await Promise.all(
    groups.map(async (group: IModifierGroup) => {
      const modifiers = await getModifiers(group.id);
      return { ...group, modifiers: { elements: modifiers } };
    })
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <SubCustomizer
        item={item}
        modifierGroups={modifierGroups}
        itemPath={`/${slug}?id=${itemId}`}
        editCartItemId={editCartItemId}
      />
    </main>
  );
}
