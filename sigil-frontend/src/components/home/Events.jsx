import EventItem from "./EventItem";


const Events = ({events}) => {
    

    return (
        <div className="flex flex-col items-center w-full pb-4 py-8">
            {events.map((event) => (
                <EventItem 
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    start_time={event.start_time}
                    slug={event.slug}
                />
            ))}
        </div>
    );
}

export default Events;