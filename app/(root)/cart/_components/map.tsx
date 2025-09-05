"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Share2, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[50vh]  w-full bg-muted/40 flex items-center justify-center text-sm rounded-xl border">
      Xarita yuklanmoqda...
    </div>
  ),
});

export default function MapUser({
  onLocationSelect,
}: {
  onLocationSelect?: (
    location: {
      lat: number;
      lng: number;
      address?: string;
      isInBukhara: boolean;
    } | null
  ) => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    isInBukhara?: boolean;
  } | null>(null);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    isInBukhara?: boolean;
  } | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  // Bukhara region coordinates (approx. center)
  const BUKHARA_CENTER: [number, number] = [39.7747, 64.4286];

  // Check if coordinates are within an approximate box around Bukhara (~100km)
  const isInBukharaRegion = (lat: number, lng: number): boolean => {
    const latDiff = Math.abs(lat - BUKHARA_CENTER[0]);
    const lngDiff = Math.abs(lng - BUKHARA_CENTER[1]);
    return latDiff < 0.9 && lngDiff < 1.2;
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    const isInBukhara = isInBukharaRegion(location.lat, location.lng);
    const updated = { ...location, isInBukhara } as const;
    setSelectedLocation(updated);

    fetchAddress(location.lat, location.lng).then((address) => {
      const withAddress = { ...updated, address };
      setSelectedLocation(withAddress);
      onLocationSelect?.(withAddress);
    });

    if (!isInBukhara) {
      toast({
        variant: "destructive",
        title: "Xatolik!",
        description:
          "Tanlangan joy Buxoro viloyati chegarasidan tashqarida. Iltimos, Buxoro viloyati ichidan joy tanlang.",
      });
    }
  };

  const getUserLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Xatolik!",
        description: "Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const isInBukhara = isInBukharaRegion(loc.lat, loc.lng);
        const updated = { ...loc, isInBukhara } as const;
        setUserLocation(updated);

        fetchAddress(loc.lat, loc.lng).then((address) => {
          const withAddress = { ...updated, address };
          setUserLocation(withAddress);
          onLocationSelect?.(withAddress);
        });

        setIsLocating(false);
        toast({
          title: "Joylashuv aniqlandi!",
          description: "Sizning joriy joylashuvingiz xaritada ko'rsatildi.",
          variant: isInBukhara ? "default" : "destructive",
        });
        if (!isInBukhara) {
          toast({
            variant: "destructive",
            title: "Xatolik!",
            description: "Joylashuv Buxoro viloyati chegarasidan tashqarida.",
          });
        }
      },
      (error) => {
        console.error("Geolokatsiya xatosi:", error);
        toast({
          variant: "destructive",
          title: "Xatolik!",
          description: "Joylashuvni aniqlab bo'lmadi. Brauzerda ruxsat bering.",
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      return data.display_name || "Noma'lum manzil";
    } catch (e) {
      console.error("Manzilni olishda xatolik:", e);
      return "Manzil topilmadi";
    }
  };

  return (
    <main className="w-full h-full">
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
          Buxoro viloyati xaritasi
        </h1>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="mb-4 sm:mb-6 inline-flex w-full rounded-full bg-muted p-1">
            <TabsTrigger
              value="map"
              className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Xarita
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Ma&apos;lumot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    Interaktiv xarita
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Xaritadan istalgan joyni tanlang yoki o&apos;z
                    joylashuvingizni aniqlang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] sm:h-[30vh] w-full rounded-xl overflow-hidden mb-3 sm:mb-4 border">
                    <MapWithNoSSR
                      center={[39.7747, 64.4286]}
                      onLocationSelect={handleLocationSelect}
                      userLocation={userLocation}
                      selectedLocation={selectedLocation}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:flex gap-2 sm:gap-3">
                    <Button
                      onClick={getUserLocation}
                      disabled={isLocating}
                      className="w-full sm:w-auto flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      {isLocating ? "Aniqlanmoqda..." : "Mening joylashuvim"}
                    </Button>

                    {selectedLocation && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" /> Tanlangan joyni ulashish
                      </Button>
                    )}

                    {userLocation && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" /> Mening joylashuvimni
                        ulashish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {selectedLocation && (
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> Tanlangan joy
                      </span>
                      {selectedLocation.isInBukhara !== undefined && (
                        <Badge
                          variant={
                            selectedLocation.isInBukhara
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {selectedLocation.isInBukhara
                            ? "Buxoro ichida"
                            : "Tashqarida"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Kenglik
                          </p>
                          <p className="font-medium">
                            {selectedLocation.lat.toFixed(6)}
                          </p>
                        </div>
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Uzunlik
                          </p>
                          <p className="font-medium">
                            {selectedLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>

                      {selectedLocation.address && (
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Manzil
                          </p>
                          <p className="font-medium break-words">
                            {selectedLocation.address}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Share2 className="h-4 w-4" /> Ulashish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {userLocation && (
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                      <span className="inline-flex items-center gap-2">
                        <Navigation className="h-5 w-5" /> Mening joylashuvim
                      </span>
                      {userLocation.isInBukhara !== undefined && (
                        <Badge
                          variant={
                            userLocation.isInBukhara
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {userLocation.isInBukhara
                            ? "Buxoro ichida"
                            : "Tashqarida"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Kenglik
                          </p>
                          <p className="font-medium">
                            {userLocation.lat.toFixed(6)}
                          </p>
                        </div>
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Uzunlik
                          </p>
                          <p className="font-medium">
                            {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>

                      {userLocation.address && (
                        <div className="bg-muted/40 p-3 rounded-md">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Manzil
                          </p>
                          <p className="font-medium break-words">
                            {userLocation.address}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Share2 className="h-4 w-4" /> Ulashish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedLocation && !userLocation && (
                <Card className="rounded-2xl border shadow-sm md:col-span-2">
                  <CardHeader>
                    <CardTitle>Ma&apos;lumot mavjud emas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-6">
                      Xarita bo&apos;limidan joyni tanlang yoki o&apos;z
                      joylashuvingizni aniqlang
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Toaster />
      </div>
    </main>
  );
}
