import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { Bold, Italic, Underline } from "lucide-react";

const EditorToolbar = () => {
    const [editor] = useLexicalComposerContext();

    const format = (command) =>  {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
    };

    return (
        <div className="flex gap-2 p-2 border-b border-parchment/10 group-hover:border-main-accent/60 group-focus-within:border-main-accent/60 transition-colors duration-400 bg-black/20">
            <button type="button"
                onClick={() => format("bold")}
                className="p-1 hover:text-main-accent transition-colors text-parchment/60"
            >
                <Bold size={16}/>
            </button>
            <button type="button"
                onClick={() => format("italic")}
                className="p-1 hover:text-main-accent transition-colors text-parchment/60">
                <Italic size={16} />
            </button>
            <button type="button"
                onClick={() => format("underline")}
                className="p-1 hover:text-main-accent transition-colors text-parchment/60">
                <Underline size={16} />
            </button>
        </div>
    );
}

export default EditorToolbar;