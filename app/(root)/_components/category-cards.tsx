import { getCategories } from "@/actions/user.action";
import Image from "next/image";
import Link from "next/link";

export interface Category {
  _id: string;
  name: string;
  image: string; // can be emoji or URL
  slug: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

function isUrlLike(src?: string) {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("http");
}

export default async function CategoryCards() {
  const data: CategoriesResponse = await getCategories();
  if (!data?.categories?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {data.categories.map((item) => {
        const href = `/catalog/${item.slug ? item.slug : item._id}`;
        const showImage = isUrlLike(item.image);
        return (
          <Link
            key={item._id}
            href={href}
            prefetch={false}
            aria-label={`${item.name} kategoriyasiga o'tish`}
            className="group bg-gray-100 hover:bg-white rounded-2xl p-3 sm:p-4 md:p-5 border border-transparent hover:border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-h-[56px]">
              {showImage ? (
                <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white ring-1 ring-gray-200 overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white ring-1 ring-gray-200 flex items-center justify-center text-xl">
                  {item.image || "🏷️"}
                </div>
              )}

              <span className="text-sm sm:text-base font-medium text-gray-900 leading-snug break-words">
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
