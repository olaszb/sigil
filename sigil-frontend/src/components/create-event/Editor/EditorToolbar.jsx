import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { Bold, Italic, Underline } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const EditorToolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);


    const format = (command) =>  {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
    };

    const updateToolbar = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)){
                setIsBold(selection.hasFormat("bold"));
                setIsItalic(selection.hasFormat("italic"));
                setIsUnderline(selection.hasFormat("underline"));
            }
        })
    });

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar])

    return (
        <div className="flex gap-2 p-2 border-b border-parchment/10 group-hover:border-main-accent/60 group-focus-within:border-main-accent/60 transition-colors duration-400 bg-black/20">
            <button type="button"
                onClick={() => format("bold")}
                className={`p-1 transition-colors ${
                    isBold ? "text-main-accent shadow-[0_0_10px_rgba(154,0,0,0.5)]" : "text-parchment/60 hover:text-main-accent"
                }`}
            >
                <Bold size={16}/>
            </button>
            <button type="button"
                onClick={() => format("italic")}
                className={`p-1 transition-colors ${
                    isItalic ? "text-main-accent shadow-[0_0_10px_rgba(154,0,0,0.5)]" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Italic size={16} />
            </button>
            <button type="button"
                onClick={() => format("underline")}
                className={`p-1 transition-colors ${
                    isUnderline ? "text-main-accent shadow-[0_0_10px_rgba(154,0,0,0.5)]" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Underline size={16} />
            </button>
        </div>
    );
}

export default EditorToolbar;