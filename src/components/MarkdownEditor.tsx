'use client';

import React, { useEffect } from 'react';
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [modal, setModal] = React.useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: 'info', message: '' });
  };

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
        class: 'prose-editor-content'
      }
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showModal('warning', 'Por favor selecciona una imagen válida');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      showModal('error', 'Error al subir la imagen. Por favor intenta de nuevo.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
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
    <>
      <style>{`
        .markdown-editor-wrapper {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          overflow: visible;
          position: relative;
        }
        .editor-toolbar-sticky {
          position: -webkit-sticky;
          position: sticky;
          top: -1px;
          z-index: 100;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-top: -1px;
          border-radius: 6px 6px 0 0;
        }
        .prose-editor-content {
          min-height: 400px;
          padding: 0 16px 16px 16px;
          outline: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;
        }
        .editor-content-wrapper {
          max-height: 600px;
          overflow-y: auto;
          border-radius: 0 0 6px 6px;
        }
      `}</style>
      <div className="markdown-editor-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        <div className="editor-toolbar-sticky">
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
            title="Subir imagen desde tu computador"
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

        <div className="editor-content-wrapper">
          <EditorContent editor={editor} />
        </div>

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

      {modal.show && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              background: modal.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                         modal.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                         modal.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                         'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)'
            }}>
              {modal.type === 'success' ? '✓' : modal.type === 'error' ? '✕' : modal.type === 'warning' ? '⚠' : 'ℹ'}
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              style={{
                padding: '0.75rem 2rem',
                background: modal.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                           modal.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                           modal.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                           'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownEditor;
