import { getFavourites } from "@/actions/user.action";
import Pagination from "@/components/shared/pagination";
import { SearchParams } from "@/types";
import React, { FC, Suspense } from "react";
import WatchListCard from "./watch-list.card";
import EmptyState from "./empty-state";

interface Props {
  searchParams: SearchParams;
}

const Page: FC<Props> = async ({ searchParams }) => {
  const res = await getFavourites({
    searchQuery: `${searchParams.q || ""}`,
    filter: `${searchParams.filter || ""}`,
    page: `${searchParams.page || "1"}`,
    category: `${searchParams.category || ""}`,
  });

  const products = res?.data?.products || [];
  const isNext = res?.data?.isNext || false;

  return (
    <div className="container mx-auto">
      {/* Empty State */}
      {products.length === 0 ? (
        <EmptyState
          title="Hozircha sevimli mahsulotlar yo‘q"
          description="Sizga yoqqan mahsulotlarni yurakcha tugmasi bilan saralab qo‘ying — ular shu yerda saqlanadi."
          ctaHref="/"
          ctaText="Mahsulotlarni ko‘rish"
          // imageSrc="/empty/favorites.png" // Agar o'z rasmchingiz bo'lsa, shu yerga yo'lini qo'ying
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
            {products.map((item) => (
              <Suspense key={item._id}>
                <WatchListCard product={item} />
              </Suspense>
            ))}
          </div>

          <Pagination
            isNext={isNext}
            pageNumber={
              searchParams?.page?.toString() ? +searchParams.page.toString() : 1
            }
          />
        </>
      )}
    </div>
  );
};

export default Page;
