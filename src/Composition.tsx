import { AbsoluteFill, Img } from "remotion";

export interface PosterProps {
    programName: string;
    quoteText: string;
    speakerName: string;
    speakerImageUrl: string | null;
}

export const PosterComposition: React.FC<PosterProps> = ({
    programName,
    quoteText,
    speakerName,
    speakerImageUrl
}) => {
    return (
        <AbsoluteFill className="bg-[#b71618] overflow-hidden font-sans">
            {/* Background (Image 4) - covering everything but darkened slightly */}
            <Img
                src="/assets/image4.jpg"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            />

            {/* Top section: Logo (Left) and Program Name (Right) */}
            <div className="absolute top-12 left-12 w-64 h-auto z-10 h-[100px] flex items-center">
                <Img src="/assets/image3.jpg" className="h-full object-contain mix-blend-screen mix-blend-lighten" />
            </div>

            <div className="absolute top-[80px] right-12 z-10 flex flex-col items-end">
                <div className="w-[100px] h-[5px] bg-white mb-2" />
                <h2 className="text-white text-5xl font-black uppercase tracking-widest drop-shadow-xl border-t-8 border-white pt-2">
                    {programName || "PROGRAMME"}
                </h2>
            </div>

            {/* Center Layout for Speaker and Text */}
            <div className="absolute top-[280px] left-0 w-full h-[600px] flex px-8">

                {/* Left side: Intervenant */}
                <div className="w-[45%] h-full relative flex flex-col justify-end items-center">
                    <div className="w-full h-full relative flex justify-center items-end">
                        <Img
                            src={speakerImageUrl || "/assets/image1.jpg"}
                            className="h-full object-cover object-bottom shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] z-20"
                            style={{
                                // maskImage to blend bottom smoothly if needed, but for now we expect a full cropped image
                                maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%)",
                                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%)"
                            }}
                        />
                    </div>
                    <div className="absolute bottom-[-40px] z-30 flex flex-col items-center">
                        <p className="text-orange-400 font-bold tracking-[0.2em] uppercase text-xl mb-1">Pasteur</p>
                        <h1 className="text-white text-4xl font-extrabold bg-[#ff6b00] px-8 py-3 shadow-2xl rounded-sm uppercase tracking-wide">
                            {speakerName || "YANNICK DJATTI"}
                        </h1>
                    </div>
                </div>

                {/* Right side: Resume Text */}
                <div className="w-[55%] h-full pl-8 pr-12 flex flex-col justify-center relative">
                    {/* Quote mark decoration */}
                    <div className="absolute top-10 right-10 text-[#FF8200] opacity-30 text-[180px] font-serif leading-none">
                        "
                    </div>
                    <div className="relative z-10 bg-slate-900/40 p-12 rounded-xl backdrop-blur-sm border-l-4 border-[#FF8200] shadow-2xl">
                        <p className="text-white text-[42px] font-bold leading-tight align-middle overflow-hidden"
                            style={{ textShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                            {quoteText || "La croissance spirituelle ne se définit pas par les dons, ni la connaissance des écritures, mais par la capacité à devenir comme Christ."}
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Bar (Image 2) */}
            <div className="absolute bottom-0 left-0 w-full h-[150px] bg-white flex justify-center items-center shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-40 px-12">
                <div className="h-[80%] w-full flex align-center justify-center">
                    {/* Some manual fallback if img fails, but since the user provided it, we display the banner */}
                    <Img src="/assets/image2.jpg" className="h-[75%] max-w-full object-contain mix-blend-multiply my-auto" />
                </div>
            </div>
        </AbsoluteFill>
    );
};
