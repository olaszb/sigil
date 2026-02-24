import EventItem from "./EventItem";


const Events = ({events, type}) => {
    

    return (
        <div className="flex flex-col items-center w-full pb-4 py-8">
            {events.map((event) => (
                <EventItem 
                    key={event.id}
                    event={event}
                    type={type}
                />
            ))}
        </div>
    );
}

export default Events;