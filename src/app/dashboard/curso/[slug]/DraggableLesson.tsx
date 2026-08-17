'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableLessonProps {
  lesson: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function DraggableLesson({ lesson, index, onEdit, onDelete }: DraggableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `lesson-${lesson.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '📹';
      case 'document': return '📄';
      case 'markdown': return '📝';
      case 'quiz': return '❓';
      case 'assignment': return '📋';
      default: return '📄';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'document': return 'PDF';
      case 'markdown': return 'Markdown';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Tarea';
      default: return type;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '8px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          color: '#d1d5db',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Arrastra para reordenar"
      >
        ☰
      </div>

      {/* Lesson Number */}
      <div style={{
        fontSize: '13px',
        color: '#9ca3af',
        fontWeight: '600',
        width: '24px',
        textAlign: 'center'
      }}>
        {index + 1}
      </div>

      {/* Content Type Icon */}
      <span style={{ fontSize: '18px' }}>
        {getContentTypeIcon(lesson.content_type)}
      </span>

      {/* Lesson Info */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#1a202c',
          marginBottom: '2px'
        }}>
          {lesson.title}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          display: 'flex',
          gap: '12px'
        }}>
          <span>{getContentTypeLabel(lesson.content_type)}</span>
          {lesson.duration && <span>• {lesson.duration}</span>}
          {lesson.is_free && <span style={{ color: '#10b981' }}>• Gratis</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={onEdit}
        style={{
          padding: '6px 12px',
          background: '#f3f4f6',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
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
          padding: '6px 12px',
          background: '#fee2e2',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          color: '#dc2626'
        }}
      >
        🗑️
      </button>
    </div>
  );
}
