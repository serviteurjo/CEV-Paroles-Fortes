import { useState, useRef, useEffect } from "react";
import { Player } from "@remotion/player";
import { PosterComposition } from "./Composition";
import type { PosterProps } from "./Composition";
import * as htmlToImage from "html-to-image";
import { Image, Type, User, Download, Upload, Sparkles, Layout } from "lucide-react";

const DEFAULT_BANNER_TEXT = "CALAVI-TANKPÈ || NOUVEAU TRONÇON TANKPÈ-AÏTCHEDJI 3È RUE À GAUCHE ||";
const DEFAULT_BANNER_PHONE = "+229 01 96 96 29 85";
const UAC_BANNER_TEXT = "UAC || JARDIN BOTANIQUE";

function App() {
  const [formData, setFormData] = useState<PosterProps & { bgColor?: string }>({
    programMode: 'manual',
    manualProgramName: "Programme Christ en nous",
    quoteText: "La croissance spirituelle ne se définit pas par les dons, ni la connaissance des écritures, mais par la capacité à devenir comme Christ.",
    speakerName: "YANNICK DJATTI",
    speakerImageUrl: "/assets/image1.jpg",
    bottomBannerText: DEFAULT_BANNER_TEXT,
    bottomBannerPhone: DEFAULT_BANNER_PHONE,
    bgColor: "#9e0b0d"
  });

  const [isExporting, setIsExporting] = useState(false);
  const hiddenRenderRef = useRef<HTMLDivElement>(null);

  // Auto-update bottom banner when mode resets to manual or profondeur
  useEffect(() => {
    if (formData.programMode !== 'clubE') {
      setFormData(prev => ({ ...prev, bottomBannerText: DEFAULT_BANNER_TEXT }));
    }
  }, [formData.programMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode: 'manual' | 'profondeur' | 'clubE') => {
    setFormData(prev => ({ ...prev, programMode: mode }));
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
    await new Promise(r => setTimeout(r, 100));
    try {
      const dataUrl = await htmlToImage.toPng(hiddenRenderRef.current, {
        quality: 1,
        pixelRatio: 1,
        width: 1080,
        height: 1350,
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
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Left Panel: Form */}
      <div className="w-[450px] p-8 border-r bg-white shadow-2xl overflow-y-auto relative z-10 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#b71618] flex items-center gap-3">
            <Image className="text-orange-500" size={32} />
            CEV Paroles Fortes
          </h1>
          <p className="text-sm text-slate-500 mt-2 ml-11">
            Générateur de Poster Pro v2.0
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {/* SECTION 1: Nom du Programme */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layout size={16} /> Choix du Programme
            </label>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => handleModeChange('manual')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'manual' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-bold flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 ${formData.programMode === 'manual' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Saisie Manuelle
                </div>
              </button>
              
              <button 
                onClick={() => handleModeChange('profondeur')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'profondeur' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-bold flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 ${formData.programMode === 'profondeur' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Logo "Profondeur"
                </div>
              </button>

              <button 
                onClick={() => handleModeChange('clubE')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'clubE' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-bold flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 ${formData.programMode === 'clubE' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Logo "Club E"
                </div>
              </button>
            </div>

            {formData.programMode === 'manual' && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  name="manualProgramName"
                  placeholder="Ex: Programme Spécial"
                  value={formData.manualProgramName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#b71618] transition"
                />
              </div>
            )}
          </div>

          {/* SECTION 1.1: Conditionnelle Club E - Bande Blanche */}
          {formData.programMode === 'clubE' && (
            <div className="space-y-3 p-4 bg-orange-50 rounded-xl border border-orange-200 animate-in zoom-in-95 duration-300">
               <label className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                  <Sparkles size={14} /> Contenu de la bande blanche
               </label>
               <select 
                value={formData.bottomBannerText === UAC_BANNER_TEXT ? 'uac' : 'default'}
                onChange={(e) => setFormData(prev => ({ ...prev, bottomBannerText: e.target.value === 'uac' ? UAC_BANNER_TEXT : DEFAULT_BANNER_TEXT }))}
                className="w-full bg-white border-2 border-orange-200 rounded-lg p-2 text-sm outline-none focus:border-orange-500"
               >
                 <option value="default">{DEFAULT_BANNER_TEXT.slice(0, 30)}...</option>
                 <option value="uac">{UAC_BANNER_TEXT}</option>
               </select>
            </div>
          )}

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
              rows={3}
              className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#b71618] transition resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" /> Couleur de l'arrière-plan
            </label>
            <div className="flex gap-2">
              {['#9e0b0d', '#000533f7', '#000000', '#4c1d95','#003333f7', '#880e4f'].map(color => (
                <button 
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, bgColor: color }))}
                  className={`w-10 h-10 rounded-full border-2 transition ${formData.bgColor === color ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Upload size={16} /> Image de l'orateur
            </label>
            <label className="block w-full cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition border-slate-200 hover:bg-slate-50 hover:border-[#b71618]/50">
              <span className="text-sm text-slate-500 font-medium">Cliquez pour modifier la photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={downloadPoster}
            disabled={isExporting}
            className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={22} />
            {isExporting ? "Génération..." : "TÉLÉCHARGER"}
          </button>
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="flex-1 bg-slate-200 flex justify-center items-center p-8 overflow-hidden relative" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 0)", backgroundSize: "20px 20px" }}>
        <div className="shadow-2xl overflow-hidden rounded transform-gpu z-10 w-[max(100%,_800px)] lg:w-[600px] aspect-[4/5] border-4 border-white bg-white">
          <Player
            component={PosterComposition as React.FC<any>}
            inputProps={formData}
            durationInFrames={1}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1350}
            style={{ width: "100%", height: "100%" }}
            controls={false}
            autoPlay={false}
          />
        </div>
      </div>

      {/* Hidden 1:1 render for export */}
      <div className="fixed top-[-2000px] left-[-2000px]">
        <div ref={hiddenRenderRef} style={{ width: 1080, height: 1350, position: 'relative' }}>
          <PosterComposition {...formData} />
        </div>
      </div>
    </div>
  );
}

export default App;
