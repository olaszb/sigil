import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { Bold, Italic, Underline, Link, Heading1, List, Quote, Heading2 } from "lucide-react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useCallback, useEffect, useState } from "react";
import { $createHeadingNode, $isHeadingNode} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection";

const EditorToolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isHeadingOne, setIsHeadingOne] = useState(false);
    const [isHeadingTwo, setIsHeadingTwo] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [isList, setIsList] = useState(false);
    const [isQuote, setIsQuote] = useState(false);


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
                

                const anchorNode = selection.anchor.getNode();
                const element = anchorNode.getKey() === "root" 
                    ? anchorNode 
                    : anchorNode.getTopLevelElementOrThrow();
                
                if ($isHeadingNode(element)) {
                    const tag = element.getTag();
                    setIsHeadingOne(tag === "h1");
                    setIsHeadingTwo(tag === "h2");
                } else {
                    setIsHeadingOne(false);
                    setIsHeadingTwo(false);
                }
            }
        })
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar])

    const insertLink = useCallback(() => {
        const url = prompt("Enter the URL of the portal:");
        if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
    }, [editor])

    const formatHeading = useCallback((headingSize) => {
        editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
    });
    }, [editor])

    return (
        <div className="flex gap-2 p-2 border-b border-parchment/10 group-hover:border-main-accent/60 group-focus-within:border-main-accent/60 transition-colors duration-400 bg-black/20">
            <button type="button"
                onClick={() => format("bold")}
                className={`p-1 transition-colors ${
                    isBold ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}
            >
                <Bold size={16}/>
            </button>
            <button type="button"
                onClick={() => format("italic")}
                className={`p-1 transition-colors ${
                    isItalic ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Italic size={16} />
            </button>
            <button type="button"
                onClick={() => format("underline")}
                className={`p-1 transition-colors ${
                    isUnderline ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Underline size={16} />
            </button>

            <button type="button"
                onClick={() => formatHeading("h1")}
                className={`p-1 transition-colors ${
                    isHeadingOne ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Heading1 size={16} />
            </button>

            <button type="button"
                onClick={() => formatHeading("h2")}
                className={`p-1 transition-colors ${
                    isHeadingTwo ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}>
                <Heading2 size={16} />
            </button>

            <div className="w-[1px] h-6 bg-parchment/10 mx-1" /> 

            <button onClick={insertLink} className="p-1 hover:text-main-accent text-parchment/60">
                <Link size={16} />
            </button>

            <button 
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} 
                className={`p-1 transition-colors ${
                    isQuote ? "text-main-accent" : "text-parchment/60 hover:text-main-accent"
                }`}
            >
                <Quote size={16} />
            </button>
        </div>
    );
}

export default EditorToolbar;