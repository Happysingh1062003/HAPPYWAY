'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const GALLERY_IMAGES = [
  { src: '/nyc_dream.png', alt: 'Cinematic New York City skyline at golden hour' },
  { src: '/sf_dream.png', alt: 'Golden Gate Bridge in dramatic mist' },
  { src: '/tech_hub.png', alt: 'Modern Silicon Valley technology campus' },
  { src: '/ivy_dream.png', alt: 'Prestigious Ivy League university campus' },
  { src: '/coast_dream.png', alt: 'Pacific Coast Highway sunset' },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="relative py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="flex gap-4 md:gap-5 px-4 md:px-8 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            className="relative flex-shrink-0 w-[200px] md:w-[260px] h-[150px] md:h-[200px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 200px, 260px"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
