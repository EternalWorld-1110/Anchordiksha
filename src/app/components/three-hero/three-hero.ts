import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-hero',
  standalone: true,
  template: `<div #rendererContainer class="absolute inset-0 z-0 overflow-hidden"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `]
})
export class ThreeHero implements OnInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private abstractGroup!: THREE.Group;
  private animationId!: number;
  
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;

  ngOnInit() {
    if (this.isBrowser) {
      this.initThree();
      this.createStage();
      this.createParticles();
      this.createAbstractObjects();
      this.animate();
    }
  }

  private initThree() {
    try {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 7;

      // Optimizing renderer for compatibility and power usage
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: window.devicePixelRatio < 2, // Only antialias on low-DPI screens
        alpha: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false
      });

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      const container = this.rendererContainer.nativeElement;
      // Clear container just in case of multiple calls
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(this.renderer.domElement);

      // Handle context loss
      this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.warn('WebGL Context Lost - Stopping animation');
        if (this.animationId) {
          window.cancelAnimationFrame(this.animationId);
        }
      }, false);

      this.renderer.domElement.addEventListener('webglcontextrestored', () => {
        console.log('WebGL Context Restored - Re-initializing');
        this.initThree();
        this.animate();
      }, false);

    } catch (err) {
      console.error('Failed to initialize WebGL:', err);
    }
  }

  private createStage() {
    // Floor grid for depth
    const size = 30;
    const divisions = 30;
    const gridHelper = new THREE.GridHelper(size, divisions, 0xD4AF37, 0x222222);
    gridHelper.position.y = -4;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    this.scene.add(gridHelper);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Warm stage-like point light
    const pointLight = new THREE.PointLight(0xD4AF37, 3, 30);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    // Second cooler light for contrast
    const bluePointLight = new THREE.PointLight(0x4444ff, 1, 30);
    bluePointLight.position.set(-5, 0, 2);
    this.scene.add(bluePointLight);
  }

  private createAbstractObjects() {
    this.abstractGroup = new THREE.Group();
    this.scene.add(this.abstractGroup);

    const materials = [
      new THREE.MeshStandardMaterial({ 
        color: 0xD4AF37, 
        roughness: 0.1, 
        metalness: 0.8,
        flatShading: true,
        wireframe: false 
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.05, 
        roughness: 0,
        metalness: 1,
        flatShading: true 
      })
    ];

    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1.2, 0),
      new THREE.TorusGeometry(0.8, 0.05, 16, 100)
    ];

    for (let i = 0; i < 12; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geom, mat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      const scale = Math.random() * 0.6 + 0.2;
      mesh.scale.set(scale, scale, scale);
      
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015
        },
        floatOffset: Math.random() * Math.PI * 2
      };

      this.abstractGroup.add(mesh);
    }
  }

  private createParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 25;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xD4AF37,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private animate() {
    this.animationId = window.requestAnimationFrame(() => this.animate());

    // Dampened mouse movement parallax
    this.targetX += (this.mouseX - this.targetX) * 0.03;
    this.targetY += (this.mouseY - this.targetY) * 0.03;

    this.scene.rotation.y = this.targetX * 0.2;
    this.scene.rotation.x = this.targetY * 0.1;

    // Animate abstract objects with floating motion
    const time = Date.now() * 0.001;
    this.abstractGroup.children.forEach((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      mesh.rotation.x += mesh.userData['rotationSpeed'].x;
      mesh.rotation.y += mesh.userData['rotationSpeed'].y;
      mesh.rotation.z += mesh.userData['rotationSpeed'].z;
      
      mesh.position.y += Math.sin(time + mesh.userData['floatOffset']) * 0.003;
    });

    this.particles.rotation.y += 0.0003;
    this.particles.rotation.z += 0.0001;

    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;
    this.mouseX = (event.clientX / window.innerWidth) - 0.5;
    this.mouseY = (event.clientY / window.innerHeight) - 0.5;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isBrowser) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      if (this.animationId) {
        window.cancelAnimationFrame(this.animationId);
      }
      
      if (this.renderer) {
        // Clean up the scene graph
        if (this.scene) {
          this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
              if (object.geometry) {
                object.geometry.dispose();
              }
              
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            }
          });
        }

        // Dispose of properties explicitly
        if (this.particles && this.particles.geometry) {
          this.particles.geometry.dispose();
        }
        if (this.particles && this.particles.material) {
          (this.particles.material as THREE.Material).dispose();
        }

        this.renderer.dispose();
        
        // Remove from DOM
        if (this.renderer.domElement && this.renderer.domElement.parentElement) {
          this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }

        // Help GC
        (this.renderer as any) = null;
        (this.scene as any) = null;
        (this.camera as any) = null;
      }
    }
  }
}


