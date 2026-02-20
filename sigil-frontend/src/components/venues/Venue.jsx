const Venue = ({ venue }) => {

    return (
        <div className="flex border-l border-main-accent">
            <h1 className="text-xl text-main-accent">{venue.name}</h1>
        </div>
    );
}   

export default Venue;