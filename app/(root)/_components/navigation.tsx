import Link from "next/link";
import { ChevronDown } from "lucide-react";
export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}
function Navigation({ categories }: { categories: Category[] }) {
  return (
    <div className="container sm:mt-2  overflow-x-auto">
      <div className="flex  gap-6  min-w-max">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/catalog/${category.slug}`}
            className={`whitespace-nowrap ${
              category.slug
                ? "text-purple-600 font-medium"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            {category.image && <span className="mr-1">{category.image}</span>}
            {category.name}
          </Link>
        ))}
        <Link
          href="/catalog"
          className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-purple-600"
        >
          Yana <ChevronDown size={16} />
        </Link>
      </div>
    </div>
  );
}

export default Navigation;
