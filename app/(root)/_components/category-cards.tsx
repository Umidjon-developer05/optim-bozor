import { getCategories } from "@/actions/user.action";
import Link from "next/link";
export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

async function CategoryCards() {
  const category: CategoriesResponse = await getCategories();
  if (!category) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {category?.categories?.map((item, index) => (
        <Link
          key={index}
          href={`/catalog/${item.slug ? item.slug : item._id}`}
          className="bg-gray-100 rounded-xl p-4 flex justify-center  items-center hover:shadow-md transition-shadow"
        >
          <span className="text-lg">{item?.image}</span>
          <span className="text-center text-sm font-medium">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
export default CategoryCards;
