'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
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
  Redo,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Pipette
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
  const textColorInputRef = React.useRef<HTMLInputElement>(null);
  const cellColorInputRef = React.useRef<HTMLInputElement>(null);
  const [showTableMenu, setShowTableMenu] = React.useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);
  const [showCellColorPicker, setShowCellColorPicker] = React.useState(false);
  const [recentTextColors, setRecentTextColors] = React.useState<string[]>([]);
  const [recentCellColors, setRecentCellColors] = React.useState<string[]>([]);
  const [tempTextColor, setTempTextColor] = React.useState('#000000');
  const [tempCellColor, setTempCellColor] = React.useState('#ffffff');
  const [modal, setModal] = React.useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  const themeColors = [
    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6',
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
    '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#14b8a6', '#6366f1'
  ];

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
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
        alignments: ['left', 'center', 'right'],
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          style: 'border-collapse: collapse; width: 100%; margin: 1rem 0;'
        }
      }),
      TableRow,
      TableHeader.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: element => element.style.backgroundColor || null,
              renderHTML: attributes => {
                if (!attributes.backgroundColor) return {};
                return { style: `background-color: ${attributes.backgroundColor}` };
              },
            },
            colwidth: {
              default: null,
              parseHTML: element => {
                const width = element.getAttribute('data-colwidth');
                return width ? [parseInt(width, 10)] : null;
              },
              renderHTML: attributes => {
                if (!attributes.colwidth) return {};
                return {
                  'data-colwidth': attributes.colwidth,
                  style: `width: ${attributes.colwidth}px`,
                };
              },
            },
          };
        },
      }),
      TableCell.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: element => element.style.backgroundColor || null,
              renderHTML: attributes => {
                if (!attributes.backgroundColor) return {};
                return { style: `background-color: ${attributes.backgroundColor}` };
              },
            },
            colwidth: {
              default: null,
              parseHTML: element => {
                const width = element.getAttribute('data-colwidth');
                return width ? [parseInt(width, 10)] : null;
              },
              renderHTML: attributes => {
                if (!attributes.colwidth) return {};
                return {
                  'data-colwidth': attributes.colwidth,
                  style: `width: ${attributes.colwidth}px`,
                };
              },
            },
          };
        },
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

  useEffect(() => {
    const savedTextColors = localStorage.getItem('tiptap-recent-text-colors');
    const savedCellColors = localStorage.getItem('tiptap-recent-cell-colors');
    if (savedTextColors) setRecentTextColors(JSON.parse(savedTextColors));
    if (savedCellColors) setRecentCellColors(JSON.parse(savedCellColors));
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showTableMenu) setShowTableMenu(false);
      if (showTextColorPicker) setShowTextColorPicker(false);
      if (showCellColorPicker) setShowCellColorPicker(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTableMenu, showTextColorPicker, showCellColorPicker]);

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

  const addToRecentColors = (color: string, type: 'text' | 'cell') => {
    const setColors = type === 'text' ? setRecentTextColors : setRecentCellColors;
    const storageKey = type === 'text' ? 'tiptap-recent-text-colors' : 'tiptap-recent-cell-colors';

    setColors(prev => {
      const filtered = prev.filter(c => c !== color);
      const newColors = [color, ...filtered].slice(0, 6);
      localStorage.setItem(storageKey, JSON.stringify(newColors));
      return newColors;
    });
  };

  const applyTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    addToRecentColors(color, 'text');
  };

  const applyCellColor = (color: string) => {
    console.log('🎨 Applying cell color:', color);
    console.log('📊 Is in table cell?', editor.isActive('tableCell'));
    console.log('📊 Is in table header?', editor.isActive('tableHeader'));
    console.log('📊 Editor state:', editor.state.selection);

    const result = editor.chain().setCellAttribute('backgroundColor', color).run();
    console.log('✅ Command result:', result);

    addToRecentColors(color, 'cell');
    setTempCellColor(color);
  };


  const MenuButton: React.FC<{
    onClick: (e?: React.MouseEvent) => void;
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
        .prose-editor-content table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: visible;
        }
        .prose-editor-content table td,
        .prose-editor-content table th {
          border: 2px solid #e5e7eb;
          padding: 8px 12px;
          position: relative;
          min-width: 100px;
          vertical-align: top;
        }
        .prose-editor-content table th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .prose-editor-content p {
          margin: 0;
        }
        .prose-editor-content table tr:hover {
          background-color: #f9fafb;
        }
        .prose-editor-content .selectedCell {
          outline: 3px solid #667eea;
          outline-offset: -3px;
          position: relative;
        }
        .prose-editor-content .ProseMirror-selectednode {
          outline: 3px solid #667eea;
        }
        .prose-editor-content .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #667eea;
          cursor: col-resize;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .prose-editor-content table td:hover .column-resize-handle,
        .prose-editor-content table th:hover .column-resize-handle {
          opacity: 1;
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
          {/* Formato de texto básico */}
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

          <div style={{ position: 'relative' }}>
            <MenuButton
              onClick={(e) => {
                e?.stopPropagation();
                setShowTextColorPicker(!showTextColorPicker);
              }}
              title="Color de texto"
            >
              <Pipette className="w-4 h-4" />
            </MenuButton>

            {showTextColorPicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  minWidth: '220px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#667eea', marginBottom: '8px' }}>
                  COLOR DE TEXTO
                </div>

                {/* Colores del tema */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Colores del tema:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                    {themeColors.map(color => (
                      <button
                        key={color}
                        onClick={() => applyTextColor(color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: color,
                          border: '2px solid #e5e7eb',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'transform 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Colores recientes */}
                {recentTextColors.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Recientes:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {recentTextColors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => applyTextColor(color)}
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: color,
                            border: '2px solid #e5e7eb',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'transform 0.1s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Input hexadecimal personalizado para texto */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Personalizado (hex):</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      backgroundColor: tempTextColor,
                      border: '2px solid #e5e7eb',
                      flexShrink: 0
                    }} />
                    <input
                      ref={textColorInputRef}
                      type="text"
                      value={tempTextColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTempTextColor(value);
                        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                          applyTextColor(value);
                        }
                      }}
                      placeholder="#000000"
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

          {/* Títulos */}
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

          {/* Listas */}
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

          {/* Otros formatos */}
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

          {/* Media */}
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

          {/* Tabla */}
          <div style={{ position: 'relative' }}>
            <MenuButton
              onClick={(e) => {
                e?.stopPropagation();
                const inTable = editor.isActive('tableCell') || editor.isActive('tableHeader');
                console.log('🔧 Click en botón tabla. inTable:', inTable, 'showTableMenu:', showTableMenu);
                if (inTable) {
                  setShowTableMenu(!showTableMenu);
                  console.log('🔧 Nuevo estado showTableMenu:', !showTableMenu);
                } else {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                }
              }}
              isActive={editor.isActive('tableCell') || editor.isActive('tableHeader')}
              title={(editor.isActive('tableCell') || editor.isActive('tableHeader')) ? "Editar tabla" : "Insertar tabla"}
            >
              <TableIcon className="w-4 h-4" />
            </MenuButton>

            {/* Menú desplegable de edición de tabla */}
            {showTableMenu && (editor.isActive('tableCell') || editor.isActive('tableHeader')) && (
              <div
                onClick={(e) => {
                  console.log('🎯 Click en el menú de tabla');
                  e.stopPropagation();
                }}
                style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '200px',
                pointerEvents: 'auto'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#667eea',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Editar Tabla
                </div>

                {/* Instrucción de selección múltiple */}
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '4px',
                  padding: '6px',
                  marginBottom: '8px',
                  fontSize: '10px',
                  color: '#0c4a6e',
                  lineHeight: '1.4'
                }}>
                  💡 <strong>Tip:</strong> Mantén <kbd style={{
                    background: 'white',
                    padding: '1px 4px',
                    borderRadius: '2px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'monospace',
                    fontSize: '9px'
                  }}>Shift</kbd> y arrastra con el mouse para seleccionar varias celdas
                </div>

                {/* Selección */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Selección rápida:</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        editor.chain().focus().selectNodeBackward().run();
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      📋 Toda la tabla
                    </button>
                  </div>
                </div>

                {/* Alineación */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Alineación:</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <MenuButton
                      onClick={() => editor.chain().focus().setTextAlign('left').run()}
                      isActive={editor.isActive({ textAlign: 'left' })}
                      title="Izquierda"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                      isActive={editor.isActive({ textAlign: 'center' })}
                      title="Centro"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                      isActive={editor.isActive({ textAlign: 'right' })}
                      title="Derecha"
                    >
                      <AlignRight className="w-4 h-4" />
                    </MenuButton>
                  </div>
                </div>

                {/* Color de fondo */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Color de fondo celda:</div>

                  {/* Colores del tema para celda */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {themeColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          applyCellColor(color);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: color,
                          border: '2px solid #e5e7eb',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'transform 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Colores recientes para celda */}
                  {recentCellColors.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '9px', color: '#6b7280', marginBottom: '4px' }}>Recientes:</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {recentCellColors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => applyCellColor(color)}
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: color,
                              border: '2px solid #e5e7eb',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input hexadecimal personalizado para celda */}
                  <div>
                    <div style={{ fontSize: '9px', color: '#6b7280', marginBottom: '4px' }}>Personalizado (hex):</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: tempCellColor,
                        border: '2px solid #e5e7eb',
                        flexShrink: 0
                      }} />
                      <input
                        ref={cellColorInputRef}
                        type="text"
                        value={tempCellColor}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTempCellColor(value);
                          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                            applyCellColor(value);
                          }
                        }}
                        placeholder="#000000"
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '8px', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Eliminar tabla
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />

          {/* Deshacer/Rehacer */}
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
          💡 Tip: Puedes pegar contenido desde ChatGPT y mantener el formato (incluyendo tablas)
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
