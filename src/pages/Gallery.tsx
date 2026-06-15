import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { X } from "lucide-react";
import g1 from "@/assets/gallery-1.png.asset.json";
import g2 from "@/assets/gallery-2.png.asset.json";
import g3 from "@/assets/gallery-3.png.asset.json";
import g4 from "@/assets/gallery-4.png.asset.json";
import g5 from "@/assets/gallery-5.png.asset.json";
import g6 from "@/assets/gallery-6.png.asset.json";

const images = [
  { src: g1.url, title: "Degradê com volume natural" },
  { src: g2.url, title: "Social clássico com risco lateral" },
  { src: g3.url, title: "Pompadour com fade médio" },
  { src: g4.url, title: "Corte infantil com desenho" },
  { src: g5.url, title: "Low fade com símbolo personalizado" },
  { src: g6.url, title: "Buzz cut com degradê limpo" },
];

const Gallery = () => {
  const [zoom, setZoom] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-4">
          Galeria de Cortes
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Confira alguns dos nossos trabalhos e inspire-se para o seu próximo corte.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setZoom(img.src)}
              className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all text-left"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="p-4 text-sm font-medium">{img.title}</p>
            </button>
          ))}
        </div>
      </main>

      {zoom && (
        <div
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setZoom(null)}
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={zoom} alt="Corte ampliado" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
