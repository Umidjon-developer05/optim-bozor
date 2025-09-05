"use client";
import { Category } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CatalogSiderbar({
  categories,
}: {
  categories: Category[];
}) {
  const { slug } = useParams();
  return (
    <div className="w-full md:w-[400px]">
      <div className="border rounded-lg p-4 bg-white">
        {categories?.map((category) => (
          <Link
            href={`/catalog/${category.slug}`}
            key={category._id}
            className={`flex items-center gap-2 py-2 px-3 rounded-md mb-1 ${
              category?.slug === slug
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{category.image}</span>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
