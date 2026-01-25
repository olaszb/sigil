import EventItem from "./EventItem";


const Events = ({events}) => {
    

    return (
        <>
            {events.map((event) => (
                <EventItem 
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    start_time={event.start_time}
                />
            ))}
        </>
    );
}

export default Events;