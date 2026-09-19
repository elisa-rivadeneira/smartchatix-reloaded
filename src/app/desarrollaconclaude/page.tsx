'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Hammer,
  MessageCircleQuestion,
  Users2,
  Infinity as InfinityIcon,
  Wallet,
  ClipboardCheck,
  Send,
  PartyPopper,
} from 'lucide-react';
import styles from './desarrollaconclaude.module.css';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const WHATSAPP_NUMBER = '51967717179';
const WHATSAPP_FALLBACK_MESSAGE = encodeURIComponent('Hola, quiero anotarme a la masterclass Desarrolla con Claude');
const WHATSAPP_FALLBACK_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_FALLBACK_MESSAGE}`;

const QUE_VAS_A_VER = [
  {
    Icon: Hammer,
    title: 'Una app real, de punta a punta',
    desc: 'Vas a ver cómo se construye una aplicación completa con IA, desde la idea hasta que funciona.',
  },
  {
    Icon: Sparkles,
    title: 'El método, no solo el resultado',
    desc: 'Cómo se le habla a la IA para que construya lo que necesitas, paso a paso.',
  },
  {
    Icon: MessageCircleQuestion,
    title: 'Preguntas en vivo',
    desc: 'Espacio para resolver tus dudas en el momento, sobre tu propio caso.',
  },
];

const PARA_QUIEN = [
  { Icon: Users2, label: 'Sin experiencia técnica previa' },
  { Icon: InfinityIcon, label: 'No importa tu rubro o industria' },
  { Icon: Wallet, label: 'Sin costo, sin compromiso' },
];

const QUE_PASA_DESPUES = [
  { num: '01', Icon: ClipboardCheck, title: 'Te anotas aquí arriba', desc: 'Nombre y WhatsApp, nada más.' },
  { num: '02', Icon: Send, title: 'Te llega el acceso al instante', desc: 'Te sumamos al grupo de WhatsApp donde se transmite.' },
  { num: '03', Icon: PartyPopper, title: 'Nos vemos el domingo', desc: '20 de septiembre, 10:00 am (hora de Perú), en vivo.' },
];

type EstadoForm = 'idle' | 'enviando' | 'exito' | 'error';

export default function DesarrollaConClaudePage() {
  const [nombre, setNombre] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [estado, setEstado] = React.useState<EstadoForm>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    setErrorMsg('');

    try {
      const res = await fetch('/api/masterclass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, whatsapp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Hubo un problema, intentá de nuevo.');
        setEstado('error');
        return;
      }

      setEstado('exito');
    } catch {
      setErrorMsg('Hubo un problema de conexión, intentá de nuevo.');
      setEstado('error');
    }
  };

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <a href="#inicio" className={styles.navLogo}>
          <img src="/images/smartchatix-logo.png" alt="SmartChatix" />
        </a>
        <a href="#inscribirme" className={styles.navCta}>
          Reservar mi lugar <ArrowRight size={15} />
        </a>
      </nav>

      {/* HERO */}
      <section id="inicio" className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.eyebrow}>Masterclass gratuita · En vivo</div>
            <h1 className={styles.heroTitle}>
              Desarrolla con <span className={styles.brandText}>Claude</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Construye tu primera app con IA en una sesión en vivo — sin saber programar.
            </p>
            <div className={styles.heroDateBadge}>
              <Calendar size={18} />
              Domingo 20 de septiembre · 10:00 am (hora de Perú)
            </div>

            <div className={styles.heroTrustRow}>
              <div className={styles.heroTrustItem}><CheckCircle2 size={16} /> 100% en vivo</div>
              <div className={styles.heroTrustItem}><CheckCircle2 size={16} /> Sin costo</div>
              <div className={styles.heroTrustItem}><CheckCircle2 size={16} /> Acceso al instante</div>
            </div>
          </div>

          <div id="inscribirme" className={styles.formCard}>
            {estado === 'exito' ? (
              <div className={styles.formSuccess}>
                <div className={styles.formSuccessIcon}><CheckCircle2 size={28} /></div>
                <h3>¡Listo, ya estás anotado!</h3>
                <p>En instantes te va a llegar un WhatsApp con el link para unirte al grupo donde se transmite la masterclass.</p>
                <a href={WHATSAPP_FALLBACK_HREF} target="_blank" rel="noopener noreferrer" className={styles.formSuccessCta}>
                  ¿No te llegó nada? Escribinos <ArrowRight size={15} />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>Reserva tu lugar gratis</h3>
                <p className={styles.formSubtitle}>Te mandamos el acceso directo a tu WhatsApp.</p>

                <div className={styles.formField}>
                  <label htmlFor="nombre">Tu nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre y apellido"
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="whatsapp">Tu WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="987 654 321"
                    required
                  />
                </div>

                {estado === 'error' && <p className={styles.formError}>{errorMsg}</p>}

                <button type="submit" className={styles.formSubmit} disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? 'Enviando…' : 'Quiero mi lugar'}
                  {estado !== 'enviando' && <ArrowRight size={17} />}
                </button>

                <p className={styles.formNote}>Te llega el acceso al grupo de WhatsApp al instante.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className={styles.videoSection}>
        <div className={styles.inner}>
          <div className={styles.videoCard}>
            <video
              className={styles.videoEl}
              src="https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/ai-build-lab-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <p className={styles.videoCaption}>Así se ve construir una app con IA, en vivo.</p>
        </div>
      </section>

      {/* QUÉ VAS A VER */}
      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>Qué vas a ver</div>
            <h2 className={styles.sectionTitle}>Una sesión, un resultado concreto.</h2>
          </div>
          <div className={styles.viewGrid}>
            {QUE_VAS_A_VER.map((item, i) => (
              <div key={i} className={styles.viewCard}>
                <div className={styles.viewCardIcon}><item.Icon size={20} /></div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.inner}>
          <div className={styles.forWhoGrid}>
            <div>
              <div className={styles.eyebrow} style={{ justifyContent: 'flex-start' }}>Para quién es</div>
              <h2 className={styles.sectionTitle} style={{ color: 'white', marginTop: '0.8rem' }}>
                Para cualquier persona<br />que quiera <span className={styles.brandText}>construir con IA.</span>
              </h2>
              <p className={styles.forWhoText} style={{ marginTop: '1.2rem' }}>
                No hace falta saber programar ni tener experiencia técnica. Si quieres entender de verdad qué se puede hacer hoy con IA para tu propio trabajo, esta sesión es para ti.
              </p>
            </div>
            <div className={styles.forWhoList}>
              {PARA_QUIEN.map((item, i) => (
                <div key={i} className={styles.forWhoItem}><item.Icon size={20} /> {item.label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ PASA DESPUÉS */}
      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>Qué pasa después de anotarte</div>
            <h2 className={styles.sectionTitle}>Tres pasos, nada más.</h2>
          </div>
          <div className={styles.stepsGrid}>
            {QUE_PASA_DESPUES.map((step) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>
          El domingo empezás a construir con <span className={styles.brandText}>IA</span>.
        </h2>
        <p className={styles.finalCtaText}>Cupo dentro del grupo de WhatsApp — reservá tu lugar ahora.</p>
        <a href="#inscribirme" className={styles.finalCtaBtn}>
          Quiero mi lugar <ArrowRight size={18} />
        </a>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SmartChatix · <a href="https://smartchatix.com">smartchatix.com</a></p>
      </footer>

      <WhatsAppFloatingButton message="Hola, quiero anotarme a la masterclass Desarrolla con Claude" />
    </div>
  );
}
