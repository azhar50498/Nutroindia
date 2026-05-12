import { motion, useScroll, useTransform } from "motion/react";
import { Link, MapPin, MessageCircle, Search, Wheat, Leaf, Maximize2, Instagram, Facebook, Twitter } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

// --- Product Data ---
const PRODUCTS = [
  {
    id: "a2-ghee",
    name: "A2 Desi Cow Ghee",
    category: "Ghee",
    description: "Traditionally churned using the Bilona method for unparalleled purity and aroma.",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?q=80&w=800", 
  },
  {
    id: "raw-honey",
    name: "Wild Forest Honey",
    category: "Honey",
    description: "Ethically harvested from deep Indian forests. Unheated, unpasteurized, and raw.",
    price: "₹649",
    image: "https://images.unsplash.com/photo-1471193945509-9ec4344e21a2?auto=format&fit=crop&q=90&w=800", 
  },
  {
    id: "cold-pressed-oil",
    name: "Wood-Pressed Mustard Oil",
    category: "Oils",
    description: "Extracted without heat to retain natural antioxidants, pungent flavor, and rich color.",
    price: "₹349",
    image: "https://images.unsplash.com/photo-1615486171448-4fdcb382d62d?q=80&w=800", 
  },
  {
    id: "organic-turmeric",
    name: "Lakadong Turmeric",
    category: "Spices",
    description: "High-curcumin turmeric powder sourced directly from the untouched hills of Meghalaya.",
    price: "₹450",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=90&w=800", 
  },
];

const CATEGORIES = ["All", "Ghee", "Honey", "Oils", "Spices"];

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
};

// --- Product Card Component with Parallax ---
function ProductCard({ product, index }: { product: typeof PRODUCTS[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
    >
      {/* Image Container */}
      <div className="overflow-hidden aspect-square w-full mb-6 relative rounded-xl">
        <div className="absolute inset-0 bg-forest/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
        <motion.div style={{ y }} className="absolute inset-0 h-[120%] -mt-[10%] w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-serif text-2xl mb-2 text-forest">{product.name}</h3>
        <p className="text-sm font-light text-forest/80 leading-relaxed mb-6 flex-1">
          {product.description}
        </p>
        
        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between border-t border-forest/10 pt-4">
          <span className="text-xl tracking-wider font-medium text-forest">{product.price}</span>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(
              "Hello NutroIndia, I am interested in ordering the " +
                product.name +
                " (" +
                product.price +
                "). Please share the next steps."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-gold shadow-[0_0_15px_rgba(15,41,30,0.1)] transition-all duration-300 hover:scale-110 hover:bg-forest/90"
            aria-label={`Buy ${product.name} via WhatsApp`}
          >
            <MessageCircle className="h-5 w-5 fill-current transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const spotlightRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spotlightRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const originRef = useRef<HTMLDivElement>(null);
  const journeyVideoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress: originScrollProgress } = useScroll({
    target: originRef,
    offset: ["start end", "end start"]
  });
  const originY = useTransform(originScrollProgress, [0, 1], ["-15%", "15%"]);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 font-sans text-forest selection:bg-emerald-900 selection:text-white">
      {/* Navigation */}
      <nav
        className={`fixed z-50 transition-all duration-500 transform-gpu ${
          scrolled 
            ? "top-2 left-4 right-4 md:left-[10%] md:right-[10%] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl py-2 px-6 opacity-95 scale-95" 
            : "top-4 left-4 right-4 md:left-12 md:right-12 bg-transparent py-4 px-6 md:px-0 opacity-100 scale-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`font-serif text-2xl font-bold tracking-wider ${
                scrolled ? "text-forest" : "text-white"
              }`}
            >
              NUTROINDIA
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("harvest")}
            className={`hidden rounded-2xl border px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300 md:block ${
              scrolled
                ? "text-forest border-forest hover:bg-forest hover:text-white"
                : "text-white border-white hover:bg-white hover:text-forest shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
            }`}
          >
            ORDER NOW
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000"
          alt="Clean, vast green wheat field"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl flex flex-col items-center"
          >
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl font-medium leading-tight tracking-tight text-white drop-shadow-md sm:text-6xl md:text-8xl"
            >
              Pure. Natural. <br />
              <span className="text-white drop-shadow-md">Traditional.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-light tracking-wide text-white drop-shadow-sm sm:text-xl md:text-2xl"
            >
              From Our Farms To Your Family. <br className="hidden md:block" />
              Experience the true essence of Indian organic foods.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("harvest")}
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-white px-8 py-4 font-semibold text-forest shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] rounded-2xl transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
              >
                <span className="tracking-widest">EXPLORE OUR HARVEST</span>
                <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Journey of Purity */}
      <section className="py-24 md:py-32 relative" id="journey">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-[60%_auto] lg:gap-24">
            {/* Left Video */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={imageReveal}
              className="relative aspect-video w-full overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl group"
            >
              <div className="absolute inset-0 bg-gold/5 z-10 mix-blend-overlay pointer-events-none"></div>
              <video
                ref={journeyVideoRef}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1596541223130-5d56a75bf1ad?auto=format&fit=crop&q=80&w=1200"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-honey-dripping-from-a-wooden-dipper-into-a-jar-41221-large.mp4"
                  type="video/mp4"
                />
              </video>
              <button
                onClick={(e) => {
                  if (journeyVideoRef.current) {
                    if (journeyVideoRef.current.requestFullscreen) {
                      journeyVideoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-forest/90 text-gold opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-forest group-hover:opacity-100"
                aria-label="Full Screen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Right Typography */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col justify-center"
            >
              <motion.div variants={fadeUp} className="mb-4">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
                  Transparent. Traditional. Trusted.
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-4xl leading-tight text-forest md:text-5xl"
              >
                See the Purity <br />
                <span className="italic text-gold">in Motion.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg font-light leading-relaxed text-forest/80"
              >
                We have nothing to hide. Watch how we preserve the soul of nature through our traditional cold-pressed and stone-ground methods. No chemicals, no heat, just raw nutrition.
              </motion.p>
              
              <motion.ul variants={staggerContainer} className="mt-10 space-y-5">
                {[
                  "Traditional Cold-Pressed Process.",
                  "Zero Additives or Preservatives.",
                  "Lab-Tested for 100% Purity."
                ].map((point, idx) => (
                  <motion.li key={idx} variants={fadeUp} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/5 shadow-sm">
                      <Leaf className="h-4 w-4 text-forest" />
                    </div>
                    <span className="text-sm font-medium tracking-wide text-forest/90">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Origin Section */}
      <section className="py-24 md:py-32 relative" id="origin">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
            {/* Left Image */}
            <motion.div
              ref={originRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={imageReveal}
              className="group relative aspect-[4/5] w-full overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl"
            >
              <div className="absolute inset-0 bg-gold/10 z-10 mix-blend-overlay"></div>
              <motion.div style={{ y: originY }} className="absolute inset-0 h-[130%] -mt-[15%] w-full">
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000"
                  alt="Raw organic spices"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>
              {/* Decorative Geometric Elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 border-l-2 border-t-2 border-gold z-20"></div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b-2 border-r-2 border-gold z-20"></div>
            </motion.div>

            {/* Right Typography */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col justify-center"
            >
              <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3 text-gold">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-widest uppercase">
                  Rooted In India
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-4xl leading-tight text-forest md:text-5xl lg:text-6xl"
              >
                Honoring the <br />
                <span className="italic text-gold">Wisdom of the Earth</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-8 text-lg font-light leading-relaxed text-forest/80"
              >
                At NutroIndia, we believe that food is medicine. We bypass industrial processing
                to bring you raw, unadulterated nourishment directly from indigenous farmers who
                still cultivate the land with reverence.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg font-light leading-relaxed text-forest/80"
              >
                No synthetics. No shortcuts. Just the pure, geometric perfection of nature,
                bottled and brought to your table.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-24 md:py-32 relative" id="spotlight">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
            
            {/* Left Typography */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-2 flex flex-col justify-center md:order-1"
            >
              <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3 text-gold">
                <span className="h-[1px] w-8 bg-gold"></span>
                <span className="text-sm font-semibold tracking-widest uppercase text-gold">
                  Ingredient Spotlight
                </span>
                <span className="h-[1px] w-8 bg-gold"></span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-4xl leading-tight text-forest md:text-5xl lg:text-6xl"
              >
                The Golden Root <br />
                <span className="italic text-gold">of Meghalaya</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-8 text-lg font-light leading-relaxed text-forest/80"
              >
                Sourced directly from the pristine hills of Northeast India, our Lakadong Turmeric is globally renowned for its exceptionally high curcumin content. Cultivated without chemicals, it captures the raw vitality of the soil.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg font-light leading-relaxed text-forest/80"
              >
                Revered in Ayurveda as a potent anti-inflammatory and immunity-boosting miracle, this vibrant golden root is the cornerstone of traditional healing and authentic culinary heritage.
              </motion.p>
            </motion.div>

            {/* Right Image */}
            <motion.div
              ref={spotlightRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={imageReveal}
              className="group relative aspect-[4/5] w-full overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl order-1 md:order-2"
            >
              <div className="absolute inset-0 z-10 bg-forest/20 mix-blend-overlay"></div>
              {/* Minimalist border inside the image container */}
              <div className="absolute inset-6 z-20 border border-gold/30 pointer-events-none transition-all duration-700 group-hover:inset-4 group-hover:border-gold/60"></div>
              <motion.div style={{ y }} className="absolute inset-0 h-[130%] -mt-[15%] w-full">
                <img
                  src="https://images.unsplash.com/photo-1606913084603-3e7702b01627?auto=format&fit=crop&q=80&w=1200"
                  alt="Lakadong Turmeric Root and Powder"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* The Harvest (Product Showcase) */}
      <section className="py-24 pb-32 text-forest relative" id="harvest">
        {/* Subtle background texture/pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-forest to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-20 text-center"
          >
            <h2 className="font-serif text-4xl font-medium tracking-wide md:text-5xl">
              The <span className="italic text-gold">Harvest</span>
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 bg-gold"></div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex flex-col items-center gap-6"
          >
            {/* Search Bar */}
            <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-3 pl-11 text-forest placeholder:text-forest/60 focus:outline-none transition-colors font-light tracking-wide rounded-2xl"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest/60" />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    backgroundColor: selectedCategory === category ? "#0F291E" : "rgba(255, 255, 255, 0.6)",
                    color: selectedCategory === category ? "#FDFBF7" : "#0F291E",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`px-5 py-2 text-sm tracking-wide transition-all ${
                    selectedCategory === category 
                      ? "rounded-2xl border border-forest shadow-md"
                      : "bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl hover:bg-white/80"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-50 py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <h2 className="font-serif text-3xl font-bold tracking-widest text-white mb-6">NUTROINDIA</h2>
            <p className="text-sm leading-relaxed text-emerald-100/80 font-light">
              Elevating the daily ritual of nourishment with pure, unadulterated ingredients. We bypass industrial processing to bring you raw, geometric perfection of nature.
            </p>
          </div>
          <div>
            <h3 className="font-bold tracking-widest text-emerald-400 uppercase text-xs mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm font-light text-emerald-100/80">
              <li>Our Farms</li>
              <li>The Process</li>
              <li>Lab Reports</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold tracking-widest text-emerald-400 uppercase text-xs mb-4">Our Promise</h3>
            <ul className="space-y-3 text-sm font-light text-emerald-100/80">
              <li>100% Organic</li>
              <li>Zero Pesticides</li>
              <li>Cold-Pressed</li>
              <li>Farm to Table</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold tracking-widest text-emerald-400 uppercase text-xs mb-4">Connect</h3>
            <ul className="space-y-3 text-sm font-light text-emerald-100/80">
              <li>care@nutroindia.com</li>
              <li>+91 99999 99999</li>
              <li>New Delhi, India</li>
              <li className="flex items-center gap-4 pt-2">
                <a href="https://www.instagram.com/nutroindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12 mt-16 pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row items-center justify-between text-xs font-light tracking-wide text-emerald-300/70">
          <p>© {new Date().getFullYear()} NutroIndia. All Rights Reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-emerald-900/50 backdrop-blur-xl border border-emerald-800/50 rounded-2xl px-4 py-2 text-white">
            <span className="inline-block h-2 w-2 bg-emerald-400 rounded-full"></span>
            100% Certified Organic
          </div>
        </div>
      </footer>
    </div>
  );
}
