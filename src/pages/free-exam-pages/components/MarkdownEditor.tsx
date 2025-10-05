import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  ListsToggle,
  InsertImage,
  MDXEditor,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import './markdown.css'


export default function MarkdownEditor({text, setText}) {
  return (
    <div className='bg-white rounded-lg border'>
        <MDXEditor
      markdown={text}
      onChange={(value)=> setText(value)}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        imagePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <CreateLink/>
              <InsertImage/>
            </>
          )
        })
      ]}
    />
    </div>
  )
}