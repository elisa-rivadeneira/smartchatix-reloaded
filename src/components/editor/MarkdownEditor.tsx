'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo
} from 'lucide-react';

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },

  renderMarkdown(state: any, node: any): string {
    const { src, alt, width, height } = node.attrs;

    if (width || height) {
      const widthAttr = width ? ` width="${width}"` : '';
      const heightAttr = height ? ` height="${height}"` : '';
      const altAttr = alt ? ` alt="${alt}"` : '';
      state.write(`<img src="${src}"${altAttr}${widthAttr}${heightAttr} />\n\n`);
    } else {
      state.write(`![${alt || ''}](${src})\n\n`);
    }
    return '';
  },

  parseMarkdown() {
    return {
      node: 'image',
      getAttrs: (token: any) => {
        return {
          src: token.attrGet('src'),
          alt: token.attrGet('alt'),
          width: token.attrGet('width'),
          height: token.attrGet('height'),
        };
      },
    };
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.maxWidth = '100%';
      container.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.display = 'block';

      if (node.attrs.width) {
        img.style.width = node.attrs.width + 'px';
      }
      if (node.attrs.height) {
        img.style.height = node.attrs.height + 'px';
      }

      const resizeHandle = document.createElement('div');
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.right = '0';
      resizeHandle.style.bottom = '0';
      resizeHandle.style.width = '16px';
      resizeHandle.style.height = '16px';
      resizeHandle.style.background = '#667eea';
      resizeHandle.style.cursor = 'nwse-resize';
      resizeHandle.style.borderRadius = '0 0 8px 0';
      resizeHandle.style.opacity = '0';
      resizeHandle.style.transition = 'opacity 0.2s';

      container.addEventListener('mouseenter', () => {
        resizeHandle.style.opacity = '1';
      });

      container.addEventListener('mouseleave', () => {
        resizeHandle.style.opacity = '0';
      });

      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;

      resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;

        img.style.height = startHeight + 'px';

        const onMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          const newWidth = startWidth + deltaX;
          const newHeight = startHeight + deltaY;

          if (newWidth > 100 && newWidth < 1200) {
            img.style.width = newWidth + 'px';
          }
          if (newHeight > 100 && newHeight < 1200) {
            img.style.height = newHeight + 'px';
          }
        };

        const onMouseUp = () => {
          if (isResizing) {
            isResizing = false;
            const pos = getPos();
            if (typeof pos === 'number') {
              const { tr } = editor.state;
              const resolvedPos = tr.doc.resolve(pos);

              editor.view.dispatch(
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  width: img.offsetWidth,
                  height: img.offsetHeight
                })
              );

              console.log('🎯 Imagen redimensionada:', {
                width: img.offsetWidth,
                height: img.offsetHeight,
                src: node.attrs.src
              });
            }
          }
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      container.appendChild(img);
      container.appendChild(resizeHandle);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') return false;

          img.src = updatedNode.attrs.src;
          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width + 'px';
          }
          if (updatedNode.attrs.height) {
            img.style.height = updatedNode.attrs.height + 'px';
          }
          return true;
        },
      };
    };
  },
});

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe el contenido de la lección aquí...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #2563eb; text-decoration: underline;'
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        style: 'min-height: 400px; padding: 0 16px 16px 16px; outline: none;'
      }
    }
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL de la imagen:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const MenuButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: '8px',
        border: 'none',
        background: isActive ? '#e0e7ff' : 'transparent',
        color: isActive ? '#4f46e5' : '#6b7280',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'visible',
      background: 'white',
      padding: 0,
      position: 'relative'
    }}>
      {/* White overlay to cover gap */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '0px',
        zIndex: 9,
        background: '#f9fafb',
        marginBottom: '0'
      }} />

      {/* Toolbar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        padding: '8px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        borderRadius: '6px 6px 0 0'
      }}>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrita (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Bloque de código"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

        <MenuButton
          onClick={addImage}
          title="Insertar imagen"
        >
          <ImageIcon className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={addLink}
          isActive={editor.isActive('link')}
          title="Insertar enlace"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Rehacer (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#1f2937'
        }}
      />

      {/* Footer info */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        💡 Tip: Puedes pegar contenido desde ChatGPT y mantener el formato
      </div>
    </div>
  );
};

export default MarkdownEditor;
