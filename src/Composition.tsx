import { AbsoluteFill, Img } from "remotion";

export interface PosterProps {
    programMode: 'manual' | 'profondeur' | 'clubE';
    manualProgramName: string;
    quoteText: string;
    speakerName: string;
    speakerImageUrl: string | null;
    bottomBannerText: string;
    bottomBannerPhone: string;
    bgColor?: string;
}

export const PosterComposition: React.FC<PosterProps> = ({
    programMode,
    manualProgramName,
    quoteText,
    speakerName,
    speakerImageUrl,
    bottomBannerText,
    bottomBannerPhone,
    bgColor = "#9e0b0d"
}) => {
    // Helper to split speaker name: first word in one style, rest in another
    const splitSpeakerName = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return { first: "", rest: "" };
        const parts = trimmed.split(/\s+/);
        if (parts.length === 1) return { first: parts[0], rest: "" };
        return { first: parts[0], rest: parts.slice(1).join(" ") };
    };

    const { first, rest } = splitSpeakerName(speakerName || "Yannick Djatti");

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor }} className="overflow-hidden font-sans">
            {/* The base color for the poster */}
            <div className="absolute top-0 left-0 w-full h-full z-0" style={{ backgroundColor: bgColor }}></div>

            {/* Background (Image 4) - watermark pattern */}
            <Img
                src="assets/image4.jpg"
                className="absolute top-0 left-0 w-full h-full object-fill opacity-25"
                style={{ zIndex: 0 }}
                crossOrigin="anonymous"
            />

            {/* Top-Left: Main Logo (Always present) */}
            <div className="absolute top-[60px] left-[60px] z-10">
                <Img
                    src="assets/logo-christennous.png"
                    className="h-[60px] object-contain"
                    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
                    crossOrigin="anonymous"
                />
            </div>

            {/* Top-Right: Program Area (Dynamic: Logo or Text) - Slightly enlarged for better visibility */}
            <div className="absolute top-[55px] right-[40px] z-10 flex flex-col items-end w-[450px]">
                {programMode === 'manual' ? (
                    <h2
                        className="text-white text-[55px] leading-tight text-right mb-0 font-bold drop-shadow-lg"
                        style={{ fontFamily: "'Brush Script MT', 'Courgette', cursive" }}
                    >
                        {manualProgramName || "Programme Christ en nous"}
                    </h2>
                ) : (
                    <Img
                        src={programMode === 'profondeur' ? "assets/logo-profondeur.png" : "assets/logo-club-e.png"}
                        className="h-[75px] object-contain object-right"
                        crossOrigin="anonymous"
                    />
                )}
            </div>

            {/* Pixel-Perfect SVG Griffe: 
                Matches the "99" shape, specific overlap, and 3-layer styling (White/Dark/Orange).
                Positioned exactly between 'T' and 'S' of the background watermark.
            */}
            <div className="absolute top-[210px] right-[100px] z-20 w-[240px] h-[200px] pointer-events-none drop-shadow-2xl">
                <svg viewBox="0 0 160 120" width="100%" height="100%" overflow="visible">
                    <defs>
                        <style>{`
                            .griffe-text {
                                fontFamily: 'Georgia', serif;
                                fontWeight: 900;
                                fontSize: 135px;
                                strokeLinejoin: round;
                                paintOrder: stroke fill;
                            }
                        `}</style>
                    </defs>
                    
                    {/* First Quote Character (The one on the left) */}
                    <g transform="translate(0, 0)">
                        {/* Layer 1: Outer White */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: 'white', stroke: 'white', strokeWidth: '22px' }}>”</text>
                        {/* Layer 2: Dark Background Gap (Deep Blue/Black to match original look) */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: '#0a0a20', stroke: '#0a0a20', strokeWidth: '14px' }}>”</text>
                        {/* Layer 3: Orange Core */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: '#ff8200' }}>”</text>
                    </g>

                    {/* Second Quote Character (The one on the right, slightly overlapping and lower) */}
                    <g transform="translate(65, 15)">
                        {/* Layer 1: Outer White */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: 'white', stroke: 'white', strokeWidth: '22px' }}>”</text>
                        {/* Layer 2: Dark Background Gap */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: '#0a0a20', stroke: '#0a0a20', strokeWidth: '14px' }}>”</text>
                        {/* Layer 3: Orange Core */}
                        <text x="35" y="100" className="griffe-text" style={{ fill: '#ff8200' }}>”</text>
                    </g>
                </svg>
            </div>

            {/* Middle Section: Photo on Left, Text on Right */}
            <div className="absolute top-[360px] left-0 w-full h-[725px] flex px-[60px] z-10">
                {/* Left side: Speaker Picture */}
                <div className="w-[52%] h-full flex justify-center items-end relative mt-[-15px] ml-[-25px]">
                    <Img
                        src={speakerImageUrl || "assets/image1.jpg"}
                        className="h-full object-cover object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Right side: Quote Text */}
                <div className="w-[48%] h-full pl-[35px] flex flex-col justify-center pt-[40px] pb-[40px] relative">
                    <p
                        className="text-white font-bold leading-[1.3] drop-shadow-2xl relative z-10"
                        style={{
                            textShadow: "0px 4px 15px rgba(0,0,0,0.8)",
                            fontFamily: "'Georgia', serif",
                            fontSize: quoteText.length < 60 ? "56px" :
                                      quoteText.length < 120 ? "48px" :
                                      quoteText.length < 200 ? "38px" : "30px"
                        }}
                    >
                        {quoteText || "La croissance spirituelle ne se définit pas par les dons, ni la connaissance des écritures, mais par la capacité à devenir comme Christ."}
                    </p>
                </div>
            </div>

            {/* Bottom-Center-ish: Speaker Name (Split Styling) */}
            <div className="absolute top-[1110px] w-full text-center z-10 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="bg-[#ff8200] px-10 py-1 shadow-2xl transform origin-center max-w-[800px] flex items-center justify-center">
                        <h1 className="text-white text-[38px] font-extrabold tracking-wide drop-shadow-sm m-0 leading-none py-1 flex items-baseline gap-3">
                            {/* Force Pacifico font on the first word */}
                            <span style={{
                                fontFamily: "'Pacifico', cursive",
                                fontWeight: "normal",
                                fontSize: "1.2em",
                                textTransform: "none" // Keep original casing for script
                            }}>
                                {first}
                            </span>
                            <span style={{ textTransform: "none" }}>{rest}</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* Bottom: Address White Banner (Dynamic Text) - Increased gap for clarity */}
            <div className="absolute bottom-[35px] w-full flex justify-center z-10 px-[60px]">
                <div className="w-full bg-white/95 rounded-md py-5 flex flex-col justify-center items-center shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-b-[6px] border-[#960018] gap-4">
                    <p className="text-[#960018] font-black text-[19px] uppercase tracking-widest text-center drop-shadow-sm leading-none m-0 px-2">
                        {bottomBannerText}
                    </p>
                    <p className="text-[#960018] font-black text-[19px] uppercase tracking-widest text-center drop-shadow-sm leading-none m-0 px-2 mt-1">
                        {bottomBannerPhone}
                    </p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
