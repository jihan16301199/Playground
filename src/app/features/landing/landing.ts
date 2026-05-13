import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {

  navScrolled = false;
  activePanel = 0;

  private dialValues = [67, 84, 100];
  get dialPercent() { return this.dialValues[this.activePanel]; }
  get dialOffset() {
    const circumference = 502;
    return circumference - (circumference * this.dialPercent) / 100;
  }

  private observer!: IntersectionObserver;
  private panelObserver!: IntersectionObserver;
  private _parallaxHandler?: () => void;

  // ─── Food slider ──────────────────────────────────────────────────────────────

  readonly foods = [
    { name: 'Grilled Salmon',  emoji: '🐟', cal: 412, protein: 46, carbs: 0,  fat: 24, bg: 'linear-gradient(145deg,#0d2c3a,#0a4a4a)' },
    { name: 'Avocado Bowl',    emoji: '🥑', cal: 380, protein: 8,  carbs: 22, fat: 34, bg: 'linear-gradient(145deg,#0c2410,#1c4a10)' },
    { name: 'Grilled Chicken', emoji: '🍗', cal: 285, protein: 53, carbs: 0,  fat: 6,  bg: 'linear-gradient(145deg,#2a1a0a,#5a300a)' },
    { name: 'Greek Yogurt',    emoji: '🫙', cal: 130, protein: 18, carbs: 11, fat: 0,  bg: 'linear-gradient(145deg,#0a1a2a,#103060)' },
    { name: 'Quinoa Salad',    emoji: '🥗', cal: 290, protein: 12, carbs: 48, fat: 8,  bg: 'linear-gradient(145deg,#0c2a0c,#2a5a1a)' },
    { name: 'Banana',          emoji: '🍌', cal: 89,  protein: 1,  carbs: 23, fat: 0,  bg: 'linear-gradient(145deg,#2a2000,#5a4800)' },
    { name: 'Omelette',        emoji: '🍳', cal: 320, protein: 22, carbs: 4,  fat: 22, bg: 'linear-gradient(145deg,#2a1e00,#5a3800)' },
    { name: 'Mixed Berries',   emoji: '🫐', cal: 70,  protein: 1,  carbs: 17, fat: 0,  bg: 'linear-gradient(145deg,#10083a,#3a0a5a)' },
  ];

  sliderIndex = 0;
  private readonly cardWidth = 280;
  private readonly cardGap = 24;

  get sliderOffset(): number {
    return -this.sliderIndex * (this.cardWidth + this.cardGap);
  }

  get maxSlide(): number {
    return Math.max(0, this.foods.length - 3);
  }

  slideCards(dir: number) {
    this.sliderIndex = Math.max(0, Math.min(this.maxSlide, this.sliderIndex + dir));
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────────

  @HostListener('window:scroll')
  onScroll() {
    this.navScrolled = window.scrollY > 40;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initScrollAnimations();
    this.initStickyShowcase();
    this.initCounters();
    this.initParallax();
  }

  private initScrollAnimations() {
    const animElements = document.querySelectorAll('[data-animate]');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset['delay'] || '0', 10);
            setTimeout(() => el.classList.add('is-visible'), delay);
            this.observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    animElements.forEach(el => this.observer.observe(el));
  }

  private initStickyShowcase() {
    const triggers = document.querySelectorAll('.showcase__trigger');

    this.panelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            this.activePanel = parseInt(el.dataset['panel'] || '0', 10);
          }
        });
      },
      { threshold: 0.5 }
    );

    triggers.forEach(el => this.panelObserver.observe(el));
  }

  private initCounters() {
    const counters = document.querySelectorAll('[data-animate="count-up"]');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const valueEl = el.querySelector('.metrics__item--value') as HTMLElement;
            if (!valueEl) return;
            const target = parseFloat(valueEl.dataset['target'] || '0');
            const delay = parseInt(el.dataset['delay'] || '0', 10);
            setTimeout(() => this.animateCounter(valueEl, target), delay);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  private animateCounter(el: HTMLElement, target: number) {
    const duration = 1400;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  private initParallax() {
    const section = document.querySelector('.parallax-section') as HTMLElement;
    const bg      = document.querySelector('.parallax-section__bg') as HTMLElement;
    const blurEl  = document.querySelector('.parallax-section__blur') as HTMLElement;
    const content = document.querySelector('.parallax-section__content') as HTMLElement;

    if (!section || !bg) return;

    // The bg div is 150vh tall; when fully translated it shows its bottom edge
    // aligned with the viewport bottom — that is the "freeze" position.
    const bgExcess = () => window.innerHeight * 0.5; // 150vh - 100vh = 50vh excess

    const reset = () => {
      bg.style.transform = 'translateY(0)';
      if (blurEl) { blurEl.style.backdropFilter = ''; blurEl.style.background = 'transparent'; }
      if (content) { content.style.opacity = '0'; content.style.transform = 'translateY(80px)'; }
    };

    this._parallaxHandler = () => {
      const rect = section.getBoundingClientRect();
      const scrolledIn = -rect.top;
      const sectionH   = section.offsetHeight;
      const vpH        = window.innerHeight;

      if (scrolledIn < 0) { reset(); return; }
      if (scrolledIn > sectionH) return;

      // ── Phase thresholds ──────────────────────────────────────────────────
      // Phase 1: bg translates so its bottom touches viewport bottom
      const p1End   = sectionH * 0.28;
      // Phase 2: backdrop blur + dark overlay builds
      const p2End   = sectionH * 0.50;
      // Phase 3: content rises from bottom
      const p3Start = sectionH * 0.45;
      const p3End   = sectionH * 0.62;

      // ── Phase 1: scroll image to reveal its bottom ────────────────────────
      const bgT = Math.min(1, scrolledIn / p1End);
      bg.style.transform = `translateY(${-(bgT * bgExcess()).toFixed(1)}px)`;

      // ── Phase 2: blur overlay ─────────────────────────────────────────────
      if (scrolledIn > p1End && blurEl) {
        const t2 = Math.min(1, Math.max(0, (scrolledIn - p1End) / (p2End - p1End)));
        const e2 = t2 * t2 * (3 - 2 * t2); // smoothstep
        blurEl.style.backdropFilter = `blur(${(e2 * 22).toFixed(1)}px)`;
        blurEl.style.background = `rgba(0,0,0,${(e2 * 0.52).toFixed(2)})`;
      } else if (blurEl && scrolledIn <= p1End) {
        blurEl.style.backdropFilter = '';
        blurEl.style.background = 'transparent';
      }

      // ── Phase 3: content slides up ────────────────────────────────────────
      if (content) {
        if (scrolledIn > p3Start) {
          const t3 = Math.min(1, Math.max(0, (scrolledIn - p3Start) / (p3End - p3Start)));
          const e3 = t3 * t3 * (3 - 2 * t3);
          content.style.opacity   = e3.toFixed(2);
          content.style.transform = `translateY(${((1 - e3) * 80).toFixed(1)}px)`;
        } else {
          content.style.opacity   = '0';
          content.style.transform = 'translateY(80px)';
        }
      }
    };

    window.addEventListener('scroll', this._parallaxHandler, { passive: true });
    this._parallaxHandler();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.panelObserver?.disconnect();
    if (this._parallaxHandler) {
      window.removeEventListener('scroll', this._parallaxHandler);
    }
  }
}
