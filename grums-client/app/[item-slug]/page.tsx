import getItemGroupById from "@/app/actions/item/get-item-group";
import getItemById from "@/app/actions/item/get-item";
import SubCustomizer from '@/app/components/organisms/SubCustomizer';

export async function generateMetadata(props: { searchParams: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const itemGroupData = await getItemGroupById(searchParams.id);
  return {
    title: `${itemGroupData.name} | Grums Subshoppe`,
  };
}

export default async function EditSubPage(props: {
  params: Promise<{ 'item-slug': string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;

  const groupId = searchParams.id;
  const itemGroupData = await getItemGroupById(groupId);
  const isItemGroup = (itemGroupData?.items?.elements?.length ?? 0) > 0;

  const variations = isItemGroup ? itemGroupData.items.elements : [];
  const itemData = isItemGroup ? null : await getItemById(groupId);

  return (
    <main className="p-10">
      {isItemGroup ? (
        <SubCustomizer
          itemGroupName={itemGroupData.name}
          variations={variations}
        />
      ) : (
        <SubCustomizer
          itemName={itemData?.name}
          variations={[itemData]}
          initialItem={itemData}
        />
      )}
    </main>
  );
}
