

const EventItem = ({ title, description, start_time }) => {

    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
            <p><em>{new Date(start_time).toLocaleString()}</em></p>
        </div>
    );
}

export default EventItem;