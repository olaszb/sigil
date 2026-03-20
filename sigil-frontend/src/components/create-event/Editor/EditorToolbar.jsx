import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection, $createParagraphNode, FORMAT_ELEMENT_COMMAND } from "lexical";
import { Bold, Italic, Underline, Heading1, List, Quote, Heading2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { $createHeadingNode, $isHeadingNode} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection";
import { $createQuoteNode, $isQuoteNode, } from "@lexical/rich-text";
import { INSERT_UNORDERED_LIST_COMMAND, $isListNode } from "@lexical/list";


const EditorToolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isHeadingOne, setIsHeadingOne] = useState(false);
    const [isHeadingTwo, setIsHeadingTwo] = useState(false);
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

                setIsQuote($isQuoteNode(element));
                setIsList($isListNode(element));
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


    const formatHeading = useCallback((headingSize) => {
        editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
    });
    }, [editor])

    const formatQuote = () => {
        if (!isQuote){
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createQuoteNode());
                }
            });
        } else{
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                }
            });
        }
    }

    const formatBulletList = () => {
        if (!isList) {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
    }

    const formatAlignment = (alignment) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-2 p-2 border-b border-parchment/10 group-hover:border-main-accent/60 group-focus-within:border-main-accent/60 transition-colors duration-400 bg-black/20">
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

            <button type="button"
                onClick={formatBulletList}
                className={`p-1 transition-colors ${isList ? "text-main-accent" : "text-parchment/60"}`}>
                <List size={16} />
            </button>

            <button type="button"
                onClick={formatQuote} 
                className={`p-1 transition-colors ${isQuote ? "text-main-accent" : "text-parchment/60"}`}>
                <Quote size={16} />
            </button>

            <div className="hidden md:block w-[1px] h-6 bg-parchment/10 mx-1" /> 

            <button type="button"
                onClick={() => formatAlignment('left')}
                className="p-1 text-parchment/60 hover:text-main-accent transition-colors">
                <AlignLeft size={16} />
            </button>

            <button type="button"
                onClick={() => formatAlignment('center')}
                className="p-1 text-parchment/60 hover:text-main-accent transition-colors">
                <AlignCenter size={16} />
            </button>

            <button type="button"
                onClick={() => formatAlignment('right')}
                className="p-1 text-parchment/60 hover:text-main-accent transition-colors">
                <AlignRight size={16} />
            </button>
        </div>
    );
}

export default EditorToolbar;