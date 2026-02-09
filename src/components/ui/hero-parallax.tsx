"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface ProductItem {
  title: string;
  link: string;
  thumbnail?: string;
  gradient?: string;
}

interface HeroParallaxProps {
  products: ProductItem[];
  heading?: React.ReactNode;
  subheading?: string;
}

export function HeroParallax({
  products,
  heading,
  subheading,
}: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-4 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header heading={heading} subheading={subheading} />
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className=""
      >
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateXReverse}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Header({
  heading,
  subheading,
}: {
  heading?: React.ReactNode;
  subheading?: string;
}) {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
      <h2 className="text-2xl font-bold text-foreground sm:text-4xl md:text-7xl">
        {heading ?? (
          <>
            The Ultimate <br /> development studio
          </>
        )}
      </h2>
      {subheading && (
        <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-xl">
          {subheading}
        </p>
      )}
    </div>
  );
}

function ProductCard({
  product,
  translate,
}: {
  product: ProductItem;
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative h-96 w-[30rem] flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            className="absolute inset-0 h-full w-full rounded-lg object-cover object-top-left"
            alt={product.title}
            width={800}
            height={600}
            loading="lazy"
          />
        ) : (
          <div
            className={`absolute inset-0 h-full w-full rounded-lg ${product.gradient ?? "bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"}`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
              <div className="h-3 w-2/3 rounded-full bg-white/20" />
              <div className="h-2 w-full rounded-full bg-white/10" />
              <div className="h-2 w-4/5 rounded-full bg-white/10" />
              <div className="mt-4 h-8 w-1/3 rounded-lg bg-white/15" />
            </div>
          </div>
        )}
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-lg bg-black opacity-0 transition-opacity group-hover/product:opacity-80" />
      <h3 className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity group-hover/product:opacity-100">
        {product.title}
      </h3>
    </motion.div>
  );
}
