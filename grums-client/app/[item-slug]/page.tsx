import getItemById from "@/app/actions/item/get-item";
import SubCustomizer from '@/app/components/organisms/SubCustomizer';
import { getModifierGroups, getModifiers } from "@/app/actions/item/get-modifiers";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import { IItemGroup } from "../common/interfaces/item-group.interface";
import { IItem } from "../common/interfaces/item.interface";
import getItemGroupById from "../actions/item/get-item-group";
import { Metadata } from "next";

export async function generateMetadata(props: { searchParams: Promise<{ id: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  let itemData: IItem | IItemGroup;
  try {
    itemData = await getItemById(searchParams.id);
  } catch {
    itemData = await getItemGroupById(searchParams.id);
  }
  return {
    title: `${itemData.name} | Grums Subshoppe`,
  };
}

export default async function EditSubPage(props: {
  params: Promise<{ 'item-slug': string }>;
  searchParams: Promise<{ id: string; edit?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params['item-slug'];
  const itemId = searchParams.id;
  const editCartItemId = searchParams.edit;
  let item: IItem;
  let variations: IItem[] | undefined;
  
  try {
    item = await getItemById(itemId);
  } catch {
    const itemGroup = await getItemGroupById(itemId);
    variations = itemGroup.items.elements;
    item = variations[0];
  }


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
        variations={variations}
        modifierGroups={modifierGroups}
        itemPath={`/${slug}?id=${itemId}`}
        editCartItemId={editCartItemId}
      />
    </main>
  );
}
