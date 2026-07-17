'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ParsedStructure {
  title?: string;
  description?: string;
  course_description?: string;
  modules: Array<{
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      description: string;
      content_type: 'video' | 'document' | 'quiz';
      duration: string;
    }>;
  }>;
}

interface CourseStructureAssistantProps {
  onStructureCreated: (structure: ParsedStructure) => void;
}

export default function CourseStructureAssistant({ onStructureCreated }: CourseStructureAssistantProps) {
  const [mode, setMode] = useState<'select' | 'paste' | 'chat'>('select');
  const [pastedContent, setPastedContent] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedStructure, setParsedStructure] = useState<ParsedStructure | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [modal, setModal] = useState<{
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

  const handlePasteAndParse = async () => {
    if (!courseTitle.trim()) {
      showModal('warning', 'Por favor ingresa el título del curso');
      return;
    }

    if (!pastedContent.trim()) {
      showModal('warning', 'Por favor pega el contenido del curso');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/instructor/parse-course-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: pastedContent,
          duration: courseDuration,
          title: courseTitle
        })
      });

      if (!response.ok) throw new Error('Error al procesar');

      const data = await response.json();
      setParsedStructure(data.structure);
    } catch (error) {
      console.error('Error:', error);
      showModal('error', 'Error al procesar el contenido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage: Message = { role: 'user', content: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/instructor/chat-course-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newMessage]
        })
      });

      if (!response.ok) throw new Error('Error en el chat');

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);

      if (data.structure) {
        console.log('Estructura recibida del chat:', JSON.stringify(data.structure, null, 2));

        // Autocompletar título si viene en la estructura
        if (data.structure.course_title) {
          setCourseTitle(data.structure.course_title);
        }

        setParsedStructure(data.structure);
      }
    } catch (error) {
      console.error('Error:', error);
      showModal('error', 'Error al comunicarse con el asistente');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCourse = () => {
    if (!parsedStructure) return;

    if (!courseTitle.trim()) {
      showModal('warning', 'Por favor ingresa el título del curso');
      return;
    }

    const description = parsedStructure.course_description || 'Descripción del curso';

    onStructureCreated({
      title: courseTitle,
      description,
      ...parsedStructure
    });
  };

  if (mode === 'select') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' }}>
          Asistente de Estructura de Curso
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
          Elige cómo quieres crear la estructura de tu curso
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <button
            onClick={() => setMode('paste')}
            style={{
              padding: '32px 24px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a202c' }}>
              Pegar Contenido
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Ya estructuré mi curso en otra IA. Quiero pegar el contenido y que detecte automáticamente los módulos y lecciones.
            </p>
          </button>

          <button
            onClick={() => {
              setMode('chat');
              setChatMessages([{
                role: 'assistant',
                content: '¡Hola! Soy tu asistente para crear la estructura de tu curso. Para comenzar, ¿cuál es el tema principal del curso que quieres crear?'
              }]);
            }}
            style={{
              padding: '32px 24px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a202c' }}>
              Chat Interactivo
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Aún no tengo estructura. Quiero que la IA me ayude conversando sobre el tema, duración y objetivos del curso.
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'paste') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => {
            setMode('select');
            setPastedContent('');
            setParsedStructure(null);
          }}
          style={{
            marginBottom: '24px',
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#6b7280'
          }}
        >
          ← Volver
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' }}>
          Pegar Contenido del Curso
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Pega aquí la estructura de tu curso que generaste en ChatGPT, Claude, Gemini, NotebookLM, etc.
        </p>

        {!parsedStructure ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                Título del curso
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Ej: Introducción a Python para Principiantes"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                Duración total estimada del curso
              </label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="Ej: 4 semanas, 20 horas, 2 meses"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Esto ayudará a distribuir el tiempo entre módulos y lecciones
              </p>
            </div>

            <textarea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder="Ejemplo:

Módulo 1: Introducción a JavaScript
- Lección 1.1: Variables y tipos de datos
- Lección 1.2: Operadores y expresiones
- Lección 1.3: Estructuras de control

Módulo 2: Funciones y Objetos
- Lección 2.1: Declaración de funciones
- Lección 2.2: Arrow functions
..."
              style={{
                width: '100%',
                minHeight: '400px',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handlePasteAndParse}
              disabled={isProcessing || !pastedContent.trim()}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: isProcessing || !pastedContent.trim() ? '#e5e7eb' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isProcessing || !pastedContent.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isProcessing ? 'Procesando...' : 'Detectar Estructura'}
            </button>
          </>
        ) : (
          <div>
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '14px', color: '#166534', margin: 0, marginBottom: '4px' }}>
                ✓ Estructura detectada: {parsedStructure.modules.length} módulos con {parsedStructure.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones
              </p>
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0, marginBottom: parsedStructure.course_description ? '8px' : 0 }}>
                Duración total: {parsedStructure.modules.reduce((total, m) => {
                  return total + m.lessons.reduce((lessonTotal, l) => {
                    const minutes = parseInt(l.duration.match(/\d+/)?.[0] || '0');
                    return lessonTotal + minutes;
                  }, 0);
                }, 0)} minutos
              </p>
              {parsedStructure.course_description && (
                <p style={{ fontSize: '13px', color: '#15803d', margin: 0, fontStyle: 'italic', borderTop: '1px solid #86efac', paddingTop: '8px' }}>
                  "{parsedStructure.course_description}"
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' }}>
                Vista Previa de la Estructura
              </h3>
              {parsedStructure.modules.map((module, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a202c' }}>
                    {module.title || `Módulo ${idx + 1}`}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                    {module.description || 'Sin descripción'}
                  </p>
                  <div style={{ paddingLeft: '16px' }}>
                    {module.lessons && Array.isArray(module.lessons) && module.lessons.map((lesson, lessonIdx) => (
                      <div key={lessonIdx} style={{ marginBottom: '8px', fontSize: '13px', color: '#4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>• {lesson.title || `Lección ${idx + 1}.${lessonIdx + 1}`}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{lesson.duration || '15 min'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setParsedStructure(null);
                  setPastedContent('');
                }}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              >
                Volver a Intentar
              </button>
              <button
                onClick={handleCreateCourse}
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Crear Curso con esta Estructura
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'chat') {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={() => {
            setMode('select');
            setChatMessages([]);
            setParsedStructure(null);
          }}
          style={{
            marginBottom: '24px',
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#6b7280'
          }}
        >
          ← Volver
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' }}>
          Asistente Interactivo
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Conversa con la IA para estructurar tu curso
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: parsedStructure ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Columna izquierda: Chat */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#667eea' : '#f3f4f6',
                  color: msg.role === 'user' ? 'white' : '#1a202c',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f3f4f6',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isProcessing || !userMessage.trim()}
              style={{
                padding: '10px 20px',
                background: isProcessing || !userMessage.trim() ? '#e5e7eb' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isProcessing || !userMessage.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Enviar
            </button>
          </div>
        </div>

          {/* Columna derecha: Preview */}
          {parsedStructure && (
            <div style={{
              overflowY: 'auto',
              height: '600px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '14px', color: '#166534', marginBottom: '4px' }}>
                ✓ Estructura generada: {parsedStructure.modules.length} módulos con {parsedStructure.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones
              </p>
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0, marginBottom: parsedStructure.course_description ? '8px' : '12px' }}>
                Duración total: {parsedStructure.modules.reduce((total, m) => {
                  return total + m.lessons.reduce((lessonTotal, l) => {
                    const durationStr = l.duration || '0 min';
                    const minutes = parseInt(durationStr.match(/\d+/)?.[0] || '0');
                    return lessonTotal + minutes;
                  }, 0);
                }, 0)} minutos
              </p>
              {parsedStructure.course_description && (
                <p style={{ fontSize: '13px', color: '#15803d', margin: 0, fontStyle: 'italic', borderTop: '1px solid #86efac', paddingTop: '8px', marginBottom: '12px' }}>
                  "{parsedStructure.course_description}"
                </p>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#166534' }}>
                  Título del curso
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Ingresa el título del curso"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #86efac',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' }}>
                Vista Previa de la Estructura
              </h3>
              {parsedStructure.modules.map((module, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a202c' }}>
                    {module.title || `Módulo ${idx + 1}`}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                    {module.description || 'Sin descripción'}
                  </p>
                  <div style={{ paddingLeft: '16px' }}>
                    {module.lessons && Array.isArray(module.lessons) && module.lessons.map((lesson, lessonIdx) => (
                      <div key={lessonIdx} style={{ marginBottom: '8px', fontSize: '13px', color: '#4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>• {lesson.title || `Lección ${idx + 1}.${lessonIdx + 1}`}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{lesson.duration || '15 min'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
                ¿Todo listo? Puedes seguir pidiendo cambios en el chat de la izquierda o crear el curso con esta estructura.
              </p>
              <button
                onClick={handleCreateCourse}
                disabled={!courseTitle.trim()}
                style={{
                  padding: '14px 32px',
                  background: !courseTitle.trim() ? '#9ca3af' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !courseTitle.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: !courseTitle.trim() ? 'none' : '0 2px 8px rgba(22, 163, 74, 0.3)'
                }}
              >
                ✓ Está bien, crear curso
              </button>
            </div>
            </div>
          )}
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
      </div>
    );
  }

  return null;
}
