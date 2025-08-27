"use client";
import { Subcategory } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
type SlugClientProps = {
  subcategories: Subcategory[];
  slug: string;
};
function SlugClient({ subcategories, slug }: SlugClientProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate how many items to show per column for even distribution
  const itemsPerColumn = Math.ceil(subcategories.length / 3);

  // Split subcategories into three columns
  const column1 = subcategories.slice(0, itemsPerColumn);
  const column2 = subcategories.slice(itemsPerColumn, itemsPerColumn * 2);
  const column3 = subcategories.slice(itemsPerColumn * 2);
  const column4 = subcategories.slice(itemsPerColumn * 3);
  return (
    <div>
      <div className="flex-1">
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold mr-2">{slug.toUpperCase()}</h1>
          <span className="text-gray-500 text-sm">
            {subcategories.length} toifalar
          </span>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <div className="mb-8">
              <ul className="space-y-2">
                {column1.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/category/${item?.slug}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {column1.length > 5 && (
                <button
                  className="flex items-center text-blue-600 mt-2"
                  onClick={() => toggleSection("column1")}
                >
                  Ko&apos;proq{" "}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 ${
                      expandedSections.column1 ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Column 2 */}
          {column2.length > 0 && (
            <div>
              <div className="mb-8">
                <ul className="space-y-2">
                  {column2.map((item) => (
                    <li key={item._id}>
                      <Link
                        href={`/category/${slug}-${item._id}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {column2.length > 5 && (
                  <button
                    className="flex items-center text-blue-600 mt-2"
                    onClick={() => toggleSection("column2")}
                  >
                    Ko&apos;proq{" "}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 ${
                        expandedSections.column2 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Column 3 */}
          {column3.length > 0 && (
            <div>
              <div className="mb-8">
                <ul className="space-y-2">
                  {column3.map((item) => (
                    <li key={item._id}>
                      <Link
                        href={`/category/${slug}-${item._id}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {column3.length > 5 && (
                  <button
                    className="flex items-center text-blue-600 mt-2"
                    onClick={() => toggleSection("column3")}
                  >
                    Ko&apos;proq{" "}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 ${
                        expandedSections.column3 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Column 4 */}
          {column4.length > 0 && (
            <div>
              <div className="mb-8">
                <ul className="space-y-2">
                  {column4.map((item) => (
                    <li key={item._id}>
                      <Link
                        href={`/category/${slug}-${item._id}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {column4.length > 5 && (
                  <button
                    className="flex items-center text-blue-600 mt-2"
                    onClick={() => toggleSection("column3")}
                  >
                    Ko&apos;proq{" "}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 ${
                        expandedSections.column3 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlugClient;
