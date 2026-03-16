import { useState, useRef, useEffect, useDeferredValue, useCallback, memo } from "react";
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
    speakerImageUrl: "assets/image1.jpg",
    bottomBannerText: DEFAULT_BANNER_TEXT,
    bottomBannerPhone: DEFAULT_BANNER_PHONE,
    bgColor: "#9e0b0d"
  });

  const [isExporting, setIsExporting] = useState(false);
  // Mobile tab state: "form" shows the controls panel, "preview" shows the poster
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");
  const hiddenRenderRef = useRef<HTMLDivElement>(null);

  // Use deferred value for the preview to keep inputs snappy
  const deferredFormData = useDeferredValue(formData);

  // Auto-update bottom banner when mode resets to manual or profondeur
  useEffect(() => {
    if (formData.programMode !== 'clubE') {
      if (formData.bottomBannerText !== DEFAULT_BANNER_TEXT) {
        setFormData(prev => ({ ...prev, bottomBannerText: DEFAULT_BANNER_TEXT }));
      }
    }
  }, [formData.programMode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleModeChange = useCallback((mode: 'manual' | 'profondeur' | 'clubE') => {
    setFormData(prev => ({ ...prev, programMode: mode }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];
      if (!validImageTypes.includes(file.type)) {
        alert('Format d\'image non supporté. Veuillez utiliser JPEG, PNG, WebP, GIF, BMP ou SVG.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData((prev) => ({ ...prev, speakerImageUrl: imageUrl }));
      };
      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier image.');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Helper to wait for fonts to be ready
  const waitForFonts = async () => {
    try {
      if ('fonts' in document) {
        await (document as any).fonts.ready;
      }
    } catch (e) {
      console.warn("Font loading wait failed, continuing anyway", e);
    }
  };

  const downloadPoster = useCallback(async () => {
    if (!hiddenRenderRef.current) {
        console.error("Reference to hidden render div is null");
        return;
    }
    
    setIsExporting(true);
    
    try {
      // 1. Wait for fonts and images to load
      await waitForFonts();
      
      // Wait for all images in the div to load
      const images = hiddenRenderRef.current.querySelectorAll('img');
      const imageLoads = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if ((img as HTMLImageElement).complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if image fails
          }
        });
      });
      await Promise.all(imageLoads);
      
      // Additional wait for rendering
      await new Promise(r => setTimeout(r, 1200));
      
      // Determine pixel ratio
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const targetPixelRatio = isMobile ? 1.5 : 2;

      let dataUrl: string | null = null;
      let error: Error | null = null;

      // 2. Try primary method: html-to-image toPng
      try {
        dataUrl = await htmlToImage.toPng(hiddenRenderRef.current, {
          quality: 0.95,
          pixelRatio: targetPixelRatio,
          width: 1080,
          height: 1350,
          style: {
             opacity: "1",
             visibility: "visible",
             display: "block",
             transform: "none",
             position: "relative",
             left: "0",
             top: "0"
          },
          cacheBust: true,
          fontEmbedCSS: undefined,
        });
      } catch (err) {
        console.warn("Primary toPng method failed, trying toJpeg:", err);
        error = err as Error;
        
        // 3. Fallback: Try toJpeg (often more resilient)
        try {
          dataUrl = await htmlToImage.toJpeg(hiddenRenderRef.current, {
            quality: 0.92,
            pixelRatio: targetPixelRatio,
            width: 1080,
            height: 1350,
            style: {
               opacity: "1",
               visibility: "visible",
               display: "block",
               transform: "none",
               position: "relative",
               left: "0",
               top: "0"
            },
            cacheBust: true,
          });
          console.log("Successfully exported as JPEG");
        } catch (jpegErr) {
          console.warn("toJpeg also failed, trying canvas method:", jpegErr);
          error = jpegErr as Error;
          
          // 4. Fallback: Direct canvas method
          try {
            const canvas = await htmlToImage.toCanvas(hiddenRenderRef.current, {
              pixelRatio: targetPixelRatio,
              width: 1080,
              height: 1350,
            });
            dataUrl = canvas.toDataURL('image/png', 0.95);
            console.log("Successfully exported via canvas");
          } catch (canvasErr) {
            console.error("Canvas method also failed:", canvasErr);
            error = canvasErr as Error;
          }
        }
      }

      // 5. Validate and download
      if (!dataUrl || dataUrl.length < 100) {
        throw new Error("L'image générée est vide ou invalide. " + (error ? error.message : "Cause inconnue."));
      }

      // Create and trigger download
      const link = document.createElement("a");
      const speakerNameSafe = formData.speakerName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      link.download = `Affiche_${speakerNameSafe || "CEV"}_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup data URL
      if (dataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(dataUrl);
      }
      
    } catch (err) {
      console.error("Erreur détaillée lors de l'export: ", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(
        `Erreur lors du téléchargement de l'affiche:\n\n${errorMsg}\n\n` +
        `Suggestions:\n` +
        `• Essayez avec une image de plus petite taille\n` +
        `• Convertissez votre image en JPEG ou PNG\n` +
        `• Vérifiez votre connexion internet\n` +
        `• Rafraîchissez la page et réessayez`
      );
    } finally {
      setIsExporting(false);
    }
  }, [hiddenRenderRef, formData]);

  return (
    // Root shell: full screen, no overflow, flex column on mobile, flex row on desktop
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-slate-100 font-sans text-slate-800 overflow-hidden">

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
          relative z-10
          shrink-0
          min-h-0
          h-full
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

        {/* Form body - scrollable part */}
        <div 
          className="flex-1 overflow-y-auto min-h-0 px-5 py-5 sm:px-7 sm:py-6 space-y-5"
          style={{ touchAction: 'pan-y' }}
        >

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
              {['#9e0b0d', '#000533', '#000000', '#4c1d95', '#003333', '#880e4f', '#160e88db'].map(color => (
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

          {/* Bouton de téléchargement (plus proche du formulaire) */}
          <div className="pt-3">
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
            inputProps={deferredFormData}
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

      {/* Hidden render for export — moved off-screen but rendered for capture */}
      <div 
        className="fixed" 
        style={{ left: '-9999px', top: '0', pointerEvents: 'none', position: 'fixed' }} 
        aria-hidden="true"
      >
        <div 
            ref={hiddenRenderRef} 
            style={{ 
                width: 1080, 
                height: 1350, 
                position: 'relative', 
                backgroundColor: formData.bgColor || '#9e0b0d' 
            }}
        >
          <PosterComposition {...formData} />
        </div>
      </div>

    </div>
  );
}

export default memo(App);
