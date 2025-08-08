"use client";

import Link from "next/link";
import { useState, useEffect, type FC, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addFavorite } from "@/actions/user.action";
import { toast } from "@/hooks/use-toast";
import useAction from "@/hooks/use-action";
import NoSSR from "@/components/shared/NoSSR";
import CustomImage from "@/components/shared/custom-image";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import type { IProduct } from "@/types";

interface Props {
  product: IProduct;
}

const ProductCard: FC<Props> = ({ product }) => {
  const { isLoading, onError, setIsLoading } = useAction();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Refresh qilganda favoritda bo'lsa, qizil qilish uchun
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favs.includes(product._id)) {
      setIsFavorite(true);
    }
  }, [product._id]);

  const onFavourite = async (e: MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await addFavorite({ id: product._id });
    if (res?.serverError || res?.validationErrors || !res?.data) {
      setIsLoading(false);
      return onError("Something went wrong");
    }
    if (res.data.failure) {
      setIsLoading(false);
      return onError(res.data.failure);
    }
    if (res.data.status === 200) {
      toast({ description: "Added to favorites" });
      setIsFavorite(true);
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favs.includes(product._id)) {
        localStorage.setItem(
          "favorites",
          JSON.stringify([...favs, product._id])
        );
      }
    }
    setIsLoading(false);
  };

  return (
    <Link href={`/product/${product?._id}`} className="group">
      <motion.div
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-[300px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div className="bg-secondary relative h-40">
          <CustomImage src={product.image! ?? ""} alt={product.title!} />
          <motion.div
            className="absolute right-0 top-0 flex items-center m-2"
            whileHover={{ scale: 1.1 }}
          >
            <Button
              size="icon"
              disabled={isLoading}
              onClick={onFavourite}
              asChild
              className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
              aria-label="Add to favorites"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                aria-label="Add to favorites"
              >
                <Heart color="white" />
              </motion.button>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.h3
            className="text-sm font-medium line-clamp-2 group-hover:text-purple-600 mb-1 break-words"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {product?.title.slice(0, 30).padEnd(30, "...")}
          </motion.h3>
          <div className="flex items-center gap-1 mb-2"></div>
          <motion.div
            className="flex flex-col"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <span className="text-sm text-gray-500">
              {product?.category?.name}
            </span>
            <div className="flex items-center gap-2 w-full">
              <span className="font-bold flex items-end justify-end">
                <NoSSR>
                  <motion.p
                    className="font-medium text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {formatPrice(product.price!)}
                  </motion.p>
                </NoSSR>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
