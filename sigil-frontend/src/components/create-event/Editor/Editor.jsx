import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {HeadingNode, QuoteNode} from "@lexical/rich-text"
import {ListNode, ListItemNode} from "@lexical/list"
import {LinkNode, AutoLinkNode} from "@lexical/link"
import EditorToolbar from "./EditorToolbar";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import editorTheme, { EDITOR_NODES } from "../../../util/editor/editorTheme";

const theme = editorTheme;

const Editor = ({ onChange }) => {
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
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none p-3 min-h-[150px]" />
          }
          
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LinkPlugin />
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