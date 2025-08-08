import { IProduct } from "@/types";
import ProductCard from "./product-card";

const ProductGrid = ({ products }: { products: IProduct[] }) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">Optim mahsulotlar</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
