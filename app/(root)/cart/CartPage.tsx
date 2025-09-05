"use client";

import type React from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Map as MapIcon,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateOrderButton from "../product/_components/create-order.btn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
const MapUser = dynamic(() => import("./_components/map"), { ssr: false });
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  addOrdersZakaz,
  addToCart,
  removeFromCart,
} from "@/actions/user.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

// -----------------------------
// Types
// -----------------------------
type Seller = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
};

type Product = {
  productId: {
    _id: string;
    userId: object;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    imageKey: string;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  selleronId: Seller;
  _id: string;
};

type CartProps = {
  products: Product[];
};

type LocationData = {
  lat: string;
  lng: string;
  address?: string;
  isInBukhara: boolean;
  totalPrice: number;
};

type MapLocation = {
  lat: number;
  lng: number;
  address?: string;
  isInBukhara: boolean;
};

// -----------------------------
// Utils
// -----------------------------
function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function groupBySeller(products: Product[]) {
  if (!Array.isArray(products))
    return {} as Record<string, { seller: Seller; items: Product[] }>;

  const grouped: Record<string, { seller: Seller; items: Product[] }> = {};
  products.forEach((item) => {
    const seller = item.selleronId;
    const sellerId = seller._id;
    if (!grouped[sellerId]) grouped[sellerId] = { seller, items: [] };
    grouped[sellerId].items.push(item);
  });
  return grouped;
}

// -----------------------------
// Component
// -----------------------------
const CartPage: React.FC<CartProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const groupedBySeller = useMemo(() => groupBySeller(products), [products]);

  // Precompute total before any early returns (hooks order)
  const grandTotal = useMemo(() => calculateTotalPrice(products), [products]);

  const handleLocationSelect = (location: LocationData | null) => {
    if (location) setSelectedLocation(location);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-16 px-3">
        <Image
          src="/savat.png"
          alt="Bo'sh savat"
          width={320}
          height={320}
          className="mb-4 w-64 h-64 object-contain"
        />
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Do&apos;konga qaytish
          </Button>
        </Link>
      </div>
    );
  }

  async function updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    try {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
      const updatedCart = await addToCart({
        productId: product.productId._id,
        quantity: newQuantity,
        selleronId: product.selleronId._id,
      });
      if (updatedCart?.serverError) setProducts(initialProducts);
    } catch (e) {
      console.error("Error updating cart quantity:", e);
      setProducts(initialProducts);
    }
  }

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const calculateTotalPrice = (items: Product[]) =>
    items.reduce((t, i) => t + i.productId.price * i.quantity, 0);

  const handleInputChange = (e: boolean) => setChecked(!!e);

  async function handleOrderZakaz() {
    try {
      setIsLoading(true);
      if (!products?.length) {
        setIsLoading(false);
        return console.error("No products in cart");
      }

      const response = await addOrdersZakaz({
        totalPrice: formatPrice(calculateTotalPrice(products)),
        products: products.map((p) => ({
          productId: p.productId._id,
          selleronId: p.selleronId._id,
          quantity: p.quantity,
        })),
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
        isPaid: checked ? false : true,
      });

      if (response?.serverError) {
        console.error("Error creating order:", response.serverError);
        setIsLoading(false);
        return;
      }

      const removeResponse = await removeFromCart();
      if (removeResponse?.success === "Product removed from cart")
        router.push("/success");
      else setIsLoading(false);
    } catch (error) {
      console.error("Error creating order:", error);
      setIsLoading(false);
    }
  }
  // Mobile total precomputed above

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 pb-28">
      {/* pb-28 for mobile sticky bar safe space */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Savat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {Object.entries(groupedBySeller).map(([sellerId, group]) => {
            const sellerSubtotal = calculateTotalPrice(group.items);
            return (
              <Card
                key={sellerId}
                className="overflow-hidden border rounded-xl"
              >
                <div className="bg-gray-50 p-3 sm:p-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Sotuvchi: {group.seller.fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">
                    {group.seller.email}
                  </p>
                </div>

                <CardContent className="p-0">
                  {group.items.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 sm:p-4 border-b last:border-b-0"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.productId.image || "/placeholder.svg"}
                            alt={item.productId.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className="font-medium text-base sm:text-lg truncate"
                              title={item.productId.title}
                            >
                              {item.productId.title}
                            </h3>
                            <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                              {formatPrice(
                                item.productId.price * item.quantity
                              )}
                            </p>
                          </div>

                          {item.productId?.description && (
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                              {item.productId.description}
                            </p>
                          )}

                          <div className="mt-auto flex items-center justify-between gap-3">
                            {/* Qty stepper */}
                            <div className="flex items-center border rounded-md overflow-hidden">
                              <Button
                                aria-label="Kamaytirish"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-10 text-center text-sm sm:text-base">
                                {item.quantity}
                              </span>
                              <Button
                                aria-label="Ko'paytirish"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Remove */}
                            <Button
                              aria-label="O'chirish"
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeProduct(item._id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Seller subtotal */}
                <div className="bg-gray-50 p-3 sm:p-4 flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium">
                    Sotuvchi bo&apos;yicha jami:
                  </span>
                  <span className="font-bold text-base sm:text-lg">
                    {formatPrice(sellerSubtotal)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right: Summary (desktop/tablet) */}
        <div className="lg:col-span-1 hidden sm:block">
          <Card className="rounded-xl">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Buyurtma ma&apos;lumotlari
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">
                    Mahsulotlar ({products.length})
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Yetkazib berish</span>
                  <span>Bepul</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Jami</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id="terms"
                    checked={checked}
                    onCheckedChange={handleInputChange}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    Yetqazib berilgandan keyin to&apos;lov qilish
                  </Label>
                </div>

                {/* Location picker */}
                <AlertDialog
                  open={isLocationDialogOpen}
                  onOpenChange={setIsLocationDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <MapIcon className="h-4 w-4" />
                      {selectedLocation
                        ? "Manzilni o&apos;zgartirish"
                        : "Turgan joyingizni tanlang"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[96vw] sm:w-[90vw] max-w-[960px] max-h-[85vh] overflow-hidden p-0">
                    <AlertDialogHeader className="p-0">
                      <div className="h-[70vh] sm:h-[65vh]">
                        <MapUser
                          onLocationSelect={(location: MapLocation | null) =>
                            location &&
                            handleLocationSelect({
                              ...location,
                              lat: location.lat.toString(),
                              lng: location.lng.toString(),
                              totalPrice: grandTotal,
                            })
                          }
                        />
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="p-3 sm:p-4">
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={
                          !selectedLocation || !selectedLocation.isInBukhara
                        }
                        onClick={() => setIsLocationDialogOpen(false)}
                      >
                        Tasdiqlash
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Location status */}
                {selectedLocation && (
                  <div className="mt-2">
                    {selectedLocation.isInBukhara ? (
                      <Alert
                        variant="default"
                        className="bg-green-50 border-green-200"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle>Manzil tasdiqlandi</AlertTitle>
                        <AlertDescription className="text-sm">
                          {selectedLocation.address ||
                            `${Number.parseFloat(selectedLocation.lat).toFixed(
                              6
                            )}, ${Number.parseFloat(
                              selectedLocation.lng
                            ).toFixed(6)}`}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Noto&apos;g&apos;ri manzil</AlertTitle>
                        <AlertDescription className="text-sm">
                          Tanlangan manzil Buxoro viloyati chegarasidan
                          tashqarida. Iltimos, boshqa manzil tanlang.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Optional external action */}
                <CreateOrderButton
                  productId={""}
                  disabled={
                    !selectedLocation ||
                    !selectedLocation.isInBukhara ||
                    checked
                  }
                />

                <Button
                  className="w-full mt-2"
                  size="lg"
                  disabled={
                    !selectedLocation ||
                    !selectedLocation.isInBukhara ||
                    !checked ||
                    isLoading
                  }
                  onClick={handleOrderZakaz}
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Buyurtma berish"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-screen-md mx-auto px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Jami</p>
            <p className="text-lg font-bold">{formatPrice(grandTotal)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLocationDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <MapIcon className="h-4 w-4" /> Manzil
            </Button>
            <Button
              size="lg"
              onClick={handleOrderZakaz}
              disabled={
                !selectedLocation ||
                !selectedLocation.isInBukhara ||
                !checked ||
                isLoading
              }
              className="min-w-[140px]"
            >
              {isLoading ? <Loader className="animate-spin" /> : "Buyurtma"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
