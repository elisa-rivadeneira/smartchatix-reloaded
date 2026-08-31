'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MarkdownEditor from '@/components/MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';
import Breadcrumb from '@/components/Breadcrumb';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';
import { CertificateTemplate, DEFAULT_CERTIFICATE_TEMPLATE, resolveCertificateTemplate } from '@/lib/certificate-template';
import CertificateTemplateForm from '@/components/certificate/CertificateTemplateForm';
import CertificatePreview from '@/components/certificate/CertificatePreview';

function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  try {
    return marked(markdown) as string;
  } catch (error) {
    console.error('Error converting markdown:', error);
    return markdown;
  }
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/embed/')) {
    return url;
  } else {
    videoId = url;
  }
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&playsinline=1`;
  }
  return url;
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content_type: 'video' | 'document' | 'quiz' | 'assignment' | 'markdown' | 'material';
  video_url: string;
  video_file: string;
  main_content: string;
  document_url: string;
  documents_urls: string | string[] | null;
  markdown_content: string;
  markdown_image: string;
  markdown_video: string;
  duration: string;
  order_index: number;
  is_free: boolean;
  has_quiz: boolean;
  quiz_questions_count: number;
  quiz_data: any;
}

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  price_vivo: number;
  price_grabado: number;
  is_active: boolean;
  is_certification_enabled?: boolean;
  passing_score?: number;
  publication_status?: 'published' | 'coming_soon' | 'unpublished';
  email_confirmation_template?: string | null;
  email_payment_confirmation_template?: string | null;
  certificate_template?: string | null;
  modules: Module[];
}

function QuizManagementModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  console.log('QuizManagementModal rendered with lesson:', lesson);

  const [quizData, setQuizData] = useState(lesson.quiz_data || null);
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(lesson.quiz_questions_count || 2);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [regenerateModal, setRegenerateModal] = useState<{ open: boolean; questionIndex: number; currentQuestion: any } | null>(null);
  const [regenerateObservations, setRegenerateObservations] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmRegenerateAll, setConfirmRegenerateAll] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState<string>('');

  const handleGenerateQuiz = async () => {
    const content = lesson.main_content || lesson.markdown_content;
    if (!content) {
      setErrorModal('Esta lección no tiene contenido Markdown para generar preguntas');
      return;
    }

    setGeneratingQuiz(true);
    try {
      const response = await fetch('/api/instructor/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          questionsCount: quizQuestionsCount,
          generalInstructions: generalInstructions || undefined
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al generar preguntas');
      }
      const data = await response.json();
      setQuizData(data.questions);
    } catch (error: any) {
      console.error('Error completo:', error);
      alert(error.message || 'Error al generar preguntas');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleRegenerateAll = () => {
    setConfirmRegenerateAll(true);
  };

  const confirmAndRegenerateAll = async () => {
    setConfirmRegenerateAll(false);
    await handleGenerateQuiz();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/instructor/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lesson,
          quiz_questions_count: quizQuestionsCount,
          quiz_data: quizData
        })
      });
      if (!response.ok) throw new Error('Error');
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        onClose();
      }, 2000);
    } catch (error) {
      setErrorModal('Error al guardar preguntas');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {generatingQuiz && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            🤖 Generando preguntas con IA...<br/>
            <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.8 }}>
              Esto puede tomar unos segundos
            </span>
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
              ⚡ Gestión de Preguntas
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {lesson.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Instrucciones generales para la IA (opcional)
              </label>
              <textarea
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                placeholder="Ejemplo: Si la pregunta menciona un documento, aclarar que el usuario adjuntó el documento en el chat. Hacer las preguntas más descriptivas y contextuales."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', margin: 0 }}>
                💡 Indica cómo quieres que la IA genere las preguntas. Si lo dejas vacío, la IA usará las instrucciones predeterminadas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Número de preguntas (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quizQuestionsCount}
                  onChange={(e) => setQuizQuestionsCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  style={{
                    width: '100px',
                    padding: '8px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              {!quizData && (
              <button
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
                style={{
                  padding: '8px 20px',
                  background: generatingQuiz ? '#9ca3af' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: generatingQuiz ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
              >
                {generatingQuiz ? '🤖 Generando...' : '✨ Generar Preguntas con IA'}
              </button>
            )}
            {quizData && (
              <button
                onClick={handleRegenerateAll}
                disabled={generatingQuiz}
                style={{
                  padding: '8px 20px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: generatingQuiz ? 'not-allowed' : 'pointer',
                  color: '#991b1b'
                }}
              >
                🔄 Regenerar Todas
              </button>
            )}
          </div>

          {quizData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quizData.map((q: any, idx: number) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      Pregunta {idx + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRegenerateModal({
                          open: true,
                          questionIndex: idx,
                          currentQuestion: q
                        });
                        setRegenerateObservations('');
                      }}
                      disabled={generatingQuiz}
                      style={{
                        padding: '4px 12px',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: generatingQuiz ? 'not-allowed' : 'pointer',
                        color: '#991b1b'
                      }}
                    >
                      🔄 Regenerar
                    </button>
                  </div>

                  <textarea
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quizData];
                      updated[idx].question = e.target.value;
                      setQuizData(updated);
                    }}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      marginBottom: '12px',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(q.options).map(([key, value]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name={`correct-${idx}`}
                          checked={q.correct === key}
                          onChange={() => {
                            const updated = [...quizData];
                            updated[idx].correct = key;
                            setQuizData(updated);
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', minWidth: '20px' }}>
                          {key}:
                        </span>
                        <textarea
                          value={value}
                          onChange={(e) => {
                            const updated = [...quizData];
                            updated[idx].options[key] = e.target.value;
                            setQuizData(updated);
                          }}
                          rows={1}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                            background: q.correct === key ? '#dcfce7' : 'white',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {q.explanations && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#475569',
                        marginBottom: '10px'
                      }}>
                        📝 Explicaciones (revisa que sean claras y correctas):
                      </p>
                      {Object.entries(q.explanations).map(([key, explanation]: [string, any]) => (
                        <div key={key} style={{
                          marginBottom: '10px',
                          paddingBottom: '10px',
                          borderBottom: key !== 'D' ? '1px solid #e2e8f0' : 'none'
                        }}>
                          <p style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: q.correct === key ? '#15803d' : '#991b1b',
                            marginBottom: '4px'
                          }}>
                            {q.correct === key ? '✓' : '❌'} Opción {key} {q.correct === key ? '(Correcta)' : '(Incorrecta)'}:
                          </p>
                          <div style={{
                            fontSize: '12px',
                            color: '#374151',
                            lineHeight: '1.5',
                            margin: 0
                          }} className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                              {explanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      <p style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        marginTop: '8px',
                        fontStyle: 'italic',
                        margin: 0
                      }}>
                        💡 Si alguna explicación no tiene sentido o está incorrecta, usa "🔄 Regenerar" y agrega observaciones específicas.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 20px',
          borderTop: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: '10px 24px',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              color: '#374151'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !quizData}
            style={{
              padding: '10px 24px',
              background: saving || !quizData ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving || !quizData ? 'not-allowed' : 'pointer',
              color: 'white'
            }}
          >
            {saving ? '⏳ Guardando...' : '✓ Guardar Preguntas'}
          </button>
        </div>
      </div>
      </div>

      {regenerateModal?.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
              🔄 Regenerar Pregunta {regenerateModal.questionIndex + 1}
            </h3>

            <div style={{
              background: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                Pregunta actual:
              </p>
              <p style={{ fontSize: '12px', color: '#1a202c', marginBottom: '8px' }}>
                {regenerateModal.currentQuestion.question}
              </p>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {Object.entries(regenerateModal.currentQuestion.options).map(([key, value]: [string, any]) => (
                  <div key={key} style={{ marginBottom: '2px' }}>
                    {key}) {value} {regenerateModal.currentQuestion.correct === key && '✓'}
                  </div>
                ))}
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              Observaciones para mejorar la pregunta (opcional):
            </label>
            <textarea
              value={regenerateObservations}
              onChange={(e) => setRegenerateObservations(e.target.value)}
              placeholder="Ejemplo: La pregunta debe indicar 'prompt efectivo para...' y las respuestas deben ser más realistas"
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '12px',
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '16px' }}>
              💡 Si dejas vacío, se generará una pregunta completamente nueva. Si agregas observaciones, la IA mejorará la pregunta actual.
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setRegenerateModal(null);
                  setRegenerateObservations('');
                }}
                disabled={generatingQuiz}
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: generatingQuiz ? 'not-allowed' : 'pointer',
                  color: '#475569'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setGeneratingQuiz(true);
                  try {
                    const existingQuestions = quizData.filter((_: any, i: number) => i !== regenerateModal.questionIndex);
                    const content = lesson.main_content || lesson.markdown_content;

                    const response = await fetch('/api/instructor/generate-quiz', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        content,
                        questionsCount: 1,
                        existingQuestions,
                        generalInstructions: generalInstructions || undefined,
                        improveQuestion: regenerateObservations ? {
                          currentQuestion: regenerateModal.currentQuestion,
                          observations: regenerateObservations
                        } : undefined
                      })
                    });
                    if (!response.ok) throw new Error('Error');
                    const data = await response.json();
                    const updated = [...quizData];
                    updated[regenerateModal.questionIndex] = data.questions[0];
                    setQuizData(updated);
                    setRegenerateModal(null);
                    setRegenerateObservations('');
                  } catch (error) {
                    alert('Error al regenerar pregunta');
                  } finally {
                    setGeneratingQuiz(false);
                  }
                }}
                disabled={generatingQuiz}
                style={{
                  padding: '8px 16px',
                  background: generatingQuiz ? '#9ca3af' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: generatingQuiz ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
              >
                {generatingQuiz ? '⏳ Regenerando...' : '✨ Regenerar con IA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRegenerateAll && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '12px'
            }}>
              🔄 Regenerar todas las preguntas
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Las preguntas actuales se reemplazarán por completo. Esta acción no se puede deshacer.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setConfirmRegenerateAll(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmAndRegenerateAll}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                Sí, regenerar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {successModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(34, 197, 94, 0.3)',
            border: '2px solid #22c55e'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ✓
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#15803d',
              marginBottom: '8px'
            }}>
              ¡Guardado exitosamente!
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Las preguntas se guardaron correctamente
            </p>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {errorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.3)',
            border: '2px solid #ef4444'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ⚠️
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#991b1b',
              marginBottom: '8px'
            }}>
              Error
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '20px'
            }}>
              {errorModal}
            </p>
            <button
              onClick={() => setErrorModal('')}
              style={{
                padding: '10px 24px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

function SortableLesson({ lesson, lessonIdx, onQuiz, onPreview, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `lesson-${lesson.id}` });

  const hasAttachedFiles = (() => {
    if (!lesson.documents_urls) return false;
    const urls = typeof lesson.documents_urls === 'string' ? JSON.parse(lesson.documents_urls) : lesson.documents_urls;
    return Array.isArray(urls) && urls.length > 0;
  })();

  const hasContent = lesson.video_url || lesson.video_file || lesson.document_url || lesson.markdown_content || lesson.main_content || hasAttachedFiles;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className="lesson-card"
      style={{
        ...style,
        background: 'white',
        border: hasContent ? '1px solid #e5e7eb' : '2px dashed #fbbf24',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .lesson-card {
            flex-wrap: wrap !important;
          }
          .lesson-card-content {
            width: 100% !important;
            margin-top: 8px;
          }
          .lesson-card-actions {
            width: 100% !important;
            justify-content: flex-end !important;
            flex-wrap: wrap;
            margin-top: 8px;
          }
        }
      `}</style>
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          color: '#d1d5db',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          paddingRight: '8px'
        }}
        title="Arrastra para reordenar"
      >
        ☰
      </div>
      <div style={{
        width: '24px',
        height: '24px',
        background: '#f3f4f6',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: '#6b7280',
        flexShrink: 0
      }}>
        {lessonIdx + 1}
      </div>
      <div className="lesson-card-content" style={{ flex: 1 }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: hasContent ? '#1a202c' : '#d97706',
          margin: '0 0 4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {lesson.title}
          {!hasContent && (
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#d97706',
              background: '#fef3c7',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              ⚠️ Sin contenido
            </span>
          )}
        </h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {lesson.content_type === 'video' ? '📚 Lección' : lesson.content_type === 'quiz' ? '❓ Quiz' : lesson.content_type === 'material' ? '📎 Material Adjunto' : '📋 Tarea'}
          </span>
          {lesson.duration && (
            <span style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              • {lesson.duration}
            </span>
          )}
          {lesson.is_free === 1 && (
            <span style={{
              padding: '2px 8px',
              background: '#dbeafe',
              color: '#1e40af',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '4px'
            }}>
              Gratis
            </span>
          )}
          {lesson.has_quiz === 1 && lesson.quiz_questions_count > 0 && (
            <span style={{
              padding: '2px 8px',
              background: '#f0f9ff',
              color: '#0c4a6e',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '4px'
            }}>
              ⚡ {lesson.quiz_questions_count} pregunta(s)
            </span>
          )}
        </div>
      </div>
      <div className="lesson-card-actions" style={{ display: 'flex', gap: '6px' }}>
        {lesson.has_quiz === 1 && (
          <button
            onClick={onQuiz}
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'white',
              fontWeight: '600'
            }}
            title="Gestionar preguntas"
          >
            ⚡ Preguntas
          </button>
        )}
        <button
          onClick={onPreview}
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            color: 'white',
            fontWeight: '600'
          }}
        >
          👁️ Ver
        </button>
        <button
          onClick={onEdit}
          style={{
            padding: '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ✏️ Editar
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '6px 12px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#dc2626',
            fontWeight: '600'
          }}
          title="Eliminar lección"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function DroppableModuleLessons({ moduleId, children }: { moduleId: number; children: React.ReactNode }) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `module-${moduleId}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
        transition: 'all 0.2s',
        borderRadius: '8px',
        border: isOver ? '2px dashed #667eea' : '2px dashed transparent',
        position: 'relative',
      }}
    >
      {isOver && active && (
        <div
          style={{
            padding: '12px 16px',
            margin: '8px 16px',
            background: 'rgba(102, 126, 234, 0.15)',
            border: '2px dashed #667eea',
            borderRadius: '8px',
            color: '#667eea',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          📋 Soltar aquí para mover la lección a este módulo
        </div>
      )}
      {children}
    </div>
  );
}

function CourseConfigForm({ course, onUpdate }: { course: Course | null; onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    thumbnail: course?.thumbnail || '',
    price_vivo: course?.price_vivo || 0,
    price_vivo_old: (course as any)?.price_vivo_old || null,
    price_vivo_usd: (course as any)?.price_vivo_usd || 0,
    price_vivo_usd_old: (course as any)?.price_vivo_usd_old || null,
    price_grabado: course?.price_grabado || 0,
    price_grabado_old: (course as any)?.price_grabado_old || null,
    price_grabado_usd: (course as any)?.price_grabado_usd || 0,
    price_grabado_usd_old: (course as any)?.price_grabado_usd_old || null,
    is_active: course?.is_active || false,
    has_live_mode: Boolean((course as any)?.has_live_mode),
    has_recorded_mode: Boolean((course as any)?.has_recorded_mode),
    live_start_date: (course as any)?.live_start_date || '',
    live_schedule: (course as any)?.live_schedule || '',
    recorded_features: (course as any)?.recorded_features || {
      duration_hours: 0,
      duration: '',
      modules: '',
      recordings: 'Acceso a grabaciones',
      certificate: 'Certificado digital',
      support: 'Soporte del instructor'
    },
    learning_outcomes: (course as any)?.learning_outcomes || ['', '', '', '', '', '', '', ''],
    module_titles: (course as any)?.module_titles || (course?.modules?.map((m: any) => m.title) || []),
    module_descriptions: (course as any)?.module_descriptions || (course?.modules?.map((m: any) => m.description || '') || [])
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dateDisplay, setDateDisplay] = useState('');
  const [priceVivoUsdEdited, setPriceVivoUsdEdited] = useState(false);
  const [priceVivoUsdOldEdited, setPriceVivoUsdOldEdited] = useState(false);
  const [priceGrabadoUsdEdited, setPriceGrabadoUsdEdited] = useState(false);
  const [priceGrabadoUsdOldEdited, setPriceGrabadoUsdOldEdited] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(3.80);

  useEffect(() => {
    fetch('/api/public/settings/exchange-rate')
      .then(res => res.json())
      .then(data => {
        if (data.exchangeRate) {
          setExchangeRate(data.exchangeRate);
        }
      })
      .catch(err => console.error('Error fetching exchange rate:', err));
  }, []);

  useEffect(() => {
    if (course) {
      const moduleTitles = ((course as any).module_titles && (course as any).module_titles.length > 0)
        ? (course as any).module_titles
        : (course.modules?.map((m: any) => m.title) || []);
      const moduleDescriptions = ((course as any).module_descriptions && (course as any).module_descriptions.length > 0)
        ? (course as any).module_descriptions
        : (course.modules?.map((m: any) => m.description || '') || []);
      console.log('📚 Course modules:', course.modules);
      console.log('📋 Module titles:', moduleTitles);
      console.log('📝 Module descriptions:', moduleDescriptions);

      const liveStartDate = (course as any).live_start_date;
      const formattedDate = liveStartDate
        ? (liveStartDate instanceof Date
            ? liveStartDate.toISOString().split('T')[0]
            : typeof liveStartDate === 'string'
              ? liveStartDate.split('T')[0]
              : '')
        : '';

      if (formattedDate) {
        const [year, month, day] = formattedDate.split('-');
        setDateDisplay(`${day}/${month}/${year}`);
      } else {
        setDateDisplay('');
      }

      const priceVivoUsdValue = (course as any).price_vivo_usd ||
        (course.price_vivo ? Math.round((course.price_vivo / exchangeRate) * 100) / 100 : 0);
      const priceVivoUsdOldValue = (course as any).price_vivo_usd_old ||
        ((course as any).price_vivo_old ? Math.round(((course as any).price_vivo_old / exchangeRate) * 100) / 100 : null);
      const priceGrabadoUsdValue = (course as any).price_grabado_usd ||
        (course.price_grabado ? Math.round((course.price_grabado / exchangeRate) * 100) / 100 : 0);
      const priceGrabadoUsdOldValue = (course as any).price_grabado_usd_old ||
        ((course as any).price_grabado_old ? Math.round(((course as any).price_grabado_old / exchangeRate) * 100) / 100 : null);

      setFormData({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail || '',
        price_vivo: course.price_vivo,
        price_vivo_old: (course as any).price_vivo_old || null,
        price_vivo_usd: priceVivoUsdValue,
        price_vivo_usd_old: priceVivoUsdOldValue,
        price_grabado: course.price_grabado,
        price_grabado_old: (course as any).price_grabado_old || null,
        price_grabado_usd: priceGrabadoUsdValue,
        price_grabado_usd_old: priceGrabadoUsdOldValue,
        is_active: course.is_active,
        has_live_mode: Boolean((course as any).has_live_mode),
        has_recorded_mode: Boolean((course as any).has_recorded_mode),
        live_start_date: formattedDate,
        live_schedule: (course as any).live_schedule || '',
        recorded_features: (course as any).recorded_features || {
          duration_hours: 0,
          duration: '',
          modules: '',
          recordings: 'Acceso a grabaciones',
          certificate: 'Certificado digital',
          support: 'Soporte del instructor'
        },
        learning_outcomes: (course as any).learning_outcomes || ['', '', '', '', '', '', '', ''],
        module_titles: moduleTitles,
        module_descriptions: moduleDescriptions
      });

      setPriceVivoUsdEdited(Boolean((course as any).price_vivo_usd));
      setPriceVivoUsdOldEdited(Boolean((course as any).price_vivo_usd_old));
      setPriceGrabadoUsdEdited(Boolean((course as any).price_grabado_usd));
      setPriceGrabadoUsdOldEdited(Boolean((course as any).price_grabado_usd_old));
    }
  }, [course, exchangeRate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, thumbnail: data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    // Validación: Si el curso está publicado, debe tener al menos una modalidad habilitada
    if (course.publication_status === 'published' && !formData.has_live_mode && !formData.has_recorded_mode) {
      setErrorMessage('⚠️ Un curso publicado debe tener al menos una modalidad habilitada (En Vivo o Grabado)');
      setShowErrorModal(true);
      return;
    }

    const modulesCount = course?.modules?.length || 0;
    const dataToSend = {
      ...formData,
      price_vivo_usd: priceVivoUsdEdited ? formData.price_vivo_usd : null,
      price_vivo_usd_old: priceVivoUsdOldEdited ? formData.price_vivo_usd_old : null,
      price_grabado_usd: priceGrabadoUsdEdited ? formData.price_grabado_usd : null,
      price_grabado_usd_old: priceGrabadoUsdOldEdited ? formData.price_grabado_usd_old : null,
      recorded_features: {
        ...formData.recorded_features,
        modules: `${modulesCount} módulos especializados`
      }
    };

    setSaving(true);
    try {
      const response = await fetch(`/api/instructor/course/${course.slug}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setShowSuccessModal(true);
        onUpdate();
      } else {
        setErrorMessage('Error al actualizar el curso');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setErrorMessage('Error al actualizar el curso');
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  if (!course) return null;

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '1.5rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📝 Información General
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Título del curso
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Imagen del curso
        </label>
        {formData.thumbnail && (
          <div style={{ marginBottom: '12px' }}>
            <Image
              src={formData.thumbnail}
              alt="Preview"
              width={200}
              height={120}
              style={{
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          style={{
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        {uploadingImage && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Subiendo imagen...</p>}
      </div>

      {formData.has_live_mode && (
        <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            💰 Precios Modalidad En Vivo
          </h4>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
              <input
                type="checkbox"
                checked={formData.price_vivo_old !== null && formData.price_vivo_old > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, price_vivo_old: prev.price_vivo * 1.5, price_vivo_usd_old: prev.price_vivo_usd * 1.5 }));
                  } else {
                    setFormData(prev => ({ ...prev, price_vivo_old: null, price_vivo_usd_old: null }));
                  }
                }}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>🎯 Este curso está en oferta</span>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                {formData.price_vivo_old ? 'Precio Oferta (S/)' : 'Precio (S/)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_vivo}
                onChange={(e) => {
                  const pen = parseFloat(e.target.value) || 0;
                  const usd = Math.round((pen / exchangeRate) * 100) / 100;
                  setPriceVivoUsdEdited(false);
                  setFormData(prev => ({ ...prev, price_vivo: pen, price_vivo_usd: usd }));
                }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                {formData.price_vivo_old ? 'Precio Oferta (USD)' : 'Precio (USD)'}
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}> - editable</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_vivo_usd}
                onChange={(e) => {
                  setPriceVivoUsdEdited(true);
                  setFormData(prev => ({ ...prev, price_vivo_usd: parseFloat(e.target.value) || 0 }));
                }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {formData.price_vivo_old !== null && formData.price_vivo_old > 0 && (
            <div style={{ padding: '12px', background: '#fff3cd', borderRadius: '6px', border: '1px solid #ffc107' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#856404', marginBottom: '8px' }}>📌 Precio Normal (será mostrado tachado)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#856404', marginBottom: '6px' }}>Precio Normal (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_vivo_old || 0}
                    onChange={(e) => {
                      const pen = parseFloat(e.target.value) || 0;
                      const usd = Math.round((pen / exchangeRate) * 100) / 100;
                      setPriceVivoUsdOldEdited(false);
                      setFormData(prev => ({ ...prev, price_vivo_old: pen, price_vivo_usd_old: usd }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ffc107', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#856404', marginBottom: '6px' }}>Precio Normal (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_vivo_usd_old || 0}
                    onChange={(e) => {
                      setPriceVivoUsdOldEdited(true);
                      setFormData(prev => ({ ...prev, price_vivo_usd_old: parseFloat(e.target.value) || 0 }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ffc107', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {formData.has_recorded_mode && (
        <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            💰 Precios Modalidad Grabado
          </h4>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
              <input
                type="checkbox"
                checked={formData.price_grabado_old !== null && formData.price_grabado_old > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, price_grabado_old: prev.price_grabado * 1.5, price_grabado_usd_old: prev.price_grabado_usd * 1.5 }));
                  } else {
                    setFormData(prev => ({ ...prev, price_grabado_old: null, price_grabado_usd_old: null }));
                  }
                }}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>🎯 Este curso está en oferta</span>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                {formData.price_grabado_old ? 'Precio Oferta (S/)' : 'Precio (S/)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_grabado}
                onChange={(e) => {
                  const pen = parseFloat(e.target.value) || 0;
                  const usd = Math.round((pen / exchangeRate) * 100) / 100;
                  setPriceGrabadoUsdEdited(false);
                  setFormData(prev => ({ ...prev, price_grabado: pen, price_grabado_usd: usd }));
                }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                {formData.price_grabado_old ? 'Precio Oferta (USD)' : 'Precio (USD)'}
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}> - editable</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_grabado_usd}
                onChange={(e) => {
                  setPriceGrabadoUsdEdited(true);
                  setFormData(prev => ({ ...prev, price_grabado_usd: parseFloat(e.target.value) || 0 }));
                }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {formData.price_grabado_old !== null && formData.price_grabado_old > 0 && (
            <div style={{ padding: '12px', background: '#fff3cd', borderRadius: '6px', border: '1px solid #ffc107' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#856404', marginBottom: '8px' }}>📌 Precio Normal (será mostrado tachado)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#856404', marginBottom: '6px' }}>Precio Normal (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_grabado_old || 0}
                    onChange={(e) => {
                      const pen = parseFloat(e.target.value) || 0;
                      const usd = Math.round((pen / exchangeRate) * 100) / 100;
                      setPriceGrabadoUsdOldEdited(false);
                      setFormData(prev => ({ ...prev, price_grabado_old: pen, price_grabado_usd_old: usd }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ffc107', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#856404', marginBottom: '6px' }}>Precio Normal (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_grabado_usd_old || 0}
                    onChange={(e) => {
                      setPriceGrabadoUsdOldEdited(true);
                      setFormData(prev => ({ ...prev, price_grabado_usd_old: parseFloat(e.target.value) || 0 }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ffc107', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '24px'
      }}>
        📅 Modalidad En Vivo
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
          Modalidades Disponibles
        </h4>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.has_live_mode}
              onChange={(e) => setFormData(prev => ({ ...prev, has_live_mode: e.target.checked }))}
              style={{ width: '16px', height: '16px' }}
            />
            Habilitar modalidad en vivo
          </label>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginLeft: '24px' }}>
            El curso estará disponible con clases en vivo programadas
          </p>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.has_recorded_mode}
              onChange={(e) => setFormData(prev => ({ ...prev, has_recorded_mode: e.target.checked }))}
              style={{ width: '16px', height: '16px' }}
            />
            Habilitar modalidad grabado
          </label>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginLeft: '24px' }}>
            El curso estará disponible con acceso inmediato a contenido grabado
          </p>
        </div>
      </div>

      {formData.has_live_mode && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Fecha de inicio *
            </label>
            <div style={{ position: 'relative', width: 'fit-content' }}>
              <input
                type="text"
                value={dateDisplay}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                  }
                  if (value.length >= 5) {
                    value = value.slice(0, 5) + '/' + value.slice(5);
                  }
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }
                  setDateDisplay(value);

                  const parts = value.split('/');
                  if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                    const [day, month, year] = parts;
                    const dayNum = parseInt(day);
                    const monthNum = parseInt(month);
                    if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12) {
                      setFormData(prev => ({ ...prev, live_start_date: `${year}-${month}-${day}` }));
                    }
                  }
                }}
                onClick={() => {
                  const dateInput = document.getElementById('hidden-date-input') as HTMLInputElement;
                  dateInput?.showPicker?.();
                }}
                placeholder="DD/MM/YYYY"
                required={formData.has_live_mode}
                readOnly={false}
                style={{
                  width: '140px',
                  padding: '10px 36px 10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                fontSize: '16px',
                color: '#6b7280'
              }}>
                📅
              </span>
              <input
                id="hidden-date-input"
                type="date"
                value={formData.live_start_date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, live_start_date: e.target.value }));
                  if (e.target.value) {
                    const [year, month, day] = e.target.value.split('-');
                    setDateDisplay(`${day}/${month}/${year}`);
                  }
                }}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0,
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Horario (ej: Lunes y Miércoles 7pm - 9pm) *
            </label>
            <input
              type="text"
              value={formData.live_schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, live_schedule: e.target.value }))}
              placeholder="Lunes y Miércoles 7pm - 9pm"
              required={formData.has_live_mode}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </>
      )}



      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Módulos especializados
        </label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
          Títulos y descripciones cargados automáticamente del aula virtual (editables)
        </p>
        {(formData.module_titles || []).map((moduleTitle: string, index: number) => (
          <div key={index} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
              Módulo {index + 1} - Título
            </label>
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => {
                const newTitles = [...(formData.module_titles || [])];
                newTitles[index] = e.target.value;
                setFormData(prev => ({ ...prev, module_titles: newTitles }));
              }}
              placeholder={`Título del Módulo ${index + 1}`}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                boxSizing: 'border-box',
                marginBottom: '8px'
              }}
            />
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
              Descripción
            </label>
            <textarea
              value={(formData.module_descriptions || [])[index] || ''}
              onChange={(e) => {
                const newDescriptions = [...(formData.module_descriptions || [])];
                newDescriptions[index] = e.target.value;
                setFormData(prev => ({ ...prev, module_descriptions: newDescriptions }));
              }}
              placeholder={`Descripción del módulo ${index + 1}`}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        ))}
        {(!formData.module_titles || formData.module_titles.length === 0) && (
          <p style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
            No hay módulos creados aún. Crea módulos en la pestaña "Contenido".
          </p>
        )}
      </div>

      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px'
      }}>
        🎥 Este curso incluye:
      </h3>

      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
        Estos bullets aparecerán en la página de venta del curso grabado
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Horas de contenido
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.recorded_features.duration_hours || ''}
            onChange={(e) => {
              const hours = parseFloat(e.target.value) || 0;
              setFormData(prev => ({
                ...prev,
                recorded_features: {
                  ...prev.recorded_features,
                  duration_hours: hours,
                  duration: hours > 0 ? `${hours}h de contenido` : ''
                }
              }));
            }}
            placeholder="4"
            style={{
              width: '100px',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            horas → {formData.recorded_features.duration || 'Ejemplo: "4h de contenido"'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Módulos especializados
        </label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
          Calculado automáticamente del aula virtual (editable)
        </p>
        <input
          type="text"
          value={formData.recorded_features.modules || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            recorded_features: { ...prev.recorded_features, modules: e.target.value }
          }))}
          placeholder={`${course?.modules?.length || 0} módulos especializados`}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Grabaciones
        </label>
        <input
          type="text"
          value={formData.recorded_features.recordings}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            recorded_features: { ...prev.recorded_features, recordings: e.target.value }
          }))}
          placeholder="Acceso a grabaciones"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Certificado
        </label>
        <input
          type="text"
          value={formData.recorded_features.certificate}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            recorded_features: { ...prev.recorded_features, certificate: e.target.value }
          }))}
          placeholder="Certificado digital"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          ✓ Soporte
        </label>
        <input
          type="text"
          value={formData.recorded_features.support}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            recorded_features: { ...prev.recorded_features, support: e.target.value }
          }))}
          placeholder="Soporte del instructor"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '24px'
      }}>
        ⚡ LO QUE DOMINARÁS
      </h3>

      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
        Estos bullets aparecerán en la página del curso (/cursos/[slug])
      </p>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <div key={index} style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            ✓ Logro {index + 1}
          </label>
          <input
            type="text"
            value={(formData.learning_outcomes && formData.learning_outcomes[index]) || ''}
            onChange={(e) => {
              const newOutcomes = formData.learning_outcomes ? [...formData.learning_outcomes] : ['', '', '', '', '', '', '', ''];
              newOutcomes[index] = e.target.value;
              setFormData(prev => ({ ...prev, learning_outcomes: newOutcomes }));
            }}
            placeholder={index === 0 ? "Ej: Metodología SmartPrompt Framework" : `Logro de aprendizaje ${index + 1}`}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        style={{
          padding: '10px 20px',
          background: saving ? '#9ca3af' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: saving ? 'not-allowed' : 'pointer'
        }}
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
              Curso actualizado correctamente
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Los cambios se han guardado exitosamente
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✕</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
              Error al actualizar
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default function InstructorCourseEditPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('contenido');
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [moduleModal, setModuleModal] = useState<{ open: boolean; module?: Module | null }>({ open: false });
  const [lessonModal, setLessonModal] = useState<{ open: boolean; moduleId?: number; lesson?: Lesson | null }>({ open: false });
  const [quizModal, setQuizModal] = useState<{ open: boolean; lesson?: Lesson | null }>({ open: false });
  const [previewModal, setPreviewModal] = useState<{ open: boolean; lesson?: Lesson | null }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [renewContentModal, setRenewContentModal] = useState(false);
  const [renewConfirmText, setRenewConfirmText] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteCertDefaultJson, setSiteCertDefaultJson] = useState<string | null>(null);
  const [certCustomEnabled, setCertCustomEnabled] = useState(false);
  const [certTemplateDraft, setCertTemplateDraft] = useState<CertificateTemplate>(DEFAULT_CERTIFICATE_TEMPLATE);
  const [savingCertTemplate, setSavingCertTemplate] = useState(false);

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    loadCourse();
    loadUser();
  }, [slug]);

  useEffect(() => {
    if (activeTab === 'configuracion' || activeTab === 'certificado') {
      loadCourse();
    }
    if (activeTab === 'certificado' && siteCertDefaultJson === null) {
      fetch('/api/public/settings')
        .then((res) => res.json())
        .then((data) => setSiteCertDefaultJson(data.settings?.certificate_template_default || null))
        .catch((error) => console.error('Error loading site certificate default:', error));
    }
  }, [activeTab]);

  useEffect(() => {
    if (!course) return;
    setCertCustomEnabled(!!course.certificate_template);
    setCertTemplateDraft(
      course.certificate_template
        ? resolveCertificateTemplate(siteCertDefaultJson, course.certificate_template)
        : resolveCertificateTemplate(siteCertDefaultJson, null)
    );
  }, [course?.certificate_template, siteCertDefaultJson]);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠', onClick: () => setActiveTab('contenido') },
    { id: 'contenido', label: 'Contenido', icon: '📚', onClick: () => setActiveTab('contenido') },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥', onClick: () => setActiveTab('estudiantes') },
    { id: 'calificaciones-estudiantes', label: 'Calificaciones', icon: '📊', href: `/dashboard/curso/${slug}/calificaciones-estudiantes` },
    { id: 'calificaciones-quizzes', label: 'Quizzes', icon: '📝', href: `/dashboard/curso/${slug}/calificaciones-quizzes` },
    { id: 'calificaciones-tareas', label: 'Tareas', icon: '📋', href: `/dashboard/curso/${slug}/calificaciones-tareas` },
    { id: 'certificado', label: 'Certificado', icon: '🎓', onClick: () => setActiveTab('certificado') },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️', onClick: () => setActiveTab('configuracion') },
  ];

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/instructor/course/${slug}`);
      if (!response.ok) {
        router.push('/dashboard');
        return;
      }
      const data = await response.json();
      setCourse(data.course);
      setExpandedModules(data.course.modules?.map((m: Module) => m.id) || []);
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCertTemplate = async () => {
    setSavingCertTemplate(true);
    try {
      const newValue = certCustomEnabled ? JSON.stringify(certTemplateDraft) : null;
      const response = await fetch(`/api/instructor/course/${slug}/config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_template: newValue })
      });
      if (response.ok) {
        setCourse(prev => prev ? { ...prev, certificate_template: newValue } : null);
        showModal('success', 'Diseño de certificado guardado');
      } else {
        showModal('error', 'Error al guardar el diseño del certificado');
      }
    } catch (error) {
      console.error('Error saving certificate template:', error);
      showModal('error', 'Error al guardar el diseño del certificado');
    } finally {
      setSavingCertTemplate(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSaveModule = async (data: { title: string; description: string }) => {
    if (!course) return;
    setSaving(true);
    try {
      if (moduleModal.module) {
        const response = await fetch(`/api/instructor/modules/${moduleModal.module.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al actualizar');
      } else {
        const response = await fetch('/api/instructor/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, course_id: course.id })
        });
        if (!response.ok) throw new Error('Error al crear');
      }
      await loadCourse();
      setModuleModal({ open: false });
    } catch (error) {
      showModal('error', 'Error al guardar módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLesson = async (data: any) => {
    setSaving(true);
    try {
      if (lessonModal.lesson) {
        const response = await fetch(`/api/instructor/lessons/${lessonModal.lesson.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al actualizar');
      } else {
        const response = await fetch('/api/instructor/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, module_id: lessonModal.moduleId })
        });
        if (!response.ok) throw new Error('Error al crear');
      }
      await loadCourse();
      setLessonModal({ open: false });
    } catch (error) {
      showModal('error', 'Error al guardar lección');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return;
    try {
      const response = await fetch(`/api/instructor/modules/${moduleId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      await loadCourse();
    } catch (error) {
      showModal('error', 'Error al eliminar módulo');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    try {
      const response = await fetch(`/api/instructor/lessons/${lessonId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      await loadCourse();
    } catch (error) {
      showModal('error', 'Error al eliminar lección');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id.toString();
    const activeLessonId = parseInt(activeId.replace('lesson-', ''));

    for (const module of course?.modules || []) {
      const lesson = module.lessons?.find(l => l.id === activeLessonId);
      if (lesson) {
        setActiveLesson(lesson);
        break;
      }
    }
  };

  const handleLessonDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLesson(null);
    if (!over || active.id === over.id || !course) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeLessonId = parseInt(activeId.replace('lesson-', ''));
    const overLessonId = parseInt(overId.replace('lesson-', '').replace('module-', ''));

    let sourceModuleId: number | null = null;
    let targetModuleId: number | null = null;
    let sourceLesson: Lesson | null = null;

    for (const module of course.modules) {
      const lessonIndex = module.lessons?.findIndex(l => l.id === activeLessonId);
      if (lessonIndex !== undefined && lessonIndex !== -1) {
        sourceModuleId = module.id;
        sourceLesson = module.lessons![lessonIndex];
        break;
      }
    }

    if (!sourceModuleId || !sourceLesson) return;

    if (overId.startsWith('module-')) {
      targetModuleId = parseInt(overId.replace('module-', ''));
    } else {
      for (const module of course.modules) {
        const lessonIndex = module.lessons?.findIndex(l => l.id === overLessonId);
        if (lessonIndex !== undefined && lessonIndex !== -1) {
          targetModuleId = module.id;
          break;
        }
      }
    }

    if (!targetModuleId) return;

    if (sourceModuleId === targetModuleId) {
      const module = course.modules.find(m => m.id === sourceModuleId);
      if (!module?.lessons) return;

      const lessons = [...module.lessons];
      const oldIndex = lessons.findIndex(l => l.id === activeLessonId);
      const newIndex = lessons.findIndex(l => l.id === overLessonId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);

      setCourse(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map(m =>
            m.id === sourceModuleId
              ? { ...m, lessons: reorderedLessons }
              : m
          )
        };
      });

      try {
        const lessonIds = reorderedLessons.map(l => l.id);
        const response = await fetch('/api/instructor/lessons/reorder', {
          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonIds })
      });
        if (!response.ok) throw new Error('Error al reordenar');
      } catch (error) {
        showModal('error', 'Error al reordenar lecciones');
        await loadCourse();
      }
    } else {
      const targetModule = course.modules.find(m => m.id === targetModuleId);
      const targetLessons = targetModule?.lessons || [];

      let insertIndex = targetLessons.length;
      if (!overId.startsWith('module-')) {
        insertIndex = targetLessons.findIndex(l => l.id === overLessonId);
        if (insertIndex === -1) insertIndex = targetLessons.length;
      }

      setCourse(prev => {
        if (!prev) return prev;

        const sourceModule = prev.modules.find(m => m.id === sourceModuleId);
        const updatedSourceLessons = sourceModule?.lessons?.filter(l => l.id !== activeLessonId) || [];

        const targetModule = prev.modules.find(m => m.id === targetModuleId);
        const updatedTargetLessons = [...(targetModule?.lessons || [])];
        updatedTargetLessons.splice(insertIndex, 0, { ...sourceLesson, module_id: targetModuleId });

        return {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === sourceModuleId) {
              return { ...m, lessons: updatedSourceLessons };
            }
            if (m.id === targetModuleId) {
              return { ...m, lessons: updatedTargetLessons };
            }
            return m;
          })
        };
      });

      try {
        const updateResponse = await fetch(`/api/instructor/lessons/${activeLessonId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module_id: targetModuleId })
        });

        if (!updateResponse.ok) throw new Error('Error al mover lección');

        const targetModule = course.modules.find(m => m.id === targetModuleId);
        const updatedTargetLessons = [...(targetModule?.lessons || [])];
        updatedTargetLessons.splice(insertIndex, 0, sourceLesson);
        const lessonIds = updatedTargetLessons.map(l => l.id);

        await fetch('/api/instructor/lessons/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonIds })
        });

        await loadCourse();
      } catch (error) {
        showModal('error', 'Error al mover lección entre módulos');
        await loadCourse();
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function EstudiantesSection({ courseSlug }: { courseSlug: string }) {
    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentModality, setNewStudentModality] = useState('grabado');
    const [saving, setSaving] = useState(false);
    const [issuingCertId, setIssuingCertId] = useState<number | null>(null);

    useEffect(() => {
      fetchStudents();
    }, [courseSlug]);

    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/instructor/course/${courseSlug}/students`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    const handleAddStudent = async () => {
      if (!newStudentEmail.trim()) {
        alert('Por favor ingresa un email');
        return;
      }

      setSaving(true);
      try {
        const res = await fetch(`/api/instructor/course/${courseSlug}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: newStudentEmail,
            modality: newStudentModality
          })
        });

        if (res.ok) {
          alert('✓ Estudiante agregado exitosamente');
          setShowAddModal(false);
          setNewStudentEmail('');
          fetchStudents();
        } else {
          const data = await res.json();
          alert(data.error || 'Error al agregar estudiante');
        }
      } catch (error) {
        alert('Error al agregar estudiante');
      } finally {
        setSaving(false);
      }
    };

    const handleRemoveStudent = async (studentId: number, studentName: string) => {
      if (!confirm(`¿Estás seguro de eliminar a ${studentName} del curso?`)) {
        return;
      }

      try {
        const res = await fetch(`/api/instructor/course/${courseSlug}/students`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: studentId })
        });

        if (res.ok) {
          alert('✓ Estudiante eliminado exitosamente');
          fetchStudents();
        } else {
          const data = await res.json();
          alert(data.error || 'Error al eliminar estudiante');
        }
      } catch (error) {
        alert('Error al eliminar estudiante');
      }
    };

    const handleIssueCertificate = async (studentId: number, studentName: string) => {
      if (!confirm(`¿Emitir certificado a ${studentName} sin pasar por el quiz?\n\nEsto queda registrado como emisión manual del instructor.`)) {
        return;
      }

      setIssuingCertId(studentId);
      try {
        const res = await fetch(`/api/instructor/course/${courseSlug}/students/${studentId}/issue-certificate`, {
          method: 'POST'
        });
        const data = await res.json();

        if (res.ok) {
          if (!data.already_exists) {
            alert('🎓 Certificado emitido exitosamente');
          }
          fetchStudents();
        } else {
          alert(data.error || 'Error al emitir el certificado');
        }
      } catch (error) {
        alert('Error al emitir el certificado');
      } finally {
        setIssuingCertId(null);
      }
    };

    if (loadingStudents) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando estudiantes...</p>
        </div>
      );
    }

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            👥 Estudiantes del Curso
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>+</span> Nuevo Estudiante
          </button>
        </div>

        {students.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              No hay estudiantes inscritos
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Haz click en "Nuevo Estudiante" para agregar tu primer estudiante
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Nombre
                  </th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Email
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Modalidad
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Progreso
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Fecha Inscripción
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>
                      {student.name}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {student.email}
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        backgroundColor: student.modality === 'vivo' ? '#dbeafe' : '#f3f4f6',
                        color: student.modality === 'vivo' ? '#1e40af' : '#6b7280',
                        fontWeight: '600',
                        fontSize: '0.75rem'
                      }}>
                        {student.modality === 'vivo' ? 'En Vivo' : 'Grabado'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '60px',
                          height: '6px',
                          background: '#e5e7eb',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${student.progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#667eea' }}>
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(student.enrolled_at).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem' }}>
                      {course?.is_certification_enabled && (
                        <button
                          onClick={() => handleIssueCertificate(student.id, student.name)}
                          disabled={issuingCertId === student.id}
                          title="Emitir certificado manualmente, sin pasar por el quiz"
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: issuingCertId === student.id ? '#9ca3af' : '#0f766e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: issuingCertId === student.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginRight: '0.5rem'
                          }}
                        >
                          {issuingCertId === student.id ? 'Emitiendo...' : '🎓 Emitir certificado'}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveStudent(student.id, student.name)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showAddModal && (
          <div
            onClick={() => setShowAddModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%',
                padding: '2rem'
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                Agregar Nuevo Estudiante
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Email del Estudiante
                </label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="estudiante@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Modalidad
                </label>
                <select
                  value={newStudentModality}
                  onChange={(e) => setNewStudentModality(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="grabado">Grabado</option>
                  <option value="vivo">En Vivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddStudent}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: saving ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Agregando...' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn { display: flex !important; }
          .main-content { margin-left: 0 !important; }
        }
        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none !important; }
          .main-content { margin-left: 280px !important; }
        }
      `}</style>

      <UnifiedSidebar
        menuItems={sidebarMenuItems}
        activeItem={activeTab}
        currentUser={user}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        title={course.title}
        subtitle={course.publication_status === 'published' ? 'Publicado' : 'Borrador'}
        showLegacyLink={false}
      />

      <button
        onClick={() => setMobileMenuOpen(true)}
        className="mobile-menu-btn"
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.75rem',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>


      <main className="main-content" style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
        {activeTab === 'contenido' && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a202c',
                    margin: '0 0 8px 0'
                  }}>
                    Módulos y Lecciones
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {course.modules?.length || 0} módulos, {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0} lecciones
                  </p>
                </div>
                <button
                  onClick={() => setModuleModal({ open: true, module: null })}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Nuevo Módulo
                </button>
              </div>
            </div>

            {course.modules && course.modules.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleLessonDragEnd}
              >
                <SortableContext
                  items={course.modules.flatMap(m => m.lessons?.map(l => `lesson-${l.id}`) || [])}
                  strategy={verticalListSortingStrategy}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {course.modules.map((module, idx) => (
                      <div
                        key={module.id}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                          overflow: 'hidden'
                        }}
                      >
                    <div
                      onClick={() => toggleModule(module.id)}
                      className="module-header"
                      style={{
                        padding: '20px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: expandedModules.includes(module.id) ? '#f9fafb' : 'white'
                      }}
                    >
                      <style>{`
                        @media (max-width: 768px) {
                          .module-header {
                            align-items: flex-start !important;
                          }
                          .module-header-content {
                            flex: 1 !important;
                          }
                          .module-header-actions {
                            margin-top: 20px;
                          }
                        }
                      `}</style>
                      <div style={{
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
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <div className="module-header-content" style={{ flex: 1 }}>
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
                      <div className="module-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModuleModal({ open: true, module });
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <span style={{
                          fontSize: '20px',
                          color: '#6b7280',
                          transition: 'transform 0.2s',
                          transform: expandedModules.includes(module.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                          display: 'inline-block'
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {expandedModules.includes(module.id) && (
                      <DroppableModuleLessons moduleId={module.id}>
                        <div style={{
                          borderTop: '1px solid #e5e7eb',
                          padding: '16px 24px',
                          background: '#fafafa'
                        }}>
                          {module.lessons && module.lessons.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {module.lessons.map((lesson, lessonIdx) => (
                                <SortableLesson
                                  key={lesson.id}
                                  lesson={lesson}
                                  lessonIdx={lessonIdx}
                                  onQuiz={() => setQuizModal({ open: true, lesson })}
                                  onPreview={() => setPreviewModal({ open: true, lesson })}
                                  onEdit={() => setLessonModal({ open: true, moduleId: module.id, lesson })}
                                  onDelete={() => handleDeleteLesson(lesson.id)}
                                />
                              ))}
                            </div>
                        ) : (
                          <div style={{
                            padding: '32px',
                            textAlign: 'center',
                            color: '#6b7280'
                          }}>
                            <p style={{ margin: '0 0 16px 0' }}>No hay lecciones en este módulo</p>
                            <button
                              onClick={() => setLessonModal({ open: true, moduleId: module.id, lesson: null })}
                              style={{
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              + Agregar Lección
                            </button>
                          </div>
                        )}
                        <div style={{ marginTop: '12px' }}>
                          <button
                            onClick={() => setLessonModal({ open: true, moduleId: module.id, lesson: null })}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              color: '#667eea'
                            }}
                          >
                            + Agregar Lección
                          </button>
                        </div>
                        </div>
                      </DroppableModuleLessons>
                    )}
                  </div>
                ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeLesson && (
                  <div
                    style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #667eea',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      cursor: 'grabbing',
                      opacity: 0.9,
                      minWidth: '300px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                        }}
                      >
                        📄
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                          {activeLesson.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {activeLesson.content_type === 'video' && '🎥 Video'}
                          {activeLesson.content_type === 'document' && '📄 Documento'}
                          {activeLesson.content_type === 'markdown' && '📝 Texto'}
                          {activeLesson.content_type === 'quiz' && '✅ Quiz'}
                          {activeLesson.content_type === 'assignment' && '📝 Tarea'}
                          {activeLesson.content_type === 'material' && '📎 Material Adjunto'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '64px 32px',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px'
                }}>
                  📚
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px'
                }}>
                  No hay módulos creados
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px'
                }}>
                  Comienza agregando el primer módulo de tu curso
                </p>
                <button
                  onClick={() => setModuleModal({ open: true, module: null })}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Crear Primer Módulo
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'configuracion' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              ⚙️ Configuración del Curso
            </h2>

            <div style={{
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🌐 Estado de Publicación
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Estado del curso en la web
                </label>
                <select
                  value={course?.publication_status || 'unpublished'}
                  onChange={async (e) => {
                    const status = e.target.value as 'published' | 'coming_soon' | 'unpublished';
                    setSaving(true);
                    try {
                      const response = await fetch(`/api/instructor/course/${slug}/config`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ publication_status: status })
                      });
                      if (response.ok) {
                        setCourse(prev => prev ? { ...prev, publication_status: status } : null);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  <option value="unpublished">🔒 Sin publicar - No visible en la web</option>
                  <option value="coming_soon">⏳ Próximamente - Visible sin precios ni inscripción</option>
                  <option value="published">✅ Publicado - Completamente visible con precios</option>
                </select>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  {course?.publication_status === 'published' && '✅ El curso está completamente visible con precios y enlaces de inscripción.'}
                  {course?.publication_status === 'coming_soon' && '⏳ El curso es visible pero sin precios ni enlaces de inscripción.'}
                  {(course?.publication_status === 'unpublished' || !course?.publication_status) && '🔒 El curso no es visible en la web pública. Solo admins e instructores pueden verlo.'}
                </p>
              </div>
            </div>

            {/* Email Templates */}
            <div style={{
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📧 Mensajes de Email Personalizados
              </h3>

              {/* Email de Bienvenida */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email de bienvenida (con credenciales)
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                  Este mensaje se envía a <strong>usuarios nuevos</strong> cuando se inscriben. Variables disponibles: <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{nombre}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{email}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{clave}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{curso}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{modalidad}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{precio}'}</code>
                </p>
                <textarea
                  value={course?.email_confirmation_template || `¡Hola {nombre}!

Bienvenido al curso: {curso}

Tus credenciales de acceso son:

📧 Email: {email}
🔑 Contraseña temporal: {clave}

Por favor, cambia tu contraseña después de iniciar sesión por primera vez.

👉 Accede al aula virtual aquí: https://smartchatix.com/login

Modalidad: {modalidad}
Precio: {precio}

¡Nos vemos en clase!

---
SmartChatix - Transformamos la forma en que las personas trabajan`}
                  onChange={(e) => setCourse(prev => prev ? { ...prev, email_confirmation_template: e.target.value } : null)}
                  onBlur={async (e) => {
                    const value = e.target.value;
                    setSaving(true);
                    try {
                      await fetch(`/api/instructor/course/${slug}/config`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email_confirmation_template: value || null })
                      });
                    } catch (error) {
                      console.error('Error:', error);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  rows={18}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px', fontStyle: 'italic' }}>
                  Si dejas vacío, se usa el mensaje por defecto.
                </p>
              </div>

              {/* Email de Confirmación de Pago */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email de confirmación de pago
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                  Este mensaje se envía a <strong>todos</strong> después del pago exitoso. Variables disponibles: <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{nombre}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{email}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{curso}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{modalidad}'}</code>, <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{'{precio}'}</code>
                </p>
                <textarea
                  value={course?.email_payment_confirmation_template || `¡Pago Confirmado! ✅

Tu pago ha sido procesado exitosamente.

📚 Curso: {curso}
📍 Modalidad: {modalidad}
💰 Monto: {precio}

Ya puedes acceder al aula virtual con tu email: {email}

👉 Ir al aula virtual: https://smartchatix.com/login

Si tienes alguna consulta, no dudes en contactarnos.

¡Nos vemos en clase!

---
SmartChatix - Transformamos la forma en que las personas trabajan`}
                  onChange={(e) => setCourse(prev => prev ? { ...prev, email_payment_confirmation_template: e.target.value } : null)}
                  onBlur={async (e) => {
                    const value = e.target.value;
                    setSaving(true);
                    try {
                      await fetch(`/api/instructor/course/${slug}/config`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email_payment_confirmation_template: value || null })
                      });
                    } catch (error) {
                      console.error('Error:', error);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  rows={16}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px', fontStyle: 'italic' }}>
                  Si dejas vacío, se usa el mensaje por defecto.
                </p>
              </div>
            </div>

            {/* Otras configuraciones (placeholder) */}
            <CourseConfigForm course={course} onUpdate={loadCourse} />

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '2px solid #fca5a5'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#dc2626',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ Zona de Peligro
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#991b1b',
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                Las siguientes acciones son permanentes y no se pueden deshacer.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    console.log('Click en renovar contenido');
                    setRenewContentModal(true);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🔄 Renovar Contenido
                </button>
                <button
                  onClick={() => {
                    console.log('Click en eliminar curso');
                    setDeleteModal(true);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🗑️ Eliminar Curso
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificado' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              🎓 Certificado
            </h2>

            <div style={{
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎓 Sistema de Certificación
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  <input
                    type="checkbox"
                    checked={course?.is_certification_enabled || false}
                    onChange={async (e) => {
                      const enabled = e.target.checked;
                      setSaving(true);
                      try {
                        const response = await fetch(`/api/instructor/course/${slug}/config`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ is_certification_enabled: enabled })
                        });
                        if (response.ok) {
                          setCourse(prev => prev ? { ...prev, is_certification_enabled: enabled } : null);
                        }
                      } catch (error) {
                        console.error('Error:', error);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Habilitar emisión de certificados para este curso</span>
                </label>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '8px',
                  marginLeft: '32px'
                }}>
                  Los estudiantes recibirán un certificado automáticamente al completar todas las lecciones con quizzes y alcanzar el porcentaje mínimo.
                </p>
              </div>

              {course?.is_certification_enabled ? (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Porcentaje mínimo para aprobar (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={course?.passing_score || 75}
                    onChange={async (e) => {
                      const score = parseInt(e.target.value) || 75;
                      setSaving(true);
                      try {
                        const response = await fetch(`/api/instructor/course/${slug}/config`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ passing_score: score })
                        });
                        if (response.ok) {
                          setCourse(prev => prev ? { ...prev, passing_score: score } : null);
                        }
                      } catch (error) {
                        console.error('Error:', error);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    style={{
                      width: '120px',
                      padding: '8px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '8px'
                  }}>
                    Los estudiantes deben obtener al menos este porcentaje en el promedio general de todos los quizzes para recibir el certificado.
                  </p>
                </div>
              ) : null}
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                Diseño del certificado
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '1rem' }}>
                Por defecto este curso usa el diseño general del sitio (definido en Configuración del sitio). Puedes personalizarlo solo para este curso.
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', marginBottom: '1.25rem' }}>
                <input
                  type="checkbox"
                  checked={certCustomEnabled}
                  onChange={(e) => setCertCustomEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Usar un diseño personalizado para este curso
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                <CertificateTemplateForm value={certTemplateDraft} onChange={setCertTemplateDraft} disabled={!certCustomEnabled} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Vista previa</p>
                  <CertificatePreview
                    template={certTemplateDraft}
                    courseTitle={course?.title}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCertTemplate}
                disabled={savingCertTemplate}
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem 1.5rem',
                  background: savingCertTemplate ? '#9ca3af' : '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: savingCertTemplate ? 'not-allowed' : 'pointer'
                }}
              >
                {savingCertTemplate ? 'Guardando...' : 'Guardar diseño'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'estudiantes' && (
          <EstudiantesSection courseSlug={slug} />
        )}
        </div>
      </main>

      {/* Modal Módulo */}
      {moduleModal.open && (
        <ModuleModal
          module={moduleModal.module}
          onClose={() => setModuleModal({ open: false })}
          onSave={handleSaveModule}
          onDelete={moduleModal.module ? () => handleDeleteModule(moduleModal.module!.id) : undefined}
          saving={saving}
        />
      )}

      {/* Modal Lección */}
      {lessonModal.open && (
        <LessonModal
          lesson={lessonModal.lesson}
          course={course}
          moduleId={lessonModal.moduleId}
          onClose={() => setLessonModal({ open: false })}
          onSave={handleSaveLesson}
          onDelete={lessonModal.lesson ? () => handleDeleteLesson(lessonModal.lesson!.id) : undefined}
          saving={saving}
        />
      )}

      {/* Modal Gestión de Preguntas */}
      {(() => {
        console.log('Checking quiz modal render:', { open: quizModal.open, hasLesson: !!quizModal.lesson });
        if (quizModal.open && quizModal.lesson) {
          console.log('Rendering QuizManagementModal');
          return (
            <QuizManagementModal
              lesson={quizModal.lesson}
              onClose={() => {
                setQuizModal({ open: false });
                loadCourse();
              }}
            />
          );
        }
        return null;
      })()}

      {/* Modal Preview de Lección */}
      {previewModal.open && previewModal.lesson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1400px',
            height: '90vh',
            overflow: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1,
              borderRadius: '16px 16px 0 0'
            }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a202c'
                }}>
                  {previewModal.lesson.title}
                </h2>
                {previewModal.lesson.description && (
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {previewModal.lesson.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setPreviewModal({ open: false })}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Video YouTube */}
              {previewModal.lesson.content_type === 'video' && previewModal.lesson.video_url && (
                <div style={{ marginBottom: '24px' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(previewModal.lesson.video_url)}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      borderRadius: '12px'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Video desde servidor */}
              {previewModal.lesson.content_type === 'video' && previewModal.lesson.video_file && !previewModal.lesson.video_url && (
                <div style={{ marginBottom: '24px' }}>
                  <video
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '480px',
                      borderRadius: '12px',
                      backgroundColor: '#000'
                    }}
                  >
                    <source src={previewModal.lesson.video_file} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              )}

              {/* Document */}
              {previewModal.lesson.content_type === 'document' && previewModal.lesson.document_url && (
                <div style={{ marginBottom: '24px' }}>
                  <iframe
                    src={`${previewModal.lesson.document_url}#toolbar=0&navpanes=0&scrollbar=1`}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              )}

              {/* Video Markdown */}
              {previewModal.lesson.main_content && (
                <div style={{
                  marginBottom: '24px',
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px'
                }}>
                  <style dangerouslySetInnerHTML={{__html: `
                    .preview-html-content p {
                      margin-bottom: 1rem;
                      line-height: 1.7;
                    }
                    .preview-html-content h1 {
                      font-size: 2rem;
                      font-weight: 700;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                    }
                    .preview-html-content h2 {
                      font-size: 1.5rem;
                      font-weight: 600;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                    }
                    .preview-html-content h3 {
                      font-size: 1.25rem;
                      font-weight: 600;
                      margin-top: 1.25rem;
                      margin-bottom: 0.5rem;
                    }
                    .preview-html-content ul, .preview-html-content ol {
                      margin-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .preview-html-content li {
                      margin-bottom: 0.5rem;
                    }
                    .preview-html-content img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 8px;
                      margin: 1rem 0;
                      display: block;
                    }
                    .preview-html-content a {
                      color: #667eea;
                      text-decoration: underline;
                    }
                    .preview-html-content strong, .preview-html-content b {
                      font-weight: 700;
                    }
                  `}} />
                  <div
                    className="preview-html-content"
                    dangerouslySetInnerHTML={{ __html: previewModal.lesson.main_content }}
                    style={{
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#374151'
                    }}
                  />
                </div>
              )}

              {/* Markdown Content */}
              {previewModal.lesson.content_type === 'markdown' && (
                <>
                  {previewModal.lesson.markdown_image && (
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                      <img
                        src={previewModal.lesson.markdown_image}
                        alt={previewModal.lesson.title}
                        style={{
                          maxWidth: '100%',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  )}
                  {previewModal.lesson.markdown_video && (
                    <div style={{ marginBottom: '24px' }}>
                      <iframe
                        src={getYouTubeEmbedUrl(previewModal.lesson.markdown_video)}
                        style={{
                          width: '100%',
                          height: '480px',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {previewModal.lesson.markdown_content && (
                    <div style={{
                      padding: '20px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      marginBottom: '24px'
                    }}>
                      <style dangerouslySetInnerHTML={{__html: `
                        .preview-markdown-content p {
                          margin-bottom: 1rem;
                          line-height: 1.8;
                        }
                        .preview-markdown-content h1 {
                          font-size: 2rem;
                          font-weight: 700;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                        }
                        .preview-markdown-content h2 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                        }
                        .preview-markdown-content h3 {
                          font-size: 1.25rem;
                          font-weight: 600;
                          margin-top: 1.25rem;
                          margin-bottom: 0.5rem;
                        }
                        .preview-markdown-content ul, .preview-markdown-content ol {
                          margin-left: 1.5rem;
                          margin-bottom: 1rem;
                        }
                        .preview-markdown-content li {
                          margin-bottom: 0.5rem;
                        }
                        .preview-markdown-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 1rem 0;
                          display: block;
                        }
                        .preview-markdown-content strong, .preview-markdown-content b {
                          font-weight: 700;
                        }
                      `}} />
                      <div
                        className="preview-markdown-content"
                        dangerouslySetInnerHTML={{ __html: previewModal.lesson.markdown_content }}
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.8',
                          color: '#374151'
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Assignment Content */}
              {previewModal.lesson.content_type === 'assignment' && (
                <>
                  {previewModal.lesson.markdown_image && (
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                      <img
                        src={previewModal.lesson.markdown_image}
                        alt={previewModal.lesson.title}
                        style={{
                          maxWidth: '100%',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  )}
                  {previewModal.lesson.markdown_video && (
                    <div style={{ marginBottom: '24px' }}>
                      <iframe
                        src={getYouTubeEmbedUrl(previewModal.lesson.markdown_video)}
                        style={{
                          width: '100%',
                          height: '480px',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {previewModal.lesson.markdown_content && (
                    <div style={{
                      padding: '20px',
                      background: '#fef3c7',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      border: '2px solid #fbbf24'
                    }}>
                      <style dangerouslySetInnerHTML={{__html: `
                        .preview-assignment-content p {
                          margin-bottom: 1rem;
                          line-height: 1.8;
                        }
                        .preview-assignment-content h1 {
                          font-size: 2rem;
                          font-weight: 700;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                        }
                        .preview-assignment-content h2 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                        }
                        .preview-assignment-content h3 {
                          font-size: 1.25rem;
                          font-weight: 600;
                          margin-top: 1.25rem;
                          margin-bottom: 0.5rem;
                        }
                        .preview-assignment-content ul, .preview-assignment-content ol {
                          margin-left: 1.5rem;
                          margin-bottom: 1rem;
                        }
                        .preview-assignment-content li {
                          margin-bottom: 0.5rem;
                        }
                        .preview-assignment-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 1rem 0;
                          display: block;
                        }
                        .preview-assignment-content strong, .preview-assignment-content b {
                          font-weight: 700;
                        }
                      `}} />
                      <div
                        className="preview-assignment-content"
                        dangerouslySetInnerHTML={{ __html: previewModal.lesson.markdown_content }}
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.8',
                          color: '#374151'
                        }}
                      />
                    </div>
                  )}
                  {previewModal.lesson.documents_urls && (() => {
                    const urls = typeof previewModal.lesson.documents_urls === 'string'
                      ? JSON.parse(previewModal.lesson.documents_urls)
                      : previewModal.lesson.documents_urls;
                    return urls && urls.length > 0 && (
                      <div style={{
                        padding: '20px',
                        background: '#f0fdf4',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        border: '2px solid #10b981'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          📎 Archivos Adjuntos
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {urls.map((url: string, index: number) => {
                            const fullFilename = url.split('/').pop() || `Archivo ${index + 1}`;
                            const filename = fullFilename.replace(/^\d+_/, '');
                            return (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '12px',
                                  background: 'white',
                                  borderRadius: '6px',
                                  border: '1px solid #10b981',
                                  textDecoration: 'none',
                                  color: '#047857',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#dcfce7';
                                  e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'white';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                <span style={{ fontSize: '20px' }}>📄</span>
                                <span style={{ flex: 1 }}>{filename}</span>
                                <span style={{ fontSize: '16px' }}>⬇️</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* Material Adjunto Content */}
              {previewModal.lesson.content_type === 'material' && (() => {
                const urls = previewModal.lesson.documents_urls
                  ? (typeof previewModal.lesson.documents_urls === 'string' ? JSON.parse(previewModal.lesson.documents_urls) : previewModal.lesson.documents_urls)
                  : [];
                return (
                  <div style={{
                    padding: '20px',
                    background: '#f0fdf4',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '2px solid #10b981'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📎 Material Descargable
                    </h3>
                    {urls.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {urls.map((url: string, index: number) => {
                          const fullFilename = url.split('/').pop() || `Archivo ${index + 1}`;
                          const filename = fullFilename.replace(/^\d+_/, '');
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #10b981',
                                textDecoration: 'none',
                                color: '#047857',
                                fontWeight: '600',
                                fontSize: '14px'
                              }}
                            >
                              <span style={{ fontSize: '20px' }}>📄</span>
                              <span style={{ flex: 1 }}>{filename}</span>
                              <span style={{ fontSize: '16px' }}>⬇️</span>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Aún no has subido archivos.</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificación */}
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

      {/* Modal Eliminar Curso */}
      {deleteModal && (
        <div
          onClick={() => {
            setDeleteModal(false);
            setDeleteConfirmText('');
            setDeleteError('');
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
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
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}>
              ⚠️
            </div>
            <h3 style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              ¿Estás seguro?
            </h3>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              Esta acción eliminará permanentemente el curso <strong>"{course?.title}"</strong> y todo su contenido (módulos, lecciones, quizzes).
            </p>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Para confirmar, escribe <strong>CONFIRMADO</strong> en el campo de abajo:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => {
                setDeleteConfirmText(e.target.value);
                setDeleteError('');
              }}
              placeholder="Escribe CONFIRMADO"
              style={{
                width: '100%',
                padding: '12px',
                border: deleteError ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: deleteError ? '8px' : '1.5rem',
                textAlign: 'center',
                fontWeight: '600',
                boxSizing: 'border-box'
              }}
            />
            {deleteError && (
              <p style={{
                color: '#ef4444',
                fontSize: '13px',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontWeight: '500'
              }}>
                {deleteError}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmText.trim().toLowerCase() === 'confirmado') {
                    try {
                      const response = await fetch(`/api/instructor/course/${slug}`, {
                        method: 'DELETE'
                      });

                      if (response.ok) {
                        setDeleteModal(false);
                        setDeleteConfirmText('');
                        setDeleteError('');
                        router.push('/dashboard');
                      } else {
                        const data = await response.json();
                        setDeleteError(data.error || 'Error al eliminar el curso');
                      }
                    } catch (error) {
                      setDeleteError('Error al eliminar el curso');
                    }
                  } else {
                    setDeleteError('Debes escribir CONFIRMADO para eliminar el curso');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Eliminar Curso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Renovar Contenido */}
      {renewContentModal && (
        <div
          onClick={() => {
            setRenewContentModal(false);
            setRenewConfirmText('');
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            }}>
              🔄
            </div>
            <h3 style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Renovar Contenido del Curso
            </h3>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              Esta acción eliminará <strong>todos los módulos y lecciones</strong> del curso <strong>"{course?.title}"</strong>.
            </p>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              El título y descripción del curso se mantendrán, y podrás volver a crear la estructura desde el asistente.
            </p>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Para confirmar, escribe <strong>RENOVAR</strong> en el campo de abajo:
            </p>
            <input
              type="text"
              value={renewConfirmText}
              onChange={(e) => setRenewConfirmText(e.target.value)}
              placeholder="Escribe RENOVAR"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontWeight: '600',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setRenewContentModal(false);
                  setRenewConfirmText('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  console.log('🔄 Botón Renovar clickeado, texto:', renewConfirmText);
                  if (renewConfirmText.trim().toLowerCase() === 'renovar') {
                    try {
                      console.log('✅ Confirmación válida, llamando API...');
                      const response = await fetch(`/api/instructor/course/${slug}/renew-content`, {
                        method: 'DELETE'
                      });

                      console.log('📡 Response status:', response.status, response.ok);

                      if (response.ok) {
                        console.log('✅ Contenido renovado, cerrando modal...');
                        setRenewContentModal(false);
                        setRenewConfirmText('');
                        const redirectUrl = `/dashboard?tab=crear-curso&courseSlug=${slug}`;
                        console.log('🚀 Redirigiendo a:', redirectUrl);
                        router.push(redirectUrl);
                        console.log('✅ router.push ejecutado');
                      } else {
                        const data = await response.json();
                        console.error('❌ Error en respuesta:', data);
                        showModal('error', data.error || 'Error al renovar el contenido');
                      }
                    } catch (error) {
                      console.error('❌ Error capturado:', error);
                      showModal('error', 'Error al renovar el contenido');
                    }
                  } else {
                    console.log('⚠️ Texto no válido:', renewConfirmText);
                    showModal('warning', 'Debes escribir RENOVAR para confirmar');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Renovar Contenido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleModal({ module, onClose, onSave, onDelete, saving }: any) {
  const [title, setTitle] = useState(module?.title || '');
  const [description, setDescription] = useState(module?.description || '');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
          {module ? 'Editar Módulo' : 'Nuevo Módulo'}
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Ej: Introducción"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Descripción del módulo..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: '#ef4444',
                  opacity: saving ? 0.5 : 1
                }}
              >
                Eliminar
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                color: '#374151',
                opacity: saving ? 0.5 : 1
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave({ title, description })}
              disabled={saving || !title}
              style={{
                padding: '10px 20px',
                background: saving || !title ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving || !title ? 'not-allowed' : 'pointer',
                color: 'white'
              }}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonModal({ lesson, course, moduleId, onClose, onSave, onDelete, saving }: any) {
  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [contentType, setContentType] = useState(lesson?.content_type || 'video');
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '');
  const [videoFile, setVideoFile] = useState(lesson?.video_file || '');
  const [mainContent, setMainContent] = useState(lesson?.main_content || '');
  const [documentUrl, setDocumentUrl] = useState(lesson?.document_url || '');
  const [documentsUrls, setDocumentsUrls] = useState<string[]>(
    lesson?.documents_urls ? (typeof lesson.documents_urls === 'string' ? JSON.parse(lesson.documents_urls) : lesson.documents_urls) : []
  );
  const [markdownContent, setMarkdownContent] = useState(lesson?.markdown_content || '');
  const [markdownImage, setMarkdownImage] = useState(lesson?.markdown_image || '');
  const [markdownVideo, setMarkdownVideo] = useState(lesson?.markdown_video || '');
  const [duration, setDuration] = useState(lesson?.duration || '');
  const [isFree, setIsFree] = useState(lesson?.is_free || false);
  const [hasQuiz, setHasQuiz] = useState(lesson?.has_quiz || false);
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(lesson?.quiz_questions_count || 2);
  const [quizData, setQuizData] = useState(lesson?.quiz_data || null);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [regenerateModal, setRegenerateModal] = useState<{ open: boolean; questionIndex: number; currentQuestion: any } | null>(null);
  const [regenerateObservations, setRegenerateObservations] = useState('');
  const [aiHelpModal, setAiHelpModal] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [confirmReplaceModal, setConfirmReplaceModal] = useState(false);
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

  const handleGenerateContent = async () => {
    let moduleName = 'Módulo';
    let previousLessons: string[] = [];

    if (course && course.modules && moduleId) {
      const foundModule = course.modules.find((m: any) => m.id === moduleId);
      if (foundModule) {
        moduleName = foundModule.title;

        if (foundModule.lessons && Array.isArray(foundModule.lessons)) {
          const currentLessonIndex = lesson
            ? foundModule.lessons.findIndex((l: any) => l.id === lesson.id)
            : foundModule.lessons.length;

          if (currentLessonIndex > 0) {
            previousLessons = foundModule.lessons
              .slice(0, currentLessonIndex)
              .map((l: any) => l.title);
          }
        }
      }
    }

    const courseTitle = course?.title || 'Curso';

    setGeneratingContent(true);
    setConfirmReplaceModal(false);

    try {
      const response = await fetch('/api/instructor/generate-lesson-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          moduleName,
          lessonTitle: title,
          lessonDescription: description,
          previousLessons
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar contenido');
      }

      setMainContent(data.content);
      showModal('success', `✅ Contenido generado exitosamente (${data.tokensUsed} tokens)`);
    } catch (error: any) {
      showModal('error', `❌ Error: ${error.message}`);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error(`Error al subir ${file.name}`);

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setDocumentsUrls(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error al subir los archivos');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al subir imagen');
      }

      const data = await response.json();
      setMarkdownImage(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Solo se permiten archivos de video');
      return;
    }

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al subir video');
      }

      const data = await response.json();
      setVideoFile(data.url);
      setVideoUrl('');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Error al subir el video: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '16px',
        padding: '0',
        maxWidth: '90%',
        width: '90%',
        margin: 'auto',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
          padding: '24px 24px 0 24px'
        }}>
          {lesson ? 'Editar Lección' : 'Nueva Lección'}
        </h3>

        <div style={{ padding: '0 24px 24px 24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'border-color 0.2s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="Ej: Introducción al tema"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              Tipo de Contenido *
            </label>
            <button
              type="button"
              onClick={() => setAiHelpModal(true)}
              style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              💡 Ayuda IA
            </button>
          </div>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="video">Lección</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Tarea</option>
            <option value="material">Material Adjunto</option>
          </select>
        </div>

        {contentType === 'video' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Subir Video (MP4, WEBM, etc.)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: uploadingVideo ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box'
                }}
              />
              {uploadingVideo && (
                <p style={{ fontSize: '11px', color: '#667eea', marginTop: '4px', fontWeight: '500' }}>
                  📹 Subiendo video... (esto puede tardar varios minutos)
                </p>
              )}
              {videoFile && (
                <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: '500' }}>
                  ✓ Video subido: {videoFile}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>
              - O -
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                URL de YouTube
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); if (e.target.value) setVideoFile(''); }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="dQw4w9WgXcQ o https://youtube.com/watch?v=..."
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Contenido Principal (HTML)
                </label>
                {title && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                      let moduleName = 'Módulo';
                      if (course && course.modules && moduleId) {
                        const foundModule = course.modules.find((m: any) => m.id === moduleId);
                        if (foundModule) {
                          moduleName = foundModule.title;
                        }
                      }

                      const courseTitle = course?.title || 'Curso';
                      const prompt = `Eres un experto instructor creando contenido educativo de alta calidad.

**Curso:** ${courseTitle}
**Módulo:** ${moduleName}
**Lección:** ${title}
${description ? `**Descripción:** ${description}` : ''}

Por favor, genera contenido completo y detallado para esta lección que incluya:

1. **Introducción** - Explica qué aprenderá el estudiante y por qué es importante
2. **Conceptos principales** - Desarrollo detallado del tema con explicaciones claras
3. **Ejemplos prácticos** - Casos reales y ejercicios aplicables
4. **Puntos clave** - Resumen de lo más importante
5. **Recursos adicionales** - Enlaces, lecturas o herramientas recomendadas

El contenido debe ser:
- Pedagógico y fácil de entender
- Con ejemplos concretos
- Entre 500-800 palabras

Genera el contenido completo.`;

                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(prompt).then(() => {
                          alert('✓ Prompt copiado. Pégalo en ChatGPT y copia el resultado aquí.');
                        }).catch(() => {
                          const textarea = document.createElement('textarea');
                          textarea.value = prompt;
                          textarea.style.position = 'fixed';
                          textarea.style.opacity = '0';
                          document.body.appendChild(textarea);
                          textarea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textarea);
                          alert('✓ Prompt copiado. Pégalo en ChatGPT y copia el resultado aquí.');
                        });
                      } else {
                        const textarea = document.createElement('textarea');
                        textarea.value = prompt;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        alert('✓ Prompt copiado. Pégalo en ChatGPT y copia el resultado aquí.');
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                      📋 Copiar prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (mainContent && mainContent.trim().length > 0) {
                          setConfirmReplaceModal(true);
                        } else {
                          handleGenerateContent();
                        }
                      }}
                      disabled={generatingContent}
                      style={{
                        padding: '6px 12px',
                        background: generatingContent ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: generatingContent ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {generatingContent ? '⏳ Generando...' : '🤖 Generar con IA'}
                    </button>
                  </div>
                )}
              </div>
              <MarkdownEditor
                value={mainContent}
                onChange={setMainContent}
                placeholder="Agrega el contenido principal de la lección (HTML)..."
              />
            </div>
          </>
        )}



        {contentType === 'assignment' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Instrucciones de la Tarea
              </label>
              <MarkdownEditor
                value={markdownContent}
                onChange={setMarkdownContent}
                placeholder="Describe las instrucciones de la tarea. Puedes incluir formato, ejemplos, criterios de evaluación, etc."
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Puntaje Máximo
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quizQuestionsCount || 20}
                onChange={(e) => setQuizQuestionsCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="20"
              />
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                Define cuántos puntos vale esta tarea (por defecto 20)
              </p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Adjuntar Archivos
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box'
                }}
              />
              {uploading && (
                <p style={{ fontSize: '11px', color: '#667eea', marginTop: '4px', fontWeight: '500' }}>
                  📤 Subiendo archivos...
                </p>
              )}
            </div>

            {documentsUrls.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📎 Archivos subidos ({documentsUrls.length}):
                </p>
                {documentsUrls.map((url, index) => {
                  const fullFilename = url.split('/').pop() || `Archivo ${index + 1}`;
                  const filename = fullFilename.replace(/^\d+_/, '');
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', backgroundColor: 'white', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e5e7eb' }}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#667eea', textDecoration: 'none', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {filename}
                      </a>
                      <button
                        onClick={() => setDocumentsUrls(prev => prev.filter((_, i) => i !== index))}
                        style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '11px', color: '#ef4444', backgroundColor: 'white', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {contentType === 'material' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Archivos para Descargar
              </label>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                Sube el material de trabajo (por ejemplo, un .zip) para que el estudiante lo descargue.
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box'
                }}
              />
              {uploading && (
                <p style={{ fontSize: '11px', color: '#667eea', marginTop: '4px', fontWeight: '500' }}>
                  📤 Subiendo archivos...
                </p>
              )}
            </div>

            {documentsUrls.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📎 Archivos subidos ({documentsUrls.length}):
                </p>
                {documentsUrls.map((url, index) => {
                  const fullFilename = url.split('/').pop() || `Archivo ${index + 1}`;
                  const filename = fullFilename.replace(/^\d+_/, '');
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', backgroundColor: 'white', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e5e7eb' }}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#667eea', textDecoration: 'none', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {filename}
                      </a>
                      <button
                        onClick={() => setDocumentsUrls(prev => prev.filter((_, i) => i !== index))}
                        style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '11px', color: '#ef4444', backgroundColor: 'white', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            Duración
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="15:30"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Lección gratuita</span>
          </label>
        </div>

        {(contentType === 'video' || contentType === 'assignment') && (mainContent || markdownContent) && (
          <>
            <div style={{
              marginBottom: '12px',
              padding: '16px',
              background: '#f0f9ff',
              border: '2px solid #bae6fd',
              borderRadius: '8px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  checked={hasQuiz}
                  onChange={(e) => setHasQuiz(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>
                  ⚡ Habilitar preguntas rápidas al final
                </span>
              </label>

              {hasQuiz && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  💡 Las preguntas se gestionan en el botón "⚡ Preguntas" que aparecerá junto al botón "Editar" después de guardar.
                </p>
              )}
            </div>
          </>
        )}

        <div style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between',
          marginTop: '4px',
          background: 'white',
          padding: '16px 0',
          borderTop: '1px solid #e5e7eb',
          zIndex: 10
        }}>
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={saving}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: '#ef4444',
                  opacity: saving ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                🗑️ Eliminar
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                padding: '8px 16px',
                background: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                color: '#374151',
                opacity: saving ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave({
                title,
                description,
                content_type: contentType,
                video_url: videoUrl,
                video_file: videoFile,
                main_content: mainContent,
                document_url: documentUrl,
                documents_urls: documentsUrls,
                markdown_content: markdownContent,
                markdown_image: markdownImage,
                markdown_video: markdownVideo,
                duration,
                is_free: isFree,
                has_quiz: hasQuiz,
                quiz_questions_count: (hasQuiz || contentType === 'assignment') ? quizQuestionsCount : 0,
                quiz_data: hasQuiz ? quizData : null
              })}
              disabled={saving || !title}
              style={{
                padding: '8px 20px',
                background: saving || !title ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: saving || !title ? 'not-allowed' : 'pointer',
                color: 'white',
                boxShadow: saving || !title ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {saving ? '⏳ Guardando...' : '✓ Guardar'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>

    {aiHelpModal && (
        <div
          onClick={() => setAiHelpModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{
              position: 'relative',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setAiHelpModal(false)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#ef4444';
                }}
              >
                ×
              </button>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                paddingRight: '40px'
              }}>
                💡 Herramientas IA para crear contenido
              </h3>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              Usa estas herramientas 100% gratuitas para generar contenido profesional:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                      🧠 ChatGPT
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                      Investiga temas, crea guiones y estructuras de curso
                    </div>
                  </div>
                  <a
                    href="https://chat.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Abrir →
                  </a>
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                      📚 NotebookLM
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                      Genera audios, videos, diapositivas, mapas mentales e informes
                    </div>
                  </div>
                  <a
                    href="https://notebooklm.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Abrir →
                  </a>
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                      🎨 Gemini
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                      Genera muchas imágenes para tus cursos
                    </div>
                  </div>
                  <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Abrir →
                  </a>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <div style={{ fontSize: '12px', color: '#0c4a6e', lineHeight: '1.6' }}>
                💡 <strong>Tip:</strong> Combina estas herramientas para crear cursos profesionales sin experiencia técnica ni inversión inicial.
              </div>
            </div>
          </div>
        </div>
      )}

    {/* Modal de confirmación para reemplazar contenido */}
    {confirmReplaceModal && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}
        onClick={() => setConfirmReplaceModal(false)}
      >
        <div
          style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
              ¿Reemplazar contenido existente?
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              Ya existe contenido en este campo. Si continúas, el contenido actual será <strong>reemplazado</strong> por el nuevo contenido generado por IA.
            </p>
            <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '12px', fontWeight: '500' }}>
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setConfirmReplaceModal(false)}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateContent}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Sí, reemplazar contenido
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Overlay de carga mientras se genera contenido */}
    {generatingContent && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10002
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <p style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          marginTop: '24px',
          textAlign: 'center'
        }}>
          🤖 Generando contenido con IA...
        </p>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Esto puede tomar hasta 30 segundos
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )}
    </>
  );
}
