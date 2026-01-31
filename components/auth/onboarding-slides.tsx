"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function OnboardingSlides({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("onboarding");
  const slides = [
    {
      title: t("slide1_title"),
      description: t("slide1_description"),
      image:
        "https://api.infocom.uz/storage/uploads/2025-05/1747808487dGlbKFIhPG7zdE17.png",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: t("slide2_title"),
      description: t("slide2_description"),
      image:
        "https://img.freepik.com/free-photo/pawns-world-globe-with-blue-background_23-2149407876.jpg?semt=ais_hybrid&w=740&q=80",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: t("slide3_title"),
      description: t("slide3_description"),
      image:
        "https://www.reviewofreligions.org/wp-content/uploads/2021/01/knowledge-small-shutterstock_1291221574--1024x629.jpeg",
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (page + newDirection === slides.length) {
      onComplete();
      return;
    }
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden relative">
        {/* Background gradient animation */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${slides[page].gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative p-6 space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full bg-white`}
                initial={false}
                animate={{
                  width: index === page ? "2rem" : "0.5rem",
                  opacity: index === page ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Image and content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="space-y-6"
            >
              {/* Image container */}
              <div className="relative h-60 w-full overflow-hidden rounded-lg">
                <Image
                  src={slides[page].image}
                  alt={slides[page].title}
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              {/* Text content */}
              <div className="space-y-4 text-center">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold tracking-tight text-foreground/90"
                >
                  {slides[page].title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base text-foreground/70 leading-relaxed"
                >
                  {slides[page].description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            <AnimatePresence>
              {page > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full text-foreground group hover:text-foreground/90"
                    onClick={() => paginate(-1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    {t("back_button")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`w-full bg-primary hover:bg-primary/90 text-white ${
                  page === 0 ? "col-span-2" : ""
                }`}
                onClick={() => paginate(1)}
              >
                {page === slides.length - 1 ? (
                  t("start_button")
                ) : (
                  <>
                    {t("continue_button")}
                    <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}