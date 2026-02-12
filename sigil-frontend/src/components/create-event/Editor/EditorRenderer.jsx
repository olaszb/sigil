import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import editorTheme, { EDITOR_NODES } from "../../../util/editor/editorTheme";

const EditorRenderer = ({ jsonContent }) => {
  const isInvalid = !jsonContent || !jsonContent.startsWith("{");

  if (isInvalid) {
    return <p className="font-[Montserrat] text-parchment/80">{jsonContent}</p>;
  }

  const theme = editorTheme;

  const initialConfig = {
    namespace: "EditorRenderer",
    theme,
    editable: false,
    editorState: jsonContent,
    onError: (error) => console.error(error),
    nodes: EDITOR_NODES,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="outline-none font-[Montserrat] leading-loose text-parchment/80" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};

export default EditorRenderer;
