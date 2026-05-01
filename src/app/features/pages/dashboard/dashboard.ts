import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  isMobile: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) { }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  tempflag= false;

  toggle() {
    this.tempflag = !this.tempflag;
  }

  isOpen = false;
  isDragging = false;
  startY = 0;
  currentY = 0;
  threshold = 0;
  limit = 0;
  transform = '';

  contentMarginBottom = '';

  swipeBottom = '';

  handleHeight = 0;
  partialHeight = 0;

  restHeight = 0;

  actionHeight = 0;
  actionBottom = '';

  footerHeight = 72;

  @ViewChild('handle') handle!: ElementRef<HTMLDivElement>;
  @ViewChild('partial') partial!: ElementRef<HTMLDivElement>;
  @ViewChild('rest') rest!: ElementRef<HTMLDivElement>;
  @ViewChild('action') action!: ElementRef<HTMLDivElement>;

  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    // this.breakpointObserver
    //   .observe([Breakpoints.Handset])
    //   .subscribe((state: BreakpointState) => {
    //     this.isMobile = state.matches;
    //   });
    // setTimeout(() => {
    //   this.measure();
    // }, 50);
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    this.measure();

    this.resizeObserver = new ResizeObserver(() => {
      this.measure();
    });

    this.resizeObserver.observe(this.partial.nativeElement);
    this.resizeObserver.observe(this.rest.nativeElement);
    this.resizeObserver.observe(this.action.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  measure() {
    this.handleHeight = this.handle.nativeElement.offsetHeight;
    this.partialHeight = this.partial.nativeElement.offsetHeight;
    this.restHeight = this.rest.nativeElement.offsetHeight;
    this.actionHeight = this.action.nativeElement.offsetHeight;

    this.contentMarginBottom = `${this.handleHeight + this.partialHeight + this.actionHeight}px`

    this.swipeBottom = `${this.actionHeight + this.footerHeight}px`;
    this.actionBottom = `${this.footerHeight}px`;

    this.threshold = this.restHeight * 0.40;
    this.limit = this.restHeight;

    this.transform = `translateY(calc(100% - ${this.handleHeight + this.partialHeight}px))`;
    this.cdr.detectChanges();
  }


  open() {
    this.isOpen = true;
    this.transform = 'translateY(0)';
  }

  close() {
    this.isOpen = false;
    this.measure();
  }

  onStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onMove(event: TouchEvent) {
    if (!this.isDragging) return;

    this.currentY = event.touches[0].clientY - this.startY;
    // Prevent dragging in wrong direction
    if ((!this.isOpen && this.currentY > 0) || (this.isOpen && this.currentY < 0)) {
      return;
    }
    // Constrain movement within limits
    this.currentY = Math.max(-this.limit, Math.min(this.currentY, this.limit));

    if (this.currentY > 0) {
      this.transform = `translateY(${this.currentY}px)`;
    } else {
      this.transform = `translateY(calc(100% - ${this.partialHeight + this.handleHeight - this.currentY}px))`;
    }
  }

  onEnd() {
    this.isDragging = false;

    if (this.isOpen) {
      if (this.currentY > this.threshold) {
        this.close();
      } else {
        this.open();
      }
    } else {
      if (this.currentY < -this.threshold) {
        this.open();
      } else {
        this.close();
      }
    }

    this.currentY = 0;
  }

  // Desktop support
  onMouseStart(event: MouseEvent) {
    this.startY = event.clientY;
    this.isDragging = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    this.currentY = event.clientY - this.startY;
    // Prevent dragging in wrong direction
    if ((!this.isOpen && this.currentY > 0) || (this.isOpen && this.currentY < 0)) {
      return;
    }

    // Constrain movement within limits
    this.currentY = Math.max(-this.limit, Math.min(this.currentY, this.limit));

    if (this.currentY > 0) {
      this.transform = `translateY(${this.currentY}px)`;
    } else {
      this.transform = `translateY(calc(100% - ${this.partialHeight + this.handleHeight - this.currentY}px))`;
    }
  }

  onMouseEnd() {
    if (!this.isDragging) return;
    this.onEnd();
  }

}
