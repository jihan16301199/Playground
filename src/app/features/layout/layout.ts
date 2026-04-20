import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit, AfterViewInit, OnDestroy {
  isMobile: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) { }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  headerHeight = 0;

  sidebarTop = '';

  contentMarginTop = '';
  contentMarginBottom = '';

  footerHeight = 0;

  @ViewChild('header') header!: ElementRef<HTMLDivElement>;
  @ViewChild('footer') footer!: ElementRef<HTMLDivElement>;

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
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  measure() {
    this.headerHeight = this.header.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;

    this.sidebarTop = `${this.headerHeight}px`;

    this.contentMarginTop = `${this.headerHeight}px`
    this.contentMarginBottom = `${this.footerHeight}px`

    this.cdr.detectChanges();
  }
}
