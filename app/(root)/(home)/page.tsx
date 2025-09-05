import {  getProducts } from "@/actions/user.action";
import Pagination from "@/components/shared/pagination";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/types";
import { FC } from "react";
import ProductGrid from "../_components/product-grid";
import Banner from "../_components/banner";
import CategoryCards from "../_components/category-cards";
import Footer from "../_components/footer";
export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

interface Props {
  searchParams: SearchParams;
}
const Page: FC<Props> = async (props) => {
  const searchParams = props.searchParams;
  const res = await getProducts({
    searchQuery: `${searchParams.q || ""}`,
    filter: `${searchParams.filter || ""}`,
    category: `${searchParams.category || ""}`,
    page: `${searchParams.page || "1"}`,
  });

  const products = res?.data?.products;
  const isNext = res?.data?.isNext || false;
  return (
    <>
      <div className="container max-w-7xl">
        <div className="w-full">
          <Banner />
        </div>
        <CategoryCards />
        <Separator className="my-3" />
        {products && <ProductGrid products={products} />}

        <Pagination
          isNext={isNext}
          pageNumber={
            searchParams?.page?.toString() ? +searchParams.page.toString() : 1
          }
        />
      </div>
      <Footer />
    </>
  );
};

export default Page;
