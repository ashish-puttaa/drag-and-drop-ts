import { Component } from './base-component.component';
import { DragTarget } from '../interfaces/drag-drop.interface';
import { autobind } from '../decorators/autobind.decorator';
import { Project, ProjectStatus } from '../models/project.model';
import { projectState } from '../state/project.state';
import { ProjectItem } from './project-item.component';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
   assignedProjects: Project[];

   constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
   }

   @autobind
   dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
         event.preventDefault();
         const listEl = this.element.querySelector('ul')!;
         listEl.classList.add('droppable');
      }
   }

   @autobind
   dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
         projectId,
         this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
      );
   }

   @autobind
   dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
   }

   configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('drop', this.dropHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);

      projectState.addListener((projects: Project[]) => {
         const relevantProjects = projects.filter((project) => {
            if (this.type === 'active') return project.status === ProjectStatus.Active;
            return project.status === ProjectStatus.Finished;
         });

         this.assignedProjects = relevantProjects;
         this.renderProjects();
      });
   }

   renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
   }

   private renderProjects() {
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      listEl.innerHTML = '';

      for (const item of this.assignedProjects) {
         new ProjectItem(this.element.querySelector('ul')!.id, item);
      }
   }
}
