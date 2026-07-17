'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableModuleProps {
  module: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  children?: React.ReactNode;
}

export function DraggableModule({
  module,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddLesson,
  children
}: DraggableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `module-${module.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: isExpanded ? '#f9fafb' : 'white'
          }}
        >
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: 'grab',
              padding: '8px',
              color: '#9ca3af',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Arrastra para reordenar"
          >
            ☰
          </div>

          {/* Module Number */}
          <div
            onClick={onToggle}
            style={{
              width: '32px',
              height: '32px',
              background: '#667eea',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            {index + 1}
          </div>

          {/* Module Info */}
          <div onClick={onToggle} style={{ flex: 1, cursor: 'pointer' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a202c',
              margin: '0 0 4px 0'
            }}>
              {module.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              {module.lessons?.length || 0} lecciones
            </p>
          </div>

          {/* Toggle Icon */}
          <div onClick={onToggle} style={{ cursor: 'pointer', color: '#9ca3af', fontSize: '20px' }}>
            {isExpanded ? '▼' : '▶'}
          </div>

          {/* Action Buttons */}
          <button
            onClick={onEdit}
            style={{
              padding: '8px 16px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '8px 16px',
              background: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#dc2626'
            }}
          >
            🗑️
          </button>
        </div>

        {/* Lessons Area */}
        {isExpanded && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            {children}

            <button
              onClick={onAddLesson}
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              + Agregar Lección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
