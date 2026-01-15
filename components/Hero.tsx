import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Store refs for cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const segmentsRef = useRef<THREE.Group[]>([]);

  // Virtual scroll position for tunnel animation (not actual page scroll)
  const virtualScrollRef = useRef(0);
  const [tunnelComplete, setTunnelComplete] = useState(false);

  // --- CONFIGURATION ---
  const TUNNEL_WIDTH = 24;
  const TUNNEL_HEIGHT = 16;
  const SEGMENT_DEPTH = 6;
  const NUM_SEGMENTS = 14;
  const SCROLL_SPEED = 1.5; // Multiplier for wheel delta

  // Grid Divisions
  const FLOOR_COLS = 6;
  const WALL_ROWS = 4;

  // Derived dimensions
  const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
  const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

  // Camera bounds
  const MAX_CAM_Z = -(NUM_SEGMENTS * SEGMENT_DEPTH - SEGMENT_DEPTH * 2); // -72
  const SCROLL_NEEDED = Math.abs(MAX_CAM_Z) / 0.05; // Virtual scroll needed to complete tunnel

  // Local images from img folder (repeated to match 14 images)
  const imageUrls = [
    "/img/n8n3.png",
    "/img/dashboard1.jpg",
    "/img/n8n4.png",
    "/img/n8n5.png",
    "/img/dashboard2.png",
    "/img/n8n2.png",
    "/img/dashboard3.png",
    "/img/n8n5.png",
    "/img/dashboard4.png",
    "/img/n8n4.png",
    "/img/n8n1.png",
    "/img/n8n2.png",
    "/img/dashboard3.png",
    "/img/n8n3.png",
    "/img/dashboard2.png",
    "/img/n8n4.png",
    "/img/n8n5.png",
    "/img/n8n6.png",
    "/img/dashboard4.png",
    "/img/n8n7.png",
    "/img/dashboard1.jpg",
    "/img/n8n1.png",
    "/img/dashboard2.png",
    "/img/n8n7.png",
    "/img/dashboard3.png",
    "/img/n8n4.png",
    "/img/n8n6.png",
  ];

  // Helper: Create a segment with grid lines and filled cells
  const createSegment = (zPos: number) => {
    const group = new THREE.Group();
    group.position.z = zPos;

    const w = TUNNEL_WIDTH / 2;
    const h = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;

    // Purple-tinted grid lines for dark theme
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.4 });
    const lineGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];

    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + (i * COL_WIDTH);
      vertices.push(x, -h, 0, x, -h, -d);
      vertices.push(x, h, 0, x, h, -d);
    }
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + (i * ROW_HEIGHT);
      vertices.push(-w, y, 0, -w, y, -d);
      vertices.push(w, y, 0, w, y, -d);
    }

    vertices.push(-w, -h, 0, w, -h, 0);
    vertices.push(-w, h, 0, w, h, 0);
    vertices.push(-w, -h, 0, -w, h, 0);
    vertices.push(w, -h, 0, w, h, 0);

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    group.add(lines);

    populateImages(group, w, h, d);

    return group;
  };

  // Helper: Populate images in a segment
  const populateImages = (group: THREE.Group, w: number, h: number, d: number) => {
    const textureLoader = new THREE.TextureLoader();
    const cellMargin = 0.4;

    const addImg = (pos: THREE.Vector3, rot: THREE.Euler, wd: number, ht: number) => {
      const url = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      const geom = new THREE.PlaneGeometry(wd - cellMargin, ht - cellMargin);
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
      textureLoader.load(url, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        mat.map = tex;
        mat.needsUpdate = true;
        gsap.to(mat, { opacity: 0.85, duration: 1 });
      });
      const m = new THREE.Mesh(geom, mat);
      m.position.copy(pos);
      m.rotation.copy(rot);
      m.name = "slab_image";
      group.add(m);
    };

    // Floor
    let lastFloorIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (i > lastFloorIdx + 1) {
        if (Math.random() > 0.80) {
          addImg(new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2), new THREE.Euler(-Math.PI / 2, 0, 0), COL_WIDTH, d);
          lastFloorIdx = i;
        }
      }
    }

    // Ceiling
    let lastCeilIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (i > lastCeilIdx + 1) {
        if (Math.random() > 0.88) {
          addImg(new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2), new THREE.Euler(Math.PI / 2, 0, 0), COL_WIDTH, d);
          lastCeilIdx = i;
        }
      }
    }

    // Left Wall
    let lastLeftIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastLeftIdx + 1) {
        if (Math.random() > 0.80) {
          addImg(new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2), new THREE.Euler(0, Math.PI / 2, 0), d, ROW_HEIGHT);
          lastLeftIdx = i;
        }
      }
    }

    // Right Wall
    let lastRightIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastRightIdx + 1) {
        if (Math.random() > 0.80) {
          addImg(new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2), new THREE.Euler(0, -Math.PI / 2, 0), d, ROW_HEIGHT);
          lastRightIdx = i;
        }
      }
    }
  };

  // Wheel handler for scroll-locking
  const handleWheel = useCallback((e: WheelEvent) => {
    const heroRect = containerRef.current?.getBoundingClientRect();
    if (!heroRect) return;

    const isInHeroView = heroRect.top <= 0 && heroRect.bottom > 0;

    // If scrolling down and tunnel not complete and we're in hero view
    if (e.deltaY > 0 && !tunnelComplete && isInHeroView) {
      e.preventDefault();
      virtualScrollRef.current = Math.min(
        virtualScrollRef.current + e.deltaY * SCROLL_SPEED,
        SCROLL_NEEDED
      );

      // Check if tunnel is complete
      if (virtualScrollRef.current >= SCROLL_NEEDED) {
        setTunnelComplete(true);
      }
    }
    // If scrolling up and we're at top of page (came back from next section)
    else if (e.deltaY < 0 && window.scrollY <= 1 && tunnelComplete) {
      e.preventDefault();
      setTunnelComplete(false);
      virtualScrollRef.current = SCROLL_NEEDED - 10; // Start from near end
    }
    // If scrolling up and tunnel was in progress
    else if (e.deltaY < 0 && !tunnelComplete && isInHeroView && virtualScrollRef.current > 0) {
      e.preventDefault();
      virtualScrollRef.current = Math.max(
        virtualScrollRef.current + e.deltaY * SCROLL_SPEED,
        0
      );
    }
  }, [tunnelComplete, SCROLL_NEEDED, SCROLL_SPEED]);

  // --- INITIAL SETUP ---
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // THREE JS SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Generate segments
    const segments: THREE.Group[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const z = -i * SEGMENT_DEPTH;
      const segment = createSegment(z);
      scene.add(segment);
      segments.push(segment);
    }
    segmentsRef.current = segments;

    // Animation Loop
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      // Calculate target Z from virtual scroll
      const rawTargetZ = -virtualScrollRef.current * 0.05;
      const targetZ = Math.max(rawTargetZ, MAX_CAM_Z);
      const clampedTargetZ = Math.min(targetZ, 0);

      const currentZ = cameraRef.current.position.z;
      cameraRef.current.position.z += (clampedTargetZ - currentZ) * 0.1;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  // Wheel event listener
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Text Entrance Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.5 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div ref={contentRef} className="text-center flex flex-col items-center max-w-4xl px-6 pointer-events-auto">

          <h1 className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[1.1] font-bold tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-gray-500">Automation</span><br></br>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-gray-500">
              for Business
            </span>
          </h1>

          <p className="text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-10 text-gray-400">
            Delphi delivers comprehensive AI automation services using <span className="text-purple-400 font-medium">n8n workflows</span>, custom dashboards, and intelligent CRMs to scale your business.
          </p>

          <div className="flex items-center gap-6">
            <button className="rounded-full px-8 py-3.5 text-sm font-medium hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25">
              Start Automating
            </button>
            <button className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1 text-white">
              View Services <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
