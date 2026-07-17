'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';
import AppHeader from '@/components/AppHeader';
import Breadcrumb from '@/components/Breadcrumb';

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

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content_type: 'video' | 'document' | 'quiz' | 'assignment' | 'markdown';
  video_url: string | null;
  video_file: string | null;
  video_markdown: string | null;
  document_url: string | null;
  markdown_content: string | null;
  markdown_image: string | null;
  markdown_video: string | null;
  duration: string;
  order_index: number;
  is_free: boolean;
  has_quiz: boolean;
  quiz_questions_count: number;
  quiz_data: any;
  quiz_completed?: boolean;
  quiz_score?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  duration: string;
  modality: string;
  enrolled_at: string;
}

interface CourseData {
  course: Course;
  modules: Module[];
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{score: number, total: number} | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuizLesson, setSelectedQuizLesson] = useState<Lesson | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [certificateStatus, setCertificateStatus] = useState<any>(null);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [uploadingAssignment, setUploadingAssignment] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<Record<number, any>>({});
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    fetchCourseData();
    checkCertificateStatus();
    fetchUser();
  }, [slug]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest('button')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const checkCertificateStatus = async () => {
    try {
      const response = await fetch(`/api/student/course/${slug}/certificate-status`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCertificateStatus(data);
      }
    } catch (error) {
      console.error('Error checking certificate:', error);
    }
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      const response = await fetch('/api/student/generate-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        showModal('error', error.error || 'Error al generar certificado');
        return;
      }

      const data = await response.json();
      window.open(data.certificate.url, '_blank');
      await checkCertificateStatus();
    } catch (error) {
      console.error('Error generating certificate:', error);
      showModal('error', 'Error al generar certificado');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${slug}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          setError('No estás matriculado en este curso');
          setLoading(false);
          return;
        }
        throw new Error('Error al cargar el curso');
      }
      const data = await response.json();
      setCourseData(data);

      const assignmentLessons = data.modules.flatMap((m: any) =>
        m.lessons.filter((l: any) => l.content_type === 'assignment')
      );

      const submissionsMap: Record<number, any> = {};
      await Promise.all(
        assignmentLessons.map(async (lesson: any) => {
          try {
            const subRes = await fetch(`/api/student/assignment-submission/${lesson.id}`, {
              credentials: 'include'
            });
            if (subRes.ok) {
              const subData = await subRes.json();
              console.log(`Submission data for lesson ${lesson.id}:`, subData);
              if (subData.submission) {
                submissionsMap[lesson.id] = subData.submission;
              }
            }
          } catch (err) {
            console.error(`Error loading submission for lesson ${lesson.id}:`, err);
          }
        })
      );

      console.log('All submissions loaded:', submissionsMap);
      setAssignmentSubmissions(submissionsMap);

      if (data.modules.length > 0) {
        setExpandedModules([data.modules[0].id]);
        if (data.modules[0].lessons.length > 0) {
          setSelectedLesson(data.modules[0].lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getAllLessons = () => {
    if (!courseData) return [];
    return courseData.modules.flatMap(module => module.lessons);
  };

  const getCurrentLessonIndex = () => {
    const allLessons = getAllLessons();
    return allLessons.findIndex(lesson => lesson.id === selectedLesson?.id);
  };

  const goToPreviousLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1]);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
    }
  };

  const goToNextLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1]);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
    }
  };

  const handleOpenQuiz = async (lesson: Lesson) => {
    setSelectedQuizLesson(lesson);
    setQuizModalOpen(true);

    try {
      const response = await fetch(`/api/student/quiz-response/${lesson.id}`, {
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Quiz response data:', JSON.stringify(data, null, 2));

      if (data.error) {
        console.error('API returned error:', data.error);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizResult(null);
        return;
      }

      if (data.hasResponse) {
        console.log('Has response, setting submitted state');
        console.log('Responses:', data.responses);
        console.log('Score:', data.score);
        setQuizAnswers(data.responses);
        const totalQuestions = lesson.quiz_data.length;
        setQuizResult({ score: data.score, total: totalQuestions });
        setQuizSubmitted(true);
      } else {
        console.log('No response, fresh quiz');
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizResult(null);
      }
    } catch (error) {
      console.error('Error loading quiz response:', error);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleAssignmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssignmentFile(e.target.files[0]);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedLesson || !assignmentFile) {
      showModal('warning', 'Por favor selecciona un archivo');
      return;
    }

    setUploadingAssignment(true);
    try {
      const formData = new FormData();
      formData.append('file', assignmentFile);
      formData.append('lesson_id', selectedLesson.id.toString());

      const response = await fetch('/api/student/assignment-submission', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir la tarea');
      }

      const data = await response.json();
      showModal('success', '✓ Tarea enviada exitosamente');
      setAssignmentFile(null);
      setAssignmentSubmissions({
        ...assignmentSubmissions,
        [selectedLesson.id]: data.submission
      });
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      showModal('error', error.message || 'Error al enviar la tarea');
    } finally {
      setUploadingAssignment(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuizLesson || !selectedQuizLesson.quiz_data) return;

    const questions = selectedQuizLesson.quiz_data;
    let correctCount = 0;

    questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    setQuizResult({ score: correctCount, total: questions.length });
    setQuizSubmitted(true);

    try {
      await fetch('/api/student/quiz-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: selectedQuizLesson.id,
          responses: quizAnswers,
          score: correctCount
        }),
        credentials: 'include'
      });

      await fetchCourseData();

      setQuizModalOpen(false);
      setResultModalOpen(true);
    } catch (error) {
      console.error('Error saving quiz response:', error);
    }
  };

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
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>❌</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>{error}</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Vuelve al aula virtual para ver tus cursos disponibles
          </p>
          <Link
            href="/aula-virtual"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Volver al Aula Virtual
          </Link>
        </div>
      </div>
    );
  }

  if (!courseData) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: '#1c1d1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/aula-virtual" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/images/logo_smartchatix_horiz.png"
              alt="SmartChatix"
              width={180}
              height={52}
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div style={{
            height: '40px',
            width: '1px',
            background: 'rgba(255,255,255,0.2)'
          }} />
          <h1 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '500px'
          }}>
            {courseData.course.title}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ⭐ Calificar
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: '40px',
                height: '40px',
                background: userMenuOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb',
                minWidth: '220px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '4px'
                  }}>
                    {user?.name || 'Usuario'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {user?.email}
                  </div>
                </div>
                <Link
                  href="/aula-virtual"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontSize: '16px' }}>📚</span>
                  Mis Cursos
                </Link>
                <Link
                  href="/"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontSize: '16px' }}>🔍</span>
                  Catálogo
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.2s',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontSize: '16px' }}>⚙️</span>
                    Panel Admin
                  </Link>
                )}
                {user?.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.2s',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontSize: '16px' }}>👨‍🏫</span>
                    Panel Instructor
                  </Link>
                )}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'white',
                    border: 'none',
                    textAlign: 'left',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Mis Cursos', href: '/aula-virtual' },
          { label: courseData.course.title }
        ]}
      />

      {/* Banner de Certificado */}
      {certificateStatus?.eligible && (
        <div style={{
          background: certificateStatus.already_issued
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                fontSize: '32px'
              }}>
                🎓
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {certificateStatus.already_issued
                    ? '¡Certificado Obtenido!'
                    : '¡Felicidades! Eres elegible para tu certificado'}
                </h3>
                <p style={{
                  fontSize: '14px',
                  opacity: 0.9,
                  margin: 0
                }}>
                  {certificateStatus.already_issued
                    ? `Calificación final: ${certificateStatus.certificate.score}/20`
                    : `Calificación final: ${certificateStatus.score}/20 - Descarga tu certificado ahora`}
                </p>
              </div>
            </div>
            <div>
              {certificateStatus.already_issued ? (
                <a
                  href={certificateStatus.certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#059669',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  📄 Ver Certificado
                </a>
              ) : (
                <button
                  onClick={handleGenerateCertificate}
                  disabled={generatingCertificate}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: generatingCertificate ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    opacity: generatingCertificate ? 0.7 : 1,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => !generatingCertificate && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {generatingCertificate ? '⏳ Generando...' : '🎓 Descargar Certificado'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{
          width: '320px',
          background: 'white',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0'
            }}>
              Contenido del Curso
            </h2>
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }}>

            {courseData.modules.map((module, moduleIndex) => (
            <div key={module.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => toggleModule(module.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: expandedModules.includes(module.id) ? '#f3f4f6' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#111827',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ flex: 1 }}>Módulo {moduleIndex + 1}: {module.title}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {expandedModules.includes(module.id) ? '▼' : '▶'}
                </span>
              </button>

              {expandedModules.includes(module.id) && (
                <div style={{ marginTop: '4px', paddingLeft: '8px' }}>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id}>
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizResult(null);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: selectedLesson?.id === lesson.id ? '#3b82f6' : 'white',
                          border: 'none',
                          borderLeft: selectedLesson?.id === lesson.id
                            ? '3px solid #1d4ed8'
                            : '3px solid transparent',
                          borderRadius: '6px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'start',
                          gap: '8px',
                          fontSize: '13px',
                          color: selectedLesson?.id === lesson.id ? 'white' : '#374151',
                          fontWeight: selectedLesson?.id === lesson.id ? '600' : '500',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          {lesson.content_type === 'video' ? '▶️' : lesson.content_type === 'markdown' ? '📝' : '📄'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: selectedLesson?.id === lesson.id ? '600' : '500',
                            color: selectedLesson?.id === lesson.id ? 'white' : '#111827'
                          }}>
                            {lessonIndex + 1}. {lesson.title}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: selectedLesson?.id === lesson.id ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                            marginTop: '2px',
                            fontWeight: '500'
                          }}>
                            {lesson.duration}
                          </div>
                        </div>
                      </button>

                      {(lesson.has_quiz && lesson.quiz_data && lesson.quiz_data.length > 0) ? (
                        <button
                          onClick={() => handleOpenQuiz(lesson)}
                          style={{
                            width: '100%',
                            padding: '8px 12px 8px 32px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500',
                            marginBottom: '4px',
                            transition: 'all 0.2s',
                            boxShadow: 'none'
                          }}
                        >
                          {lesson.quiz_completed && lesson.quiz_score !== undefined && lesson.quiz_data ? (() => {
                            const totalQuestions = lesson.quiz_data.length;
                            const percentage = (lesson.quiz_score / totalQuestions) * 100;

                            return (
                              <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                {percentage === 100 ? (
                                  <>
                                    <span style={{ color: '#10b981' }}>✅</span>
                                    <span style={{ fontSize: '12px' }}>⭐</span>
                                  </>
                                ) : percentage >= 75 ? (
                                  <span style={{ color: '#3b82f6' }}>🔵</span>
                                ) : percentage >= 50 ? (
                                  <span style={{ color: '#f59e0b' }}>🟡</span>
                                ) : (
                                  <span style={{ color: '#ef4444' }}>🔴</span>
                                )}
                              </span>
                            );
                          })() : (
                            <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                              <circle cx="8" cy="8" r="7" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="2,2"/>
                              <path d="M4 8 L7 11 L12 5" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          <span style={{ fontWeight: '500' }}>Preguntas Rápidas</span>
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </aside>

        <main style={{
          flex: 1,
          background: '#f8f9fa',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            flex: 1,
            padding: '32px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }}>
          {selectedLesson ? (
            <>
              {selectedLesson.content_type === 'video' ? (
                <>
                  <style>{`
                    .youtube-container {
                      position: relative;
                      overflow: hidden;
                    }
                    .youtube-container iframe {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      border: none;
                    }
                  `}</style>
                  {(selectedLesson.video_url || selectedLesson.video_file) && (
                    <>
                      {selectedLesson.video_file ? (
                        <video
                          controls
                          controlsList="nodownload"
                          style={{
                            width: '100%',
                            borderRadius: '12px',
                            background: '#000',
                            outline: 'none'
                          }}
                        >
                          <source src={selectedLesson.video_file} type="video/mp4" />
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      ) : (
                        <div className="youtube-container" style={{
                          position: 'relative',
                          paddingBottom: '56.25%',
                          height: 0,
                          overflow: 'hidden',
                          borderRadius: '12px',
                          background: '#000'
                        }}>
                          <iframe
                            src={getYouTubeEmbedUrl(selectedLesson.video_url!)}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              pointerEvents: 'auto'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </>
                  )}
                  {selectedLesson.video_markdown && (
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '32px',
                      marginTop: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                      <style dangerouslySetInnerHTML={{__html: `
                        .html-content p {
                          margin-bottom: 1rem;
                          line-height: 1.7;
                        }
                        .html-content h1 {
                          font-size: 2rem;
                          font-weight: 700;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          line-height: 1.2;
                        }
                        .html-content h2 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                          line-height: 1.3;
                        }
                        .html-content h3 {
                          font-size: 1.25rem;
                          font-weight: 600;
                          margin-top: 1.25rem;
                          margin-bottom: 0.5rem;
                          line-height: 1.4;
                        }
                        .html-content h4 {
                          font-size: 1.1rem;
                          font-weight: 600;
                          margin-top: 1rem;
                          margin-bottom: 0.5rem;
                        }
                        .html-content ul, .html-content ol {
                          margin-left: 1.5rem;
                          margin-bottom: 1rem;
                          line-height: 1.7;
                        }
                        .html-content li {
                          margin-bottom: 0.5rem;
                        }
                        .html-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 1rem 0;
                          display: block;
                        }
                        .html-content a {
                          color: #667eea;
                          text-decoration: underline;
                        }
                        .html-content a:hover {
                          color: #5a67d8;
                        }
                        .html-content blockquote {
                          border-left: 4px solid #667eea;
                          padding-left: 1rem;
                          margin: 1rem 0;
                          font-style: italic;
                          color: #6b7280;
                        }
                        .html-content code {
                          background: #f3f4f6;
                          padding: 0.2rem 0.4rem;
                          border-radius: 4px;
                          font-family: 'Courier New', monospace;
                          font-size: 0.9em;
                        }
                        .html-content pre {
                          background: #1f2937;
                          color: #f9fafb;
                          padding: 1rem;
                          border-radius: 8px;
                          overflow-x: auto;
                          margin: 1rem 0;
                        }
                        .html-content pre code {
                          background: none;
                          padding: 0;
                          color: inherit;
                        }
                        .html-content table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 1rem 0;
                        }
                        .html-content th, .html-content td {
                          border: 1px solid #e5e7eb;
                          padding: 0.5rem;
                          text-align: left;
                        }
                        .html-content th {
                          background: #f3f4f6;
                          font-weight: 600;
                        }
                        .html-content strong, .html-content b {
                          font-weight: 700;
                        }
                        .html-content em, .html-content i {
                          font-style: italic;
                        }
                        .html-content hr {
                          border: none;
                          border-top: 1px solid #e5e7eb;
                          margin: 2rem 0;
                        }
                      `}} />
                      <div
                        className="html-content"
                        dangerouslySetInnerHTML={{ __html: selectedLesson.video_markdown }}
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.7',
                          color: '#374151'
                        }}
                      />
                    </div>
                  )}
                </>
              ) : selectedLesson.content_type === 'document' && selectedLesson.document_url ? (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '80vh',
                  width: '100%',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <iframe
                    src={`${selectedLesson.document_url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title="Visor de PDF"
                  />
                </div>
              ) : selectedLesson.content_type === 'markdown' ? (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '40px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  {selectedLesson.markdown_image && (
                    <img
                      src={selectedLesson.markdown_image}
                      alt={selectedLesson.title}
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }}
                    />
                  )}
                  {selectedLesson.markdown_video && (
                    <div className="youtube-container" style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      overflow: 'hidden',
                      borderRadius: '12px',
                      marginBottom: '32px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}>
                      <iframe
                        src={getYouTubeEmbedUrl(selectedLesson.markdown_video)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '12px',
                          pointerEvents: 'auto'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {selectedLesson.markdown_content && (
                    <>
                      <style dangerouslySetInnerHTML={{__html: `
                        .html-content-markdown p {
                          margin-bottom: 1rem;
                          line-height: 1.8;
                        }
                        .html-content-markdown h1 {
                          font-size: 2rem;
                          font-weight: 700;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          line-height: 1.2;
                        }
                        .html-content-markdown h2 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                          line-height: 1.3;
                        }
                        .html-content-markdown h3 {
                          font-size: 1.25rem;
                          font-weight: 600;
                          margin-top: 1.25rem;
                          margin-bottom: 0.5rem;
                          line-height: 1.4;
                        }
                        .html-content-markdown ul, .html-content-markdown ol {
                          margin-left: 1.5rem;
                          margin-bottom: 1rem;
                          line-height: 1.8;
                        }
                        .html-content-markdown li {
                          margin-bottom: 0.5rem;
                        }
                        .html-content-markdown img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 1rem 0;
                          display: block;
                        }
                        .html-content-markdown a {
                          color: #667eea;
                          text-decoration: underline;
                        }
                        .html-content-markdown strong, .html-content-markdown b {
                          font-weight: 700;
                        }
                      `}} />
                      <div
                        className="html-content-markdown"
                        dangerouslySetInnerHTML={{ __html: selectedLesson.markdown_content }}
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.8',
                          color: '#374151'
                        }}
                      />
                    </>
                  )}
                </div>
              ) : selectedLesson.content_type === 'assignment' ? (
                <>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      borderLeft: '4px solid #667eea',
                      paddingLeft: '20px',
                      marginBottom: '24px',
                      background: '#f5f7ff',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a202c',
                        marginBottom: '8px',
                        margin: 0
                      }}>
                        {selectedLesson.title}
                      </h2>
                      {selectedLesson.description && (
                        <p style={{
                          color: '#4a5568',
                          lineHeight: '1.6',
                          fontSize: '16px',
                          margin: '8px 0 0 0'
                        }}>
                          {selectedLesson.description}
                        </p>
                      )}
                    </div>
                    {selectedLesson.markdown_image && (
                      <img
                        src={selectedLesson.markdown_image}
                        alt={selectedLesson.title}
                        style={{
                          width: '100%',
                          maxHeight: '400px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          marginBottom: '32px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                        }}
                      />
                    )}
                    {selectedLesson.markdown_video && (
                      <div className="youtube-container" style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }}>
                        <iframe
                          src={getYouTubeEmbedUrl(selectedLesson.markdown_video)}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '12px',
                            pointerEvents: 'auto'
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {selectedLesson.markdown_content && (
                      <>
                        <style dangerouslySetInnerHTML={{__html: `
                          .html-content-assignment p {
                            margin-bottom: 1rem;
                            line-height: 1.8;
                          }
                          .html-content-assignment h1 {
                            font-size: 2rem;
                            font-weight: 700;
                            margin-top: 2rem;
                            margin-bottom: 1rem;
                            line-height: 1.2;
                          }
                          .html-content-assignment h2 {
                            font-size: 1.5rem;
                            font-weight: 600;
                            margin-top: 1.5rem;
                            margin-bottom: 0.75rem;
                            line-height: 1.3;
                          }
                          .html-content-assignment h3 {
                            font-size: 1.25rem;
                            font-weight: 600;
                            margin-top: 1.25rem;
                            margin-bottom: 0.5rem;
                            line-height: 1.4;
                          }
                          .html-content-assignment ul, .html-content-assignment ol {
                            margin-left: 1.5rem;
                            margin-bottom: 1rem;
                            line-height: 1.8;
                          }
                          .html-content-assignment li {
                            margin-bottom: 0.5rem;
                          }
                          .html-content-assignment img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 8px;
                            margin: 1rem 0;
                            display: block;
                          }
                          .html-content-assignment a {
                            color: #667eea;
                            text-decoration: underline;
                          }
                          .html-content-assignment strong, .html-content-assignment b {
                            font-weight: 700;
                          }
                        `}} />
                        <div
                          className="html-content-assignment"
                          dangerouslySetInnerHTML={{ __html: selectedLesson.markdown_content }}
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#374151'
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #667eea'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📤 Entrega de Tarea
                    </h3>
                    {assignmentSubmissions[selectedLesson.id] ? (
                      <div>
                        <div style={{
                          padding: '20px',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          border: '2px solid #10b981',
                          marginBottom: '16px'
                        }}>
                          <p style={{
                            color: '#047857',
                            fontWeight: '600',
                            fontSize: '16px',
                            marginBottom: '8px'
                          }}>
                            ✅ Tarea enviada exitosamente
                          </p>
                          <p style={{
                            color: '#065f46',
                            fontSize: '14px',
                            margin: 0
                          }}>
                            Archivo: {assignmentSubmissions[selectedLesson.id].file_name}
                          </p>
                          <p style={{
                            color: '#065f46',
                            fontSize: '14px',
                            margin: '4px 0 0 0'
                          }}>
                            Enviado: {new Date(assignmentSubmissions[selectedLesson.id].submitted_at).toLocaleString('es-ES')}
                          </p>
                        </div>

                        {assignmentSubmissions[selectedLesson.id].grade !== null && (
                          <div style={{
                            padding: '20px',
                            background: '#eff6ff',
                            borderRadius: '8px',
                            border: '2px solid #667eea'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: assignmentSubmissions[selectedLesson.id].feedback ? '12px' : '0'
                            }}>
                              <p style={{
                                color: '#1e40af',
                                fontWeight: '600',
                                fontSize: '16px',
                                margin: 0
                              }}>
                                📊 Calificación
                              </p>
                              <span style={{
                                background: '#667eea',
                                color: 'white',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '18px',
                                fontWeight: '700'
                              }}>
                                {assignmentSubmissions[selectedLesson.id].grade}/{selectedLesson.quiz_questions_count || 20} puntos
                              </span>
                            </div>

                            {assignmentSubmissions[selectedLesson.id].feedback && (
                              <div style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid #bfdbfe'
                              }}>
                                <p style={{
                                  color: '#1e40af',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  marginBottom: '8px'
                                }}>
                                  💬 Observaciones del profesor:
                                </p>
                                <p style={{
                                  color: '#1e3a8a',
                                  fontSize: '14px',
                                  margin: 0,
                                  lineHeight: '1.5',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {assignmentSubmissions[selectedLesson.id].feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '14px',
                          marginBottom: '16px'
                        }}>
                          Sube tu trabajo en formato PDF, Word, Excel o imagen (máx. 10MB)
                        </p>
                        <div style={{
                          marginBottom: '16px'
                        }}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            onChange={handleAssignmentFileChange}
                            disabled={uploadingAssignment}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '2px dashed #667eea',
                              borderRadius: '8px',
                              fontSize: '14px',
                              cursor: uploadingAssignment ? 'not-allowed' : 'pointer',
                              background: '#f9fafb'
                            }}
                          />
                        </div>
                        {assignmentFile && (
                          <p style={{
                            fontSize: '14px',
                            color: '#374151',
                            marginBottom: '16px',
                            padding: '8px 12px',
                            background: '#f3f4f6',
                            borderRadius: '6px'
                          }}>
                            📎 {assignmentFile.name} ({(assignmentFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        <button
                          onClick={handleSubmitAssignment}
                          disabled={!assignmentFile || uploadingAssignment}
                          style={{
                            padding: '12px 24px',
                            background: (!assignmentFile || uploadingAssignment) ? '#d1d5db' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: (!assignmentFile || uploadingAssignment) ? 'not-allowed' : 'pointer',
                            width: '100%'
                          }}
                          onMouseOver={(e) => {
                            if (assignmentFile && !uploadingAssignment) {
                              e.currentTarget.style.background = '#5a67d8';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (assignmentFile && !uploadingAssignment) {
                              e.currentTarget.style.background = '#667eea';
                            }
                          }}
                        >
                          {uploadingAssignment ? '⏳ Enviando...' : '📤 Enviar Tarea'}
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>Contenido no disponible</p>
                </div>
              )}
            </>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Selecciona una lección
              </h3>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                Elige una lección del menú lateral para comenzar
              </p>
            </div>
          )}
          </div>
        </main>
      </div>

      {quizModalOpen && selectedQuizLesson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0c4a6e',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
              }}>
                ⚡ Preguntas Rápidas: {selectedQuizLesson.title}
              </h3>
              <button
                onClick={() => setQuizModalOpen(false)}
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

            {quizSubmitted && quizResult ? (
              (() => {
                const percentage = (quizResult.score / quizResult.total) * 100;
                let message = '';
                let emoji = '';
                let bgColor = '';
                let borderColor = '';

                if (percentage === 100) {
                  message = '¡Excelente! Eres una estrella';
                  emoji = '⭐';
                  bgColor = '#dcfce7';
                  borderColor = '#10b981';
                } else if (percentage >= 75) {
                  message = '¡Buen intento!';
                  emoji = '💪';
                  bgColor = '#dbeafe';
                  borderColor = '#3b82f6';
                } else if (percentage >= 50) {
                  message = 'Está bueno el intento';
                  emoji = '👍';
                  bgColor = '#fef3c7';
                  borderColor = '#f59e0b';
                } else {
                  message = 'Puedes mejorar, inténtalo de nuevo';
                  emoji = '📚';
                  bgColor = '#fee2e2';
                  borderColor = '#ef4444';
                }

                return (
                  <div>
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '32px'
                    }}>
                      <div style={{
                        fontSize: '72px',
                        marginBottom: '16px'
                      }}>
                        {emoji}
                      </div>

                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a202c',
                        marginBottom: '16px'
                      }}>
                        {message}
                      </h3>

                      <div style={{
                        padding: '20px',
                        background: bgColor,
                        border: '2px solid',
                        borderColor: borderColor,
                        borderRadius: '12px',
                        display: 'inline-block'
                      }}>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a202c',
                          marginBottom: '4px'
                        }}>
                          {quizResult.score} de {quizResult.total} respuestas correctas
                        </p>
                        <p style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#1a202c'
                        }}>
                          {Math.round(percentage)}%
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRetryQuiz}
                      style={{
                        width: '100%',
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      🔄 Volver a responder
                    </button>
                  </div>
                );
              })()
            ) : (
              <div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '24px'
                }}>
                  Responde estas preguntas para verificar tu comprensión de la lección
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {selectedQuizLesson.quiz_data.map((question: any, qIdx: number) => (
                <div key={qIdx} style={{
                  background: 'rgba(6, 182, 212, 0.05)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '16px'
                  }}>
                    {qIdx + 1}. {question.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(question.options).map(([key, value]: [string, any]) => (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: quizAnswers[qIdx] === key
                            ? 'rgba(6, 182, 212, 0.15)'
                            : 'white',
                          border: '2px solid',
                          borderColor: quizAnswers[qIdx] === key ? '#06b6d4' : 'rgba(6, 182, 212, 0.2)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: quizAnswers[qIdx] === key
                            ? '0 4px 12px rgba(6, 182, 212, 0.25)'
                            : 'none'
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${qIdx}`}
                          value={key}
                          checked={quizAnswers[qIdx] === key}
                          onChange={(e) => {
                            setQuizAnswers({...quizAnswers, [qIdx]: e.target.value});
                          }}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          minWidth: '20px'
                        }}>
                          {key}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#374151',
                          flex: 1
                        }}>
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
                </div>

                <div style={{ marginTop: '24px' }}>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length !== selectedQuizLesson.quiz_data.length}
                style={{
                  width: '100%',
                  padding: '14px 32px',
                  background: Object.keys(quizAnswers).length !== selectedQuizLesson.quiz_data.length
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: Object.keys(quizAnswers).length !== selectedQuizLesson.quiz_data.length ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                }}
              >
                Enviar Respuestas
              </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {resultModalOpen && quizResult && selectedQuizLesson && (() => {
        const percentage = (quizResult.score / quizResult.total) * 100;
        let message = '';
        let emoji = '';
        let bgColor = '';
        let borderColor = '';

        if (percentage === 100) {
          message = '¡Excelente! Eres una estrella';
          emoji = '⭐';
          bgColor = '#dcfce7';
          borderColor = '#10b981';
        } else if (percentage >= 75) {
          message = '¡Buen intento!';
          emoji = '💪';
          bgColor = '#dbeafe';
          borderColor = '#3b82f6';
        } else if (percentage >= 50) {
          message = 'Está bueno el intento';
          emoji = '👍';
          bgColor = '#fef3c7';
          borderColor = '#f59e0b';
        } else {
          message = 'Puedes mejorar, inténtalo de nuevo';
          emoji = '📚';
          bgColor = '#fee2e2';
          borderColor = '#ef4444';
        }

        return (
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
            zIndex: 3000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                position: 'sticky',
                top: 0,
                background: 'white',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb',
                zIndex: 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '48px' }}>{emoji}</span>
                  <div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1a202c',
                      marginBottom: '4px'
                    }}>
                      {message}
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      {quizResult.score} de {quizResult.total} correctas ({Math.round(percentage)}%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setResultModalOpen(false)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                {selectedQuizLesson.quiz_data.map((question: any, qIdx: number) => {
                  const userAnswer = quizAnswers[qIdx];
                  const isCorrect = userAnswer === question.correct;

                  return (
                    <div key={qIdx} style={{
                      background: isCorrect ? '#f0fdf4' : '#fef2f2',
                      border: '2px solid',
                      borderColor: isCorrect ? '#86efac' : '#fca5a5',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>
                          {isCorrect ? '✅' : '❌'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '12px'
                          }}>
                            {qIdx + 1}. {question.question}
                          </p>

                          <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}>
                            <p style={{
                              fontSize: '13px',
                              color: '#6b7280',
                              marginBottom: '6px'
                            }}>
                              <strong>Tu respuesta:</strong> {userAnswer}) {question.options[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p style={{
                                fontSize: '13px',
                                color: '#059669',
                                fontWeight: '600'
                              }}>
                                <strong>Respuesta correcta:</strong> {question.correct}) {question.options[question.correct]}
                              </p>
                            )}
                          </div>

                          {question.explanations && (
                            <div style={{
                              background: isCorrect ? '#dcfce7' : '#fff7ed',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isCorrect ? '#86efac' : '#fed7aa'
                            }}>
                              {isCorrect ? (
                                <>
                                  <p style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#15803d',
                                    marginBottom: '8px'
                                  }}>
                                    💡 Explicación:
                                  </p>
                                  <div style={{
                                    fontSize: '13px',
                                    color: '#374151',
                                    lineHeight: '1.6'
                                  }} className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {question.explanations[question.correct]}
                                    </ReactMarkdown>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#991b1b',
                                    marginBottom: '8px'
                                  }}>
                                    ❌ Por qué tu respuesta es incorrecta:
                                  </p>
                                  <div style={{
                                    fontSize: '13px',
                                    color: '#374151',
                                    lineHeight: '1.6',
                                    marginBottom: '12px'
                                  }} className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {question.explanations[userAnswer]}
                                    </ReactMarkdown>
                                  </div>
                                  <p style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#15803d',
                                    marginBottom: '8px'
                                  }}>
                                    ✓ Respuesta correcta:
                                  </p>
                                  <div style={{
                                    fontSize: '13px',
                                    color: '#374151',
                                    lineHeight: '1.6'
                                  }} className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {question.explanations[question.correct]}
                                    </ReactMarkdown>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setResultModalOpen(false)}
                style={{
                  width: '100%',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        );
      })()}

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
