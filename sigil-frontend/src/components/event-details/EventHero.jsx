import { getImageUrl } from "../../util/helper";

const EventHero = ({ image_url, start_time }) => {
  const date = new Date(start_time);

    return (
        <div className="relative w-full h-[500px]">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(image_url)})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80" />
        </div>
    );
}

export default EventHero;