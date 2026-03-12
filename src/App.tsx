import { useState, useRef, useEffect } from "react";
import { Player } from "@remotion/player";
import { PosterComposition } from "./Composition";
import type { PosterProps } from "./Composition";
import * as htmlToImage from "html-to-image";
import { Image, Type, User, Download, Upload, Sparkles, Layout, Eye, Settings } from "lucide-react";

const DEFAULT_BANNER_TEXT = "CALAVI-TANKPÈ || NOUVEAU TRONÇON TANKPÈ-AÏTCHEDJI 3È RUE À GAUCHE ||";
const DEFAULT_BANNER_PHONE = "+229 01 96 96 29 85";
const UAC_BANNER_TEXT = "UAC || JARDIN BOTANIQUE";

// Mobile tab type
type MobileTab = "form" | "preview";

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
  // Mobile tab state: "form" shows the controls panel, "preview" shows the poster
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");
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
    // Extra delay for mobile/slower devices + font stabilization
    await new Promise(r => setTimeout(r, 500));
    try {
      const dataUrl = await htmlToImage.toPng(hiddenRenderRef.current, {
        quality: 1,
        pixelRatio: 2, // Better quality for modern phone displays
        width: 1080,
        height: 1350,
        cacheBust: true, // Prevent cached assets issues
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
    // Root shell: full screen, no overflow, flex column on mobile, flex row on desktop
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">

      {/* ─── MOBILE TAB BAR (hidden on desktop) ─── */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white shadow-sm z-20 shrink-0">
        <button
          onClick={() => setMobileTab("form")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            mobileTab === "form"
              ? "text-[#b71618] border-b-2 border-[#b71618]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Settings size={16} />
          Formulaire
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            mobileTab === "preview"
              ? "text-[#b71618] border-b-2 border-[#b71618]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Eye size={16} />
          Aperçu
        </button>
      </div>

      {/* ─── LEFT PANEL: FORM ─── */}
      {/* Visible on desktop always. On mobile, only visible when mobileTab === "form" */}
      <div
        className={`
          ${mobileTab === "form" ? "flex" : "hidden"}
          lg:flex
          flex-col
          w-full lg:w-[420px] xl:w-[460px]
          border-r border-slate-200 bg-white shadow-2xl
          overflow-y-auto
          relative z-10
          shrink-0
        `}
      >
        {/* Header */}
        <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-slate-100">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#b71618] flex items-center gap-3">
            <Image className="text-orange-500 shrink-0" size={28} />
            CEV Paroles Fortes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-10">
            Générateur de Poster Pro v2.0
          </p>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-5">

          {/* SECTION 1: Choix du Programme */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layout size={14} /> Choix du Programme
            </label>

            <div className="grid grid-cols-1 gap-2">
              {/* Manual */}
              <button
                onClick={() => handleModeChange('manual')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'manual' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 shrink-0 ${formData.programMode === 'manual' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Saisie Manuelle
                </div>
              </button>

              {/* Profondeur */}
              <button
                onClick={() => handleModeChange('profondeur')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'profondeur' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 shrink-0 ${formData.programMode === 'profondeur' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Logo "Profondeur"
                </div>
              </button>

              {/* Club E */}
              <button
                onClick={() => handleModeChange('clubE')}
                className={`p-3 rounded-lg border-2 text-left transition ${formData.programMode === 'clubE' ? 'border-[#b71618] bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-4 shrink-0 ${formData.programMode === 'clubE' ? 'border-[#b71618]' : 'border-slate-300'}`} />
                  Logo "Club E"
                </div>
              </button>
            </div>

            {/* Manual input (conditional) */}
            {formData.programMode === 'manual' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  name="manualProgramName"
                  placeholder="Ex: Programme Spécial"
                  value={formData.manualProgramName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-[#b71618] transition"
                />
              </div>
            )}
          </div>

          {/* SECTION 1.1: Club E Banner (conditional) */}
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

          {/* Nom de l'orateur */}
          <div className="space-y-1">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User size={15} /> Nom complet de l'orateur
            </label>
            <input
              name="speakerName"
              value={formData.speakerName}
              onChange={handleInputChange}
              className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-[#b71618] transition"
            />
          </div>

          {/* Texte / Citation */}
          <div className="space-y-1">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Type size={15} /> Texte / Citation
            </label>
            <textarea
              name="quoteText"
              value={formData.quoteText}
              onChange={handleInputChange}
              rows={4}
              className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-[#b71618] transition resize-none"
            />
          </div>

          {/* Couleur de l'arrière-plan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles size={15} className="text-yellow-500" /> Couleur de l'arrière-plan
            </label>
            <div className="flex gap-3 flex-wrap">
              {['#9e0b0d', '#000533', '#000000', '#4c1d95', '#003333', '#880e4f'].map(color => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, bgColor: color }))}
                  aria-label={`Couleur ${color}`}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${
                    formData.bgColor === color
                      ? 'border-slate-700 scale-110 shadow-md'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Image de l'orateur */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Upload size={15} /> Image de l'orateur
            </label>
            <label className="block w-full cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition border-slate-200 hover:bg-slate-50 hover:border-[#b71618]/50 active:bg-red-50">
              <span className="text-sm text-slate-500 font-medium">Cliquez pour modifier la photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

        </div>

        {/* Download button — sticky at the bottom of the form panel */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={downloadPoster}
            disabled={isExporting}
            className="w-full bg-slate-900 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={20} />
            {isExporting ? "Génération..." : "TÉLÉCHARGER L'AFFICHE"}
          </button>
        </div>
      </div>

      {/* ─── RIGHT PANEL: LIVE PREVIEW ─── */}
      {/* Visible on desktop always. On mobile, only visible when mobileTab === "preview" */}
      <div
        className={`
          ${mobileTab === "preview" ? "flex" : "hidden"}
          lg:flex
          flex-1
          min-w-0
          bg-slate-200
          justify-center
          items-center
          p-4 sm:p-6 lg:p-8
          overflow-hidden
          relative
        `}
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 0)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Poster preview — constrained to viewport, maintains 4:5 ratio */}
        <div className="shadow-2xl overflow-hidden rounded-lg transform-gpu z-10 border-4 border-white bg-white"
          style={{
            // Responsive sizing: use viewport dimensions to compute max fitting size
            width: "min(100%, calc((100vh - 160px) * 4/5))",
            aspectRatio: "4/5"
          }}
        >
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

      {/* Hidden render for export — persistent in DOM but invisible to user */}
      <div className="fixed pointer-events-none opacity-0 left-0 top-0 overflow-hidden" aria-hidden="true">
        <div ref={hiddenRenderRef} style={{ width: 1080, height: 1350, position: 'relative' }}>
          <PosterComposition {...formData} />
        </div>
      </div>

    </div>
  );
}

export default App;
