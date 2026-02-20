import EditorRenderer from "../create-event/Editor/EditorRenderer";

const EventDescription = ({ description }) => {
  return (
    <section>
      <div className="flex items-center gap-4">
        <h2 className="text-main-accent font-[Cinzel] text-xl">Details</h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-parchment/20 to-transparent" />
      </div>
      <div className="relative p-6 bg-black/20 border-l-2 border-main-accent/30">
        {description ? (
          <EditorRenderer jsonContent={description} />
        ) : (
          <p className="italic opacity-30">
            The records for this ritual are blank...
          </p>
        )}
      </div>
    </section>
  );
};

export default EventDescription;
