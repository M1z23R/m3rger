import {
  Component,
  HostListener,
  input,
  signal,
  NgZone,
  OnDestroy,
  output,
} from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-dnd-overlay',
  imports: [Icons],
  templateUrl: './dnd-overlay.html',
  styleUrl: './dnd-overlay.css',
})
export class DndOverlayComponent implements OnDestroy {
  filesDropped = output<File[]>();

  dragActive = signal(false);
  container = input.required<HTMLElement>();

  private dragStateSubject = new Subject<boolean>();
  private dragSubscription = this.dragStateSubject
    .pipe(debounceTime(10), distinctUntilChanged())
    .subscribe((state) => {
      this.ngZone.run(() => {
        this.dragActive.set(state);
      });
    });

  constructor(private ngZone: NgZone) { }

  @HostListener('document:dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();

    if (
      this.isEventInsideContainer(event) &&
      event.dataTransfer?.types.includes('Files')
    ) {
      this.dragStateSubject.next(true);
    }
  }

  @HostListener('document:dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();

    if (!this.isEventInsideContainer(event)) {
      this.dragStateSubject.next(false);
    }
  }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (this.isEventInsideContainer(event)) {
      event.preventDefault();
    }
  }

  @HostListener('document:drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragStateSubject.next(false);

    if (this.isEventInsideContainer(event)) {
      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length > 0) {
        this.filesDropped.emit(files);
      }
    }
  }

  @HostListener('document:dragend', ['$event'])
  onDragEnd(_event: DragEvent) {
    this.dragStateSubject.next(false);
  }

  private isEventInsideContainer(event: DragEvent): boolean {
    const el = this.container();
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }

  ngOnDestroy() {
    this.dragSubscription.unsubscribe();
  }
}

