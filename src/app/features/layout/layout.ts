import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit, AfterViewInit, OnDestroy {
  isMobile: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) { }

  flag = true;
  isOpen = false;
  startY = 0;
  currentY = 0;

  headerHeight = 0;

  contentMarginTop = '';
  contentMarginBottom = '';

  swipeBottom = '';

  handleHeight = 0;
  partialHeight = 0;

  restHeight = 0;
  restMarginBottom = '';

  actionHeight = 0;
  actionBottom = '';

  footerHeight = 0;

  transform = '';
  isDragging = false;
  isScrollDisable = false;

  @ViewChild('header') header!: ElementRef<HTMLDivElement>;
  @ViewChild('footer') footer!: ElementRef<HTMLDivElement>;

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

  toggle() {
    this.flag = !this.flag; 3
    console.log(this.flag);
  }

  measure() {
    this.headerHeight = this.header.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;

    this.handleHeight = this.handle.nativeElement.offsetHeight;
    this.partialHeight = this.partial.nativeElement.offsetHeight;
    this.restHeight = this.rest.nativeElement.offsetHeight;
    this.actionHeight = this.action.nativeElement.offsetHeight;

    this.contentMarginTop = `${this.headerHeight}px`
    this.contentMarginBottom = `${this.handleHeight + this.partialHeight + this.actionHeight + this.footerHeight}px`

    this.swipeBottom = `${this.actionHeight + this.footerHeight}px`;
    this.actionBottom = `${this.footerHeight}px`;

    this.restMarginBottom = `${this.actionHeight}px`
    console.log(this.handleHeight, this.partialHeight, this.restHeight, this.actionHeight, this.footerHeight)

    this.transform = `translateY(calc(100% - ${this.handleHeight + this.partialHeight}px))`;
    this.cdr.detectChanges();
  }


  open() {
    this.isOpen = true;
    this.isScrollDisable = true;
    this.transform = 'translateY(0)';
  }

  close() {
    this.isOpen = false;
    this.isScrollDisable = false;
    this.measure();
  }

  onStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onMove(event: TouchEvent) {
    if (!this.isDragging) return;

    this.isScrollDisable = true;

    this.currentY = event.touches[0].clientY - this.startY;
    if (this.currentY > 0) {
      this.transform = `translateY(${this.currentY}px)`;
    } else {
      this.transform = `translateY()`;
      // this.transform = `translateY(calc(100% - ${this.partialHeight + this.handleHeight + this.actionHeight - this.currentY}px))`;
    }
  }

  onEnd() {
    this.isDragging = false;

    if (this.currentY > (this.restHeight < 120 ? this.restHeight : 120)) {
      this.close();
    } else {
      this.open();
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
    if (this.currentY > 0) {
      this.transform = `translateY(${this.currentY}px)`;
    }
  }

  onMouseEnd() {
    if (!this.isDragging) return;
    this.onEnd();
  }

}
