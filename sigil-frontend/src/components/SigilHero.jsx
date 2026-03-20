import { getImageUrl } from "../util/helper";

const SigilHero = ({ image_url, title }) => {
    return (
        <div className="relative w-full h-[300px] md:h-[500px]">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(image_url)})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80" />
            <h1 id="title" className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 w-full px-4 text-center text-3xl md:text-5xl font-[Cinzel] font-bold uppercase tracking-wide text-parchment z-10">
                {title}
            </h1>
        </div>
    );
}

export default SigilHero;