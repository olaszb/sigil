import EventItem from "./EventItem";


const Events = ({events, type, onAction}) => {
    

    return (
        <div className="flex flex-col items-center w-full pb-4 py-8 px-4 md:px-8">
            {events.map((event) => (
                <EventItem 
                    key={event.id}
                    event={event}
                    type={type}
                    onAction={onAction}
                />
            ))}
        </div>
    );
}

export default Events;