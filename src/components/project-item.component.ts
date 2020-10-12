import { Component } from './base-component.component';
import { Draggable } from '../interfaces/drag-drop.interface';
import { autobind } from '../decorators/autobind.decorator';
import { Project } from '../models/project.model';

// ProjectItem Class

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
   private project: Project;

   get persons() {
      if (this.project.people === 1) {
         return '1 person';
      } else {
         return `${this.project.people} persons`;
      }
   }

   constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;

      this.configure();
      this.renderContent();
   }

   @autobind
   dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.project.id);
      event.dataTransfer!.effectAllowed = 'move';
   }

   dragEndHandler(_: DragEvent) {
      console.log('drag End');
   }

   configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
   }

   renderContent() {
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
      this.element.querySelector('p')!.textContent = this.project.description;
   }
}
