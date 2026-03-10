import { useState, useRef } from "react";
import { Player } from "@remotion/player";
import { PosterComposition } from "./Composition";
import type { PosterProps } from "./Composition";
import * as htmlToImage from "html-to-image";
import { Image, Type, User, Download, Upload } from "lucide-react";

function App() {
  const [formData, setFormData] = useState<PosterProps>({
    programName: "Programme Christ en nous",
    quoteText: "La croissance spirituelle ne se définit pas par les dons, ni la connaissance des écritures, mais par la capacité à devenir comme Christ.",
    speakerName: "YANNICK DJATTI",
    speakerImageUrl: "/assets/image1.jpg",
  });

  const [isExporting, setIsExporting] = useState(false);
  const hiddenRenderRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, speakerImageUrl: imageUrl }));
    }
  };

  const downloadPoster = async () => {
    if (!hiddenRenderRef.current) return;
    setIsExporting(true);

    // Give it a small delay to ensure React commits the state of 'isExporting'
    await new Promise(r => setTimeout(r, 100));

    try {
      const dataUrl = await htmlToImage.toPng(hiddenRenderRef.current, {
        quality: 1,
        pixelRatio: 1,
        width: 1080,
        height: 1080,
        skipFonts: false
      });

      const link = document.createElement("a");
      link.download = `Affiche_${formData.speakerName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur lors de l'export: ", err);
      alert("Erreur lors de la génération de l'affiche.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

      {/* Left Panel: Form */}
      <div className="w-1/3 min-w-[350px] p-8 border-r bg-white shadow-xl overflow-y-auto relative z-10 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#b71618] flex items-center gap-3">
            <Image className="text-orange-500" size={32} />
            Studio QARIS
          </h1>
          <p className="text-sm text-slate-500 mt-2 ml-11">
            Générateur Automatisé d'Affiches
          </p>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Nom du programme</label>
            <input
              name="programName"
              value={formData.programName}
              onChange={handleInputChange}
              className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#b71618] transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><User size={16} /> Nom complet de l'orateur</label>
            <input
              name="speakerName"
              value={formData.speakerName}
              onChange={handleInputChange}
              className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#b71618] transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Texte / Citation</label>
            <textarea
              name="quoteText"
              value={formData.quoteText}
              onChange={handleInputChange}
              rows={4}
              className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#b71618] transition resize-none"
            />
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Upload size={16} /> Image Portrait Intervenant (Sans Fond)
            </label>
            <label className="block w-full cursor-pointer border-2 border-dashed border-[#b71618]/50 hover:bg-slate-50 rounded-xl p-6 text-center transition">
              <span className="text-sm text-[#b71618] font-medium">Cliquez pour importer la photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <button
            onClick={downloadPoster}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-[#b71618] to-orange-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={22} />
            {isExporting ? "Génération..." : "Télécharger l'Affiche (HD)"}
          </button>
        </div>
      </div>

      {/* Right Panel: Live Preview via Remotion Player */}
      <div className="flex-1 bg-slate-200 flex justify-center items-center p-8 overflow-hidden relative" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 0)", backgroundSize: "20px 20px" }}>
        {/* Visual container (SCALED FOR VIEWING) */}
        <div className="shadow-2xl overflow-hidden rounded transform-gpu z-10 w-[min(100%,_800px)] aspect-square border-4 border-white/50 bg-white">
          <Player
            component={PosterComposition as React.FC<any>}
            inputProps={formData}
            durationInFrames={1}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1080}
            style={{ width: "100%", height: "100%" }}
            controls={false}
            autoPlay={false}
            clickToPlay={false}
          />
        </div>
      </div>

      {/* Hidden 1:1 render for perfect export */}
      <div
        className="fixed top-[-2000px] left-[-2000px]"
        style={{ width: "1080px", height: "1080px", pointerEvents: 'none' }}
      >
        {/* Using a pure div instead of Player to guarantee DOM cleanliness for html-to-image */}
        <div ref={hiddenRenderRef} style={{ width: 1080, height: 1080, position: 'relative' }}>
          <PosterComposition {...formData} />
        </div>
      </div>

    </div>
  );
}

export default App;
