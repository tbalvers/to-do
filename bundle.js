/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const projects = [];
let toDoId = 0;
let projectId = 0;
let currentProject;
let mode = 'default';

function getToDoId() {
  toDoId += 1;
  return toDoId.toString();
}

function getProjectId() {
  projectId += 1;
  return projectId.toString();
}

function createToDo(
  title = 'To do',
  description = '',
  dueDate = '',
  priority = 'default',
  project = currentProject,
  id = getToDoId(),
  completion = false
) {
  return { project, title, description, dueDate, priority, id, completion };
}

function createProject(title = 'My Project', toDos = [], id = getProjectId()) {
  return { title, toDos, id };
}

function setCurrentProject(project) {
  currentProject = project;
}

function newProject(title) {
  setCurrentProject(createProject(title));
  projects.unshift(currentProject);
}

function newToDo(title, description, dueDate, priority) {
  currentProject.toDos.unshift(
    createToDo(title, description, dueDate, priority)
  );
}

function deleteProject(project) {
  projects.splice(projects.indexOf(project), 1);
}

function deleteToDo(toDo, project) {
  project.toDos.splice(toDo.indexOf(toDo), 1);
}

function renderSidebar() {
  const sidebar = document.querySelector('.projects');
  projects.forEach((project) => {
    const item = document.createElement('div');
    item.classList.add('project');
    item.id = project.id;
    if (project === currentProject) item.classList.add('current');
    item.textContent = project.title;
    sidebar.appendChild(item);
  });
}

function clearSidebar() {
  const sidebar = document.querySelector('.projects');
  while (sidebar.firstChild) {
    sidebar.removeChild(sidebar.firstChild);
  }
}

function renderTaskStack() {
  const stack = document.querySelector('.stack');
  currentProject.toDos.forEach((toDo) => {
    const item = document.createElement('div');
    item.classList.add('toDo');
    if (toDo.priority === true) item.classList.add('priority');
    item.id = `t${toDo.id}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    checkbox.checked = toDo.completion;
    if (toDo.completion) item.classList.add('complete');
    const title = document.createElement('div');
    title.textContent = toDo.title;
    title.classList.add('title');
    const dueDate = document.createElement('div');
    dueDate.textContent = `Due: ${toDo.dueDate}`;
    dueDate.classList.add('dueDate');
    stack.appendChild(item);
    item.appendChild(checkbox);
    item.appendChild(title);
    item.appendChild(dueDate);
  });
}

function clearTaskStack() {
  const stack = document.querySelector('.stack');
  while (stack.firstChild) {
    stack.removeChild(stack.firstChild);
  }
}

function refresh() {
  clearSidebar();
  renderSidebar();
  switchCurrentProjectListener();
  clearTaskStack();
  renderTaskStack();
  editTaskListener();
  clearProjectInput();
  taskCompletionListener();
  mode = 'default';
}

function addProjectListener() {
  const sidebarAdd = document.querySelector('#add_project');
  sidebarAdd.addEventListener('click', () => {
    newProject();
    refresh();
  });
}

function getProjectById(id) {
  for (let i = 0; i < projects.length; i += 1) {
    if (projects[i].id === id) {
      return projects[i];
    }
  }
  return 'not found';
}

function getTaskById(id) {
  for (let i = 0; i < currentProject.toDos.length; i += 1) {
    if (currentProject.toDos[i].id === id.replace('t', '')) {
      return currentProject.toDos[i];
    }
  }
  return 'not found';
}

function addTaskListener() {
  const taskAdd = document.querySelector('#add_task');
  taskAdd.addEventListener('click', () => {
    newToDo();
    refresh();
  });
}

function editProjectButtonListener() {
  const projectEdit = document.querySelector('#edit_project');
  const sidebar = document.querySelector('.sidebar');
  const projectsList = document.querySelector('.projects');
  projectEdit.addEventListener('click', () => {
    if (mode !== 'edit') {
      const title = document.createElement('input');
      title.type = 'text';
      title.id = 'currentProjectName';
      title.value = currentProject.title;
      title.autofocus = 'true';
      sidebar.insertBefore(title, projectsList);
      mode = 'edit';
      editProjectSubmitListener();
    }
  });
}

function editProjectSubmitListener() {
  const currentProjectName = document.querySelector('#currentProjectName');
  currentProjectName.addEventListener('keyup', (e) => {
    if (mode === 'edit' && e.key === 'Enter') {
      currentProject.title = currentProjectName.value;
      refresh();
    }
  });
}

function clearProjectInput() {
  const currentProjectName = document.querySelector('#currentProjectName');
  if (currentProjectName) {
    currentProjectName.remove();
  }
}

function switchCurrentProjectListener() {
  const sidebarProjects = document.querySelectorAll('.project');
  sidebarProjects.forEach((project) => {
    project.addEventListener('click', (e) => {
      setCurrentProject(getProjectById(e.target.id));
      refresh();
    });
  });
}

function editTask(task) {
  const main = document.querySelector('.main');
  const modal = document.createElement('form');
  modal.classList.add('modal');
  const title = document.createElement('input');
  title.type = 'text';
  title.value = task.title;
  const titleLabel = document.createElement('label');
  titleLabel.for = title;
  titleLabel.textContent = 'Title';
  const dueDate = document.createElement('input');
  dueDate.type = 'date';
  dueDate.value = task.dueDate;
  const dateLabel = document.createElement('label');
  dateLabel.for = dueDate;
  dateLabel.textContent = 'Due by';
  const priority = document.createElement('input');
  priority.type = 'checkbox';
  priority.checked = task.priority;
  const priorityLabel = document.createElement('label');
  priorityLabel.for = priority;
  priorityLabel.textContent = 'Make priority?';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Save';
  submit.id = 'saveTask';
  main.appendChild(modal);
  modal.appendChild(titleLabel);
  modal.appendChild(title);
  modal.appendChild(dateLabel);
  modal.appendChild(dueDate);
  modal.appendChild(priorityLabel);
  modal.appendChild(priority);
  modal.appendChild(submit);
  mode = 'edit';

  saveTaskListener(task, title, dueDate, priority);
}

function editTaskListener() {
  const stackTasks = document.querySelectorAll('.toDo');
  stackTasks.forEach((task) => {
    task.addEventListener('click', (e) => {
      if (e.target.className !== 'checkbox') {
        editTask(getTaskById(e.target.id));
      }
    });
  });
}

function taskCompletionListener() {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', (e) => {
      e.target.parentElement.classList.toggle('complete');
      const currentTask = getTaskById(e.target.parentElement.id);
      if (currentTask.completion === true) {
        currentTask.completion = false;
      } else {
        currentTask.completion = true;
      }
    });
  });
}

function saveTask(task, title, dueDate, priority) {
  task.title = title.value;
  task.dueDate = dueDate.value;
  task.priority = priority.checked;
  clearModal();
  refresh();
}

function saveTaskListener(task, title, dueDate, priority) {
  const saveButton = document.querySelector('#saveTask');
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveTask(task, title, dueDate, priority);
  });
}

function clearModal() {
  const modal = document.querySelector('.modal');
  const main = document.querySelector('.main');
  while (modal.firstChild) {
    modal.removeChild(modal.firstChild);
  }
  main.removeChild(modal);
}

newProject('Programming');
newToDo('Finish to-do list', '', '2023-05-09', true);
newToDo('Learn React', '', '2023-06-09', false);
newProject('Chores');
newToDo('Cook dinner', '', '2023-05-09', true);
newToDo('Take out trash', '', '2023-05-11', false);
newProject('Workout');
newToDo('Stationary Bike', '', '2023-05-09', true);
newToDo('Pullups', '', '2023-05-09', true);
renderSidebar();
renderTaskStack();
addProjectListener();
addTaskListener();
switchCurrentProjectListener();
editTaskListener();
editProjectButtonListener();
taskCompletionListener();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixRQUFRO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxhQUFhO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGlDQUFpQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVwb3MvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcHJvamVjdHMgPSBbXTtcbmxldCB0b0RvSWQgPSAwO1xubGV0IHByb2plY3RJZCA9IDA7XG5sZXQgY3VycmVudFByb2plY3Q7XG5sZXQgbW9kZSA9ICdkZWZhdWx0JztcblxuZnVuY3Rpb24gZ2V0VG9Eb0lkKCkge1xuICB0b0RvSWQgKz0gMTtcbiAgcmV0dXJuIHRvRG9JZC50b1N0cmluZygpO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9qZWN0SWQoKSB7XG4gIHByb2plY3RJZCArPSAxO1xuICByZXR1cm4gcHJvamVjdElkLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvRG8oXG4gIHRpdGxlID0gJ1RvIGRvJyxcbiAgZGVzY3JpcHRpb24gPSAnJyxcbiAgZHVlRGF0ZSA9ICcnLFxuICBwcmlvcml0eSA9ICdkZWZhdWx0JyxcbiAgcHJvamVjdCA9IGN1cnJlbnRQcm9qZWN0LFxuICBpZCA9IGdldFRvRG9JZCgpLFxuICBjb21wbGV0aW9uID0gZmFsc2Vcbikge1xuICByZXR1cm4geyBwcm9qZWN0LCB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBpZCwgY29tcGxldGlvbiB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0KHRpdGxlID0gJ015IFByb2plY3QnLCB0b0RvcyA9IFtdLCBpZCA9IGdldFByb2plY3RJZCgpKSB7XG4gIHJldHVybiB7IHRpdGxlLCB0b0RvcywgaWQgfTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VycmVudFByb2plY3QocHJvamVjdCkge1xuICBjdXJyZW50UHJvamVjdCA9IHByb2plY3Q7XG59XG5cbmZ1bmN0aW9uIG5ld1Byb2plY3QodGl0bGUpIHtcbiAgc2V0Q3VycmVudFByb2plY3QoY3JlYXRlUHJvamVjdCh0aXRsZSkpO1xuICBwcm9qZWN0cy51bnNoaWZ0KGN1cnJlbnRQcm9qZWN0KTtcbn1cblxuZnVuY3Rpb24gbmV3VG9Ebyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gIGN1cnJlbnRQcm9qZWN0LnRvRG9zLnVuc2hpZnQoXG4gICAgY3JlYXRlVG9Ebyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KVxuICApO1xufVxuXG5mdW5jdGlvbiBkZWxldGVQcm9qZWN0KHByb2plY3QpIHtcbiAgcHJvamVjdHMuc3BsaWNlKHByb2plY3RzLmluZGV4T2YocHJvamVjdCksIDEpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVUb0RvKHRvRG8sIHByb2plY3QpIHtcbiAgcHJvamVjdC50b0Rvcy5zcGxpY2UodG9Eby5pbmRleE9mKHRvRG8pLCAxKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU2lkZWJhcigpIHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpO1xuICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncHJvamVjdCcpO1xuICAgIGl0ZW0uaWQgPSBwcm9qZWN0LmlkO1xuICAgIGlmIChwcm9qZWN0ID09PSBjdXJyZW50UHJvamVjdCkgaXRlbS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgc2lkZWJhci5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyU2lkZWJhcigpIHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpO1xuICB3aGlsZSAoc2lkZWJhci5maXJzdENoaWxkKSB7XG4gICAgc2lkZWJhci5yZW1vdmVDaGlsZChzaWRlYmFyLmZpcnN0Q2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRhc2tTdGFjaygpIHtcbiAgY29uc3Qgc3RhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhY2snKTtcbiAgY3VycmVudFByb2plY3QudG9Eb3MuZm9yRWFjaCgodG9EbykgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3RvRG8nKTtcbiAgICBpZiAodG9Eby5wcmlvcml0eSA9PT0gdHJ1ZSkgaXRlbS5jbGFzc0xpc3QuYWRkKCdwcmlvcml0eScpO1xuICAgIGl0ZW0uaWQgPSBgdCR7dG9Eby5pZH1gO1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBjaGVja2JveC5jbGFzc0xpc3QuYWRkKCdjaGVja2JveCcpO1xuICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0b0RvLmNvbXBsZXRpb247XG4gICAgaWYgKHRvRG8uY29tcGxldGlvbikgaXRlbS5jbGFzc0xpc3QuYWRkKCdjb21wbGV0ZScpO1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0b0RvLnRpdGxlO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gICAgY29uc3QgZHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGR1ZURhdGUudGV4dENvbnRlbnQgPSBgRHVlOiAke3RvRG8uZHVlRGF0ZX1gO1xuICAgIGR1ZURhdGUuY2xhc3NMaXN0LmFkZCgnZHVlRGF0ZScpO1xuICAgIHN0YWNrLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIGl0ZW0uYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZHVlRGF0ZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhclRhc2tTdGFjaygpIHtcbiAgY29uc3Qgc3RhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhY2snKTtcbiAgd2hpbGUgKHN0YWNrLmZpcnN0Q2hpbGQpIHtcbiAgICBzdGFjay5yZW1vdmVDaGlsZChzdGFjay5maXJzdENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWZyZXNoKCkge1xuICBjbGVhclNpZGViYXIoKTtcbiAgcmVuZGVyU2lkZWJhcigpO1xuICBzd2l0Y2hDdXJyZW50UHJvamVjdExpc3RlbmVyKCk7XG4gIGNsZWFyVGFza1N0YWNrKCk7XG4gIHJlbmRlclRhc2tTdGFjaygpO1xuICBlZGl0VGFza0xpc3RlbmVyKCk7XG4gIGNsZWFyUHJvamVjdElucHV0KCk7XG4gIHRhc2tDb21wbGV0aW9uTGlzdGVuZXIoKTtcbiAgbW9kZSA9ICdkZWZhdWx0Jztcbn1cblxuZnVuY3Rpb24gYWRkUHJvamVjdExpc3RlbmVyKCkge1xuICBjb25zdCBzaWRlYmFyQWRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZF9wcm9qZWN0Jyk7XG4gIHNpZGViYXJBZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgbmV3UHJvamVjdCgpO1xuICAgIHJlZnJlc2goKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFByb2plY3RCeUlkKGlkKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAocHJvamVjdHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICByZXR1cm4gcHJvamVjdHNbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiAnbm90IGZvdW5kJztcbn1cblxuZnVuY3Rpb24gZ2V0VGFza0J5SWQoaWQpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50UHJvamVjdC50b0Rvcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChjdXJyZW50UHJvamVjdC50b0Rvc1tpXS5pZCA9PT0gaWQucmVwbGFjZSgndCcsICcnKSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRQcm9qZWN0LnRvRG9zW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJ25vdCBmb3VuZCc7XG59XG5cbmZ1bmN0aW9uIGFkZFRhc2tMaXN0ZW5lcigpIHtcbiAgY29uc3QgdGFza0FkZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGRfdGFzaycpO1xuICB0YXNrQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1RvRG8oKTtcbiAgICByZWZyZXNoKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZGl0UHJvamVjdEJ1dHRvbkxpc3RlbmVyKCkge1xuICBjb25zdCBwcm9qZWN0RWRpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlZGl0X3Byb2plY3QnKTtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaWRlYmFyJyk7XG4gIGNvbnN0IHByb2plY3RzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpO1xuICBwcm9qZWN0RWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAobW9kZSAhPT0gJ2VkaXQnKSB7XG4gICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICB0aXRsZS50eXBlID0gJ3RleHQnO1xuICAgICAgdGl0bGUuaWQgPSAnY3VycmVudFByb2plY3ROYW1lJztcbiAgICAgIHRpdGxlLnZhbHVlID0gY3VycmVudFByb2plY3QudGl0bGU7XG4gICAgICB0aXRsZS5hdXRvZm9jdXMgPSAndHJ1ZSc7XG4gICAgICBzaWRlYmFyLmluc2VydEJlZm9yZSh0aXRsZSwgcHJvamVjdHNMaXN0KTtcbiAgICAgIG1vZGUgPSAnZWRpdCc7XG4gICAgICBlZGl0UHJvamVjdFN1Ym1pdExpc3RlbmVyKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZWRpdFByb2plY3RTdWJtaXRMaXN0ZW5lcigpIHtcbiAgY29uc3QgY3VycmVudFByb2plY3ROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2N1cnJlbnRQcm9qZWN0TmFtZScpO1xuICBjdXJyZW50UHJvamVjdE5hbWUuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmIChtb2RlID09PSAnZWRpdCcgJiYgZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgIGN1cnJlbnRQcm9qZWN0LnRpdGxlID0gY3VycmVudFByb2plY3ROYW1lLnZhbHVlO1xuICAgICAgcmVmcmVzaCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyUHJvamVjdElucHV0KCkge1xuICBjb25zdCBjdXJyZW50UHJvamVjdE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3VycmVudFByb2plY3ROYW1lJyk7XG4gIGlmIChjdXJyZW50UHJvamVjdE5hbWUpIHtcbiAgICBjdXJyZW50UHJvamVjdE5hbWUucmVtb3ZlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3dpdGNoQ3VycmVudFByb2plY3RMaXN0ZW5lcigpIHtcbiAgY29uc3Qgc2lkZWJhclByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2plY3QnKTtcbiAgc2lkZWJhclByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcbiAgICBwcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNldEN1cnJlbnRQcm9qZWN0KGdldFByb2plY3RCeUlkKGUudGFyZ2V0LmlkKSk7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZGl0VGFzayh0YXNrKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnbW9kYWwnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICB0aXRsZS50eXBlID0gJ3RleHQnO1xuICB0aXRsZS52YWx1ZSA9IHRhc2sudGl0bGU7XG4gIGNvbnN0IHRpdGxlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICB0aXRsZUxhYmVsLmZvciA9IHRpdGxlO1xuICB0aXRsZUxhYmVsLnRleHRDb250ZW50ID0gJ1RpdGxlJztcbiAgY29uc3QgZHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGR1ZURhdGUudHlwZSA9ICdkYXRlJztcbiAgZHVlRGF0ZS52YWx1ZSA9IHRhc2suZHVlRGF0ZTtcbiAgY29uc3QgZGF0ZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgZGF0ZUxhYmVsLmZvciA9IGR1ZURhdGU7XG4gIGRhdGVMYWJlbC50ZXh0Q29udGVudCA9ICdEdWUgYnknO1xuICBjb25zdCBwcmlvcml0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIHByaW9yaXR5LnR5cGUgPSAnY2hlY2tib3gnO1xuICBwcmlvcml0eS5jaGVja2VkID0gdGFzay5wcmlvcml0eTtcbiAgY29uc3QgcHJpb3JpdHlMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIHByaW9yaXR5TGFiZWwuZm9yID0gcHJpb3JpdHk7XG4gIHByaW9yaXR5TGFiZWwudGV4dENvbnRlbnQgPSAnTWFrZSBwcmlvcml0eT8nO1xuICBjb25zdCBzdWJtaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgc3VibWl0LnR5cGUgPSAnc3VibWl0JztcbiAgc3VibWl0LnRleHRDb250ZW50ID0gJ1NhdmUnO1xuICBzdWJtaXQuaWQgPSAnc2F2ZVRhc2snO1xuICBtYWluLmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgbW9kYWwuYXBwZW5kQ2hpbGQodGl0bGVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kQ2hpbGQoZGF0ZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kQ2hpbGQoZHVlRGF0ZSk7XG4gIG1vZGFsLmFwcGVuZENoaWxkKHByaW9yaXR5TGFiZWwpO1xuICBtb2RhbC5hcHBlbmRDaGlsZChwcmlvcml0eSk7XG4gIG1vZGFsLmFwcGVuZENoaWxkKHN1Ym1pdCk7XG4gIG1vZGUgPSAnZWRpdCc7XG5cbiAgc2F2ZVRhc2tMaXN0ZW5lcih0YXNrLCB0aXRsZSwgZHVlRGF0ZSwgcHJpb3JpdHkpO1xufVxuXG5mdW5jdGlvbiBlZGl0VGFza0xpc3RlbmVyKCkge1xuICBjb25zdCBzdGFja1Rhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvRG8nKTtcbiAgc3RhY2tUYXNrcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG4gICAgdGFzay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lICE9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGVkaXRUYXNrKGdldFRhc2tCeUlkKGUudGFyZ2V0LmlkKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0YXNrQ29tcGxldGlvbkxpc3RlbmVyKCkge1xuICBjb25zdCBjaGVja2JveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoZWNrYm94Jyk7XG4gIGNoZWNrYm94ZXMuZm9yRWFjaCgoY2hlY2tib3gpID0+IHtcbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2NvbXBsZXRlJyk7XG4gICAgICBjb25zdCBjdXJyZW50VGFzayA9IGdldFRhc2tCeUlkKGUudGFyZ2V0LnBhcmVudEVsZW1lbnQuaWQpO1xuICAgICAgaWYgKGN1cnJlbnRUYXNrLmNvbXBsZXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgY3VycmVudFRhc2suY29tcGxldGlvbiA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudFRhc2suY29tcGxldGlvbiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzYXZlVGFzayh0YXNrLCB0aXRsZSwgZHVlRGF0ZSwgcHJpb3JpdHkpIHtcbiAgdGFzay50aXRsZSA9IHRpdGxlLnZhbHVlO1xuICB0YXNrLmR1ZURhdGUgPSBkdWVEYXRlLnZhbHVlO1xuICB0YXNrLnByaW9yaXR5ID0gcHJpb3JpdHkuY2hlY2tlZDtcbiAgY2xlYXJNb2RhbCgpO1xuICByZWZyZXNoKCk7XG59XG5cbmZ1bmN0aW9uIHNhdmVUYXNrTGlzdGVuZXIodGFzaywgdGl0bGUsIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gIGNvbnN0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2F2ZVRhc2snKTtcbiAgc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNhdmVUYXNrKHRhc2ssIHRpdGxlLCBkdWVEYXRlLCBwcmlvcml0eSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhck1vZGFsKCkge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbCcpO1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4nKTtcbiAgd2hpbGUgKG1vZGFsLmZpcnN0Q2hpbGQpIHtcbiAgICBtb2RhbC5yZW1vdmVDaGlsZChtb2RhbC5maXJzdENoaWxkKTtcbiAgfVxuICBtYWluLnJlbW92ZUNoaWxkKG1vZGFsKTtcbn1cblxubmV3UHJvamVjdCgnUHJvZ3JhbW1pbmcnKTtcbm5ld1RvRG8oJ0ZpbmlzaCB0by1kbyBsaXN0JywgJycsICcyMDIzLTA1LTA5JywgdHJ1ZSk7XG5uZXdUb0RvKCdMZWFybiBSZWFjdCcsICcnLCAnMjAyMy0wNi0wOScsIGZhbHNlKTtcbm5ld1Byb2plY3QoJ0Nob3JlcycpO1xubmV3VG9EbygnQ29vayBkaW5uZXInLCAnJywgJzIwMjMtMDUtMDknLCB0cnVlKTtcbm5ld1RvRG8oJ1Rha2Ugb3V0IHRyYXNoJywgJycsICcyMDIzLTA1LTExJywgZmFsc2UpO1xubmV3UHJvamVjdCgnV29ya291dCcpO1xubmV3VG9EbygnU3RhdGlvbmFyeSBCaWtlJywgJycsICcyMDIzLTA1LTA5JywgdHJ1ZSk7XG5uZXdUb0RvKCdQdWxsdXBzJywgJycsICcyMDIzLTA1LTA5JywgdHJ1ZSk7XG5yZW5kZXJTaWRlYmFyKCk7XG5yZW5kZXJUYXNrU3RhY2soKTtcbmFkZFByb2plY3RMaXN0ZW5lcigpO1xuYWRkVGFza0xpc3RlbmVyKCk7XG5zd2l0Y2hDdXJyZW50UHJvamVjdExpc3RlbmVyKCk7XG5lZGl0VGFza0xpc3RlbmVyKCk7XG5lZGl0UHJvamVjdEJ1dHRvbkxpc3RlbmVyKCk7XG50YXNrQ29tcGxldGlvbkxpc3RlbmVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=