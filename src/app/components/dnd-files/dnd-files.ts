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

  getFileTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'pdf': 'bg-red-500',
      'xlsx': 'bg-green-500',
      'docx': 'bg-blue-500',
      'pptx': 'bg-orange-500',
      'png': 'bg-purple-500',
      'jpg': 'bg-purple-500',
      'json': 'bg-gray-500',
      'txt': 'bg-gray-600',
      'default': 'bg-gray-400'
    };
    return typeClasses[type] || typeClasses['default'];
  }

  onDelete(file: FileItem) {
    console.log('Delete file:', file);
    this.files.update(c => c.filter(x => x !== file))
  }

}
