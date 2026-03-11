import { AbsoluteFill, Img } from "remotion";

export interface PosterProps {
    programName: string;
    quoteText: string;
    speakerName: string;
    speakerImageUrl: string | null;
    bgColor?: string;
}

export const PosterComposition: React.FC<PosterProps> = ({
    programName,
    quoteText,
    speakerName,
    speakerImageUrl,
    bgColor = "#9e0b0d"
}) => {
    return (
        <AbsoluteFill style={{ backgroundColor: bgColor }} className="overflow-hidden font-sans">
            {/* The base color for the poster */}
            <div className="absolute top-0 left-0 w-full h-full z-0" style={{ backgroundColor: bgColor }}></div>

            {/* Background (Image 4) - Integrally stretched out so nothing is cut off.
                Opacity lowered significantly so its text ("L'EXPECTATIVE DE LA GLOIRE") 
                turns into a faint watermark pattern that doesn't conflict with FOREGROUND TEXT. */}
            <Img
                src="/assets/image4.jpg"
                className="absolute top-0 left-0 w-full h-full object-fill opacity-25"
                style={{ zIndex: 0 }}
            />

            {/* Top-Left: Custom designed TEXT for "CHRISTENNOUS" (Reduced size) */}
            <div className="absolute top-[60px] left-[60px] z-10 flex flex-row items-center font-sans font-black tracking-tighter" style={{ fontSize: "52px", letterSpacing: "-0.05em" }}>
                <span className="text-white relative inline-block">
                    CHR
                    <span className="relative inline-block ml-[2px]">
                        I
                        {/* Cut across the I */}
                        <span className="absolute top-[35%] left-[-20%] w-[140%] h-[4px] rotate-[-20deg]" style={{ backgroundColor: bgColor }}></span>
                    </span>
                    ST
                </span>
                <span className="text-[#ffb300] ml-[1px]">EN</span>
                <span className="text-white">NOUS</span>
            </div>

            {/* Top-Right: Program Name */}
            <div className="absolute top-[60px] right-[60px] z-10 flex flex-col items-end w-[450px]">
                <h2
                    className="text-white text-[55px] leading-tight text-right mb-0 font-bold drop-shadow-lg"
                    style={{ fontFamily: "'Brush Script MT', 'Courgette', cursive" }}
                >
                    {programName || "Programme Christ en nous"}
                </h2>
            </div>

            {/* Fixed Quote Mark (Griffe) positioned between name and text */}
            <div
                className="absolute top-[250px] right-[90px] z-10 text-[#ffb300] text-[360px] leading-none drop-shadow-2xl opacity-95"
                style={{
                    textShadow: "2px 6px 15px rgba(0,0,0,0.7)",
                    fontFamily: "'Georgia', serif"
                }}
            >
                ”
            </div>

            {/* Middle Section: Photo on Left, Text on Right (Height reduced) */}
            <div className="absolute top-[360px] left-0 w-full h-[725px] flex px-[60px] z-10">

                {/* Left side: Intervenant Picture */}
                <div className="w-[52%] h-full flex justify-center items-end relative mt-[-15px] ml-[-25px]">
                    <Img
                        src={speakerImageUrl || "/assets/image1.jpg"}
                        className="h-full object-cover object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                    />
                </div>

                {/* Right side: Resume Text (White text, directly on background) */}
                <div className="w-[48%] h-full pl-[35px] flex flex-col justify-center pt-[60px] pb-[50px] relative">
                    <p
                        className="text-white font-bold leading-[1.3] drop-shadow-2xl relative z-10"
                        style={{
                            textShadow: "0px 4px 15px rgba(0,0,0,0.8)",
                            fontFamily: "'Georgia', serif",
                            fontSize: quoteText.length < 80 ? "52px" :
                                quoteText.length < 160 ? "44px" : "36px"
                        }}
                    >
                        {quoteText || "La croissance spirituelle ne se définit pas par les dons, ni la connaissance des écritures, mais par la capacité à devenir comme Christ."}
                    </p>
                </div>
            </div>

            {/* Bottom-Center-ish: Speaker Name */}
            <div className="absolute top-[1110px] w-full text-center z-10 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Name box lowered to be entirely beneath the speaker image instead of overlapping */}
                    <div className="bg-[#ff8200] px-10 py-1 shadow-2xl transform origin-center max-w-[800px] flex items-center justify-center">
                        <h1 className="text-white text-[38px] font-extrabold tracking-wide drop-shadow-sm m-0 leading-none py-1">
                            {speakerName || "Yannick Djatti"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Bottom: Address div - same text styling for both address and phone */}
            <div className="absolute bottom-[35px] w-full flex justify-center z-10 px-[60px]">
                <div className="w-full bg-white/95 rounded-md py-4 flex flex-col justify-center items-center shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-b-[6px] border-[#960018] gap-1">
                    <p className="text-[#960018] font-black text-[19px] uppercase tracking-widest text-center drop-shadow-sm leading-none m-0 px-2">
                        CALAVI-TANKPÈ || NOUVEAU TRONÇON TANKPÈ-AÏTCHEDJI 3È RUE À GAUCHE ||
                    </p>
                    <p className="text-[#960018] font-black text-[19px] uppercase tracking-widest text-center drop-shadow-sm leading-none m-0 px-2">
                        +229 01 96 96 29 85
                    </p>
                </div>
            </div>

        </AbsoluteFill>
    );
};

