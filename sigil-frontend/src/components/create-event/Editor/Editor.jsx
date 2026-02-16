import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import EditorToolbar from "./EditorToolbar";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import editorTheme, { EDITOR_NODES } from "../../../util/editor/editorTheme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";

const theme = editorTheme;

function LoadInitialContentPlugin( {value} ){
    const [editor] = useLexicalComposerContext();
    const hasLoaded = useRef(false);

    useEffect(() => {
      if (value && !hasLoaded.current){
        const editorState = editor.parseEditorState(value);
        editor.setEditorState(editorState);
        hasLoaded.current = true;
      }
    }, [value, editor])

    return null;
  }

const Editor = ({ onChange, initialValue }) => {
  const initialConfig = {
    namespace: "EventEditor",
    theme,
    nodes: EDITOR_NODES,
    onError: (error) => console.error(error),
  };

  return (
    <div className="group relative border border-parchment/10 hover:border-main-accent/60 bg-black/40 min-h-[150px] transition-all duration-400 focus-within:border-main-accent/50">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar/>
        <div className="relative h-[250px] max-h-[300px] overflow-y-auto custom-scrollbar">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none p-3 min-h-[150px]" />
            }
            
            ErrorBoundary={LexicalErrorBoundary}
          />

        </div>

        <LoadInitialContentPlugin value={initialValue} />

        <ListPlugin />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              onChange(JSON.stringify(editorState.toJSON()));
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
};

export default Editor;