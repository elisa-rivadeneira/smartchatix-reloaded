'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroSmartchatix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuralNetworksRef = useRef<HTMLDivElement>(null);
  const floatingParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const particleContainer = floatingParticlesRef.current;

    if (!canvasEl || !particleContainer) return;

    const canvas = canvasEl;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mouseX = 0;
    let mouseY = 0;
    let nodes: any[] = [];
    let connections: any[] = [];
    let waves: any[] = [];
    let mouseSparkles: any[] = [];

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        for (let i = 0; i < 3; i++) {
          mouseSparkles.push(new MouseSparkle(mouseX, mouseY));
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    class MouseSparkle {
      x: number;
      y: number;
      size: number;
      life: number;
      decay: number;
      vx: number;
      vy: number;
      sparkleType: number;
      rotation: number;
      rotationSpeed: number;

      constructor(x: number, y: number) {
        this.x = x + (Math.random() - 0.5) * 30;
        this.y = y + (Math.random() - 0.5) * 30;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.sparkleType = Math.floor(Math.random() * 3);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      }

      update() {
        this.life -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.rotation += this.rotationSpeed;
        this.size *= 0.99;
      }

      draw() {
        if (!ctx || this.life <= 0) return;

        const alpha = this.life;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.sparkleType === 0) {
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? this.size * 2 : this.size;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.fill();
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(0, 191, 255, ${alpha})`;
          ctx.fill();
        } else if (this.sparkleType === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(138, 43, 226, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(138, 43, 226, ${alpha})`;
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(this.size, 0);
          ctx.moveTo(0, -this.size);
          ctx.lineTo(0, this.size);
          ctx.stroke();
        }

        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.size < 0.1;
      }
    }

    class Wave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
      colors: string[];
      colorIndex: number;
      lineWidth: number;

      constructor() {
        const isMobile = window.innerWidth <= 768;

        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.radius = 0;

        this.maxRadius = isMobile ?
          Math.random() * 300 + 150 :
          Math.random() * 200 + 100;

        this.speed = isMobile ?
          Math.random() * 0.5 + 0.2 :
          Math.random() * 0.8 + 0.3;

        this.opacity = isMobile ?
          Math.random() * 0.3 + 0.1 :
          Math.random() * 0.6 + 0.3;

        this.colors = isMobile ?
          ['#6B73FF', '#9F7AEA', '#68D391'] :
          ['#8A2BE2', '#FF0096', '#00BFFF'];

        this.colorIndex = Math.floor(Math.random() * this.colors.length);
        this.lineWidth = isMobile ? 1 : Math.random() * 2 + 1;
      }

      update() {
        this.radius += this.speed;
        this.opacity -= 0.002;

        const distToMouse = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        if (distToMouse < 200) {
          this.radius += 0.3;
          this.opacity += 0.005;
          this.lineWidth = Math.min(this.lineWidth + 0.1, 4);
        }

        if (this.radius > this.maxRadius || this.opacity <= 0) {
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
          this.radius = 0;
          this.opacity = Math.random() * 0.6 + 0.3;
          this.colorIndex = Math.floor(Math.random() * this.colors.length);
          this.lineWidth = Math.random() * 2 + 1;
        }
      }

      draw() {
        if (!ctx) return;
        const color = this.colors[this.colorIndex];

        for (let i = 3; i >= 1; i--) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          const alpha = (this.opacity * 0.2 / i).toFixed(2);
          ctx.strokeStyle = color + alpha.replace('0.', '').padStart(2, '0');
          ctx.lineWidth = this.lineWidth * i;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color + Math.floor(this.opacity * 150).toString(16).padStart(2, '0');
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
      }
    }

    class NeuralNode {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
      vx: number;
      vy: number;
      radius: number;
      activity: number;
      pulseSpeed: number;
      wanderAngle: number;
      wanderSpeed: number;
      wanderRadius: number;
      colors: string[];
      colorIndex: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = Math.random() * 4 + 6;
        this.activity = Math.random();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderSpeed = Math.random() * 0.02 + 0.005;
        this.wanderRadius = Math.random() * 50 + 30;
        this.colors = ['#8A2BE2', '#FF0096', '#00BFFF'];
        this.colorIndex = Math.floor(Math.random() * this.colors.length);
      }

      update() {
        this.activity += this.pulseSpeed;
        if (this.activity > 1) this.activity = 0;

        this.wanderAngle += this.wanderSpeed;

        const targetX = this.originalX + Math.cos(this.wanderAngle) * this.wanderRadius;
        const targetY = this.originalY + Math.sin(this.wanderAngle) * this.wanderRadius;

        this.vx += (targetX - this.x) * 0.002;
        this.vy += (targetY - this.y) * 0.002;

        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx;
        this.y += this.vy;

        const isMobile = window.innerWidth <= 768;
        const margin = isMobile ? 10 : 30;

        if (this.x < margin) { this.x = margin; this.vx *= -1; }
        if (this.x > canvas.width - margin) { this.x = canvas.width - margin; this.vx *= -1; }
        if (this.y < margin) { this.y = margin; this.vy *= -1; }
        if (this.y > canvas.height - margin) { this.y = canvas.height - margin; this.vy *= -1; }

        const distToMouse = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        if (distToMouse < 150) {
          this.activity = Math.min(this.activity + 0.02, 1);
          this.radius = Math.min(this.radius + 0.1, 12);

          const attractionForce = 0.005;
          this.vx += (mouseX - this.x) * attractionForce;
          this.vy += (mouseY - this.y) * attractionForce;
        } else {
          this.radius = Math.max(this.radius - 0.05, 6);
        }
      }

      draw() {
        if (!ctx) return;
        const color = this.colors[this.colorIndex];
        const intensity = this.activity;

        for (let i = 3; i >= 1; i--) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * i, 0, Math.PI * 2);
          ctx.fillStyle = color + Math.floor(intensity * 40 / i).toString(16).padStart(2, '0');
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(intensity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
        ctx.fill();
      }
    }

    class NeuralConnection {
      nodeA: any;
      nodeB: any;
      strength: number;
      dataFlow: number;
      flowSpeed: number;
      colors: string[];
      colorIndex: number;

      constructor(nodeA: any, nodeB: any) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.strength = Math.random() * 0.8 + 0.2;
        this.dataFlow = 0;
        this.flowSpeed = Math.random() * 0.02 + 0.01;
        this.colors = ['#8A2BE2', '#FF0096', '#00BFFF'];
        this.colorIndex = Math.floor(Math.random() * this.colors.length);
      }

      update() {
        this.dataFlow += this.flowSpeed;
        if (this.dataFlow > 1) this.dataFlow = 0;

        const avgActivity = (this.nodeA.activity + this.nodeB.activity) / 2;
        this.strength = avgActivity * 0.8 + 0.2;
      }

      draw() {
        if (!ctx) return;
        const color = this.colors[this.colorIndex];

        ctx.beginPath();
        ctx.moveTo(this.nodeA.x, this.nodeA.y);
        ctx.lineTo(this.nodeB.x, this.nodeB.y);
        ctx.strokeStyle = color + Math.floor(this.strength * 60).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.stroke();

        const flowX = this.nodeA.x + (this.nodeB.x - this.nodeA.x) * this.dataFlow;
        const flowY = this.nodeA.y + (this.nodeB.y - this.nodeA.y) * this.dataFlow;

        ctx.beginPath();
        ctx.arc(flowX, flowY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.strength * 0.8})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
      }
    }

    function initializeNetwork() {
      nodes = [];
      connections = [];
      waves = [];

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const numWaves = 4;
        for (let i = 0; i < numWaves; i++) {
          waves.push(new Wave());
        }
      } else {
        const numNodes = 25;
        const margin = 50;

        for (let i = 0; i < numNodes; i++) {
          const x = Math.random() * (canvas.width - margin * 2) + margin;
          const y = Math.random() * (canvas.height - margin * 2) + margin;
          nodes.push(new NeuralNode(x, y));
        }

        nodes.forEach((nodeA: any, indexA: number) => {
          let connectionCount = 0;
          const maxConnections = Math.floor(Math.random() * 4) + 3;

          nodes.forEach((nodeB: any, indexB: number) => {
            if (indexA !== indexB && connectionCount < maxConnections) {
              const distance = Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);

              if (distance < 300 && Math.random() > 0.5) {
                const exists = connections.some((conn: any) =>
                  (conn.nodeA === nodeA && conn.nodeB === nodeB) ||
                  (conn.nodeA === nodeB && conn.nodeB === nodeA)
                );

                if (!exists) {
                  connections.push(new NeuralConnection(nodeA, nodeB));
                  connectionCount++;
                }
              }
            }
          });
        });

        const numWaves = 6;
        for (let i = 0; i < numWaves; i++) {
          waves.push(new Wave());
        }
      }
    }

    function createParticle() {
      if (!particleContainer) return;
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.bottom = '-10px';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 8 + 8) + 's';

      particleContainer.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 12000);
    }

    let reconnectionTimer = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isMobile = window.innerWidth <= 768;

      waves.forEach((wave: any) => {
        wave.update();
        wave.draw();
      });

      if (!isMobile) {
        connections.forEach((connection: any) => {
          connection.update();
          connection.draw();
        });

        nodes.forEach((node: any) => {
          node.update();
          node.draw();
        });
      }

      if (!isMobile) {
        mouseSparkles.forEach((sparkle: any, index: number) => {
          sparkle.update();
          sparkle.draw();

          if (sparkle.isDead()) {
            mouseSparkles.splice(index, 1);
          }
        });
      }

      if (mouseSparkles.length > 50) {
        mouseSparkles.splice(0, mouseSparkles.length - 50);
      }

      reconnectionTimer++;
      if (reconnectionTimer > 180) {
        reconnectionTimer = 0;
        reorganizeNetwork();
      }

      requestAnimationFrame(animate);
    }

    function reorganizeNetwork() {
      const connectionsToRemove = Math.floor(connections.length * 0.2);
      for (let i = 0; i < connectionsToRemove; i++) {
        const randomIndex = Math.floor(Math.random() * connections.length);
        connections.splice(randomIndex, 1);
      }

      const newConnectionsCount = connectionsToRemove + Math.floor(Math.random() * 5);
      for (let i = 0; i < newConnectionsCount; i++) {
        const nodeA = nodes[Math.floor(Math.random() * nodes.length)];
        const nodeB = nodes[Math.floor(Math.random() * nodes.length)];

        if (nodeA !== nodeB) {
          const distance = Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);

          if (distance < 350) {
            const exists = connections.some((conn: any) =>
              (conn.nodeA === nodeA && conn.nodeB === nodeB) ||
              (conn.nodeA === nodeB && conn.nodeB === nodeA)
            );

            if (!exists) {
              connections.push(new NeuralConnection(nodeA, nodeB));
            }
          }
        }
      }
    }

    const handleResize = () => {
      resizeCanvas();
      setTimeout(() => {
        initializeNetwork();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      initializeNetwork();
      animate();
    }, 100);

    const particleInterval = setInterval(createParticle, 800);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: white;
        }

        .hero-animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f23 50%, #000014 100%);
          overflow: hidden;
        }

        #heroCanvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .neural-networks {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .hero-animated-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(30, 41, 59, 0.1));
          z-index: 3;
        }

        :global(.particle) {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(138, 43, 226, 1) 30%, rgba(0, 191, 255, 0.8) 70%, transparent 100%);
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
          opacity: 0.9;
          box-shadow:
            0 0 6px rgba(255, 255, 255, 0.8),
            0 0 12px rgba(138, 43, 226, 0.6),
            0 0 18px rgba(0, 191, 255, 0.4);
        }

        :global(.particle::before) {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: particleGlow 2s ease-in-out infinite alternate;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
            transform: scale(1) rotate(90deg);
          }
          85% {
            opacity: 0.9;
            transform: scale(1.2) rotate(270deg);
          }
          100% {
            transform: translateY(-100px) translateX(300px) scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes particleGlow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          padding: 0 2rem;
          z-index: 10;
          position: relative;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero-highlight {
          background: linear-gradient(135deg, #e79907, #fffef9);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          opacity: 0.95;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-content {
            padding: 0 1rem;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-animated-background">
          <canvas ref={canvasRef} id="heroCanvas"></canvas>
          <div ref={neuralNetworksRef} className="neural-networks"></div>
          <div ref={floatingParticlesRef} className="floating-particles"></div>
        </div>
        <div className="hero-animated-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Trabaja mejor con{' '}
            <span className="hero-highlight">inteligencia</span>
          </h1>
          <p className="hero-subtitle">
            Aprende a usar la IA para recuperar horas de tu día, tomar mejores decisiones y evolucionar profesionalmente.
          </p>
          <div className="hero-buttons">
            <a href="#cursos" className="btn btn-primary">Descubre tu ruta de aprendizaje</a>
            <a href="#quien-eres" className="btn btn-secondary">¿Quién eres?</a>
          </div>
        </div>
      </section>
    </>
  );
}
