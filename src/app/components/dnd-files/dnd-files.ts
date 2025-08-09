import { Component, computed, model } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDragPreview, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';


export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  icon: string;
  file: File
}


@Component({
  selector: 'app-dnd-files',
  imports: [CdkDragPreview, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './dnd-files.html',
  styleUrl: './dnd-files.css'
})
export class DndFiles {
  files = model.required<FileItem[]>();

  isEmpty = computed(() => this.files().length === 0);

  drop(event: CdkDragDrop<FileItem[]>) {
    const currentFiles = this.files();
    moveItemInArray(currentFiles, event.previousIndex, event.currentIndex);
    this.files.set([...currentFiles]);
  }

  onDelete(file: FileItem) {
    console.log('Delete file:', file);
    this.files.update(c => c.filter(x => x !== file))
  }

}
