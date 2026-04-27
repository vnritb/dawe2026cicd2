const INITIAL_TASKS = [
  { id: 1,  text: 'Crear el repositori a GitHub i obrir el Codespace',             tag: 'Part 1', done: false },
  { id: 2,  text: 'Configurar GitHub Pages i desplegar la versió estàtica',         tag: 'Part 1', done: false },
  { id: 3,  text: 'Configurar Docker Compose amb el contenidor web i la base de dades', tag: 'Part 2', done: false },
  { id: 4,  text: "Verificar l'entorn de desenvolupament al Codespace",             tag: 'Part 2', done: false },
  { id: 5,  text: 'Crear el workflow de GitHub Actions per al desplegament automàtic', tag: 'Part 3', done: false },
  { id: 6,  text: "Configurar els secrets del repositori per a l'accés a AWS",     tag: 'Part 3', done: false },
  { id: 7,  text: "Verificar el desplegament automàtic a l'EC2 d'AWS",             tag: 'Part 3', done: false },
  { id: 8,  text: "Fer un canvi a l'aplicació i comprovar el cicle CI/CD complet", tag: 'Part 4', done: false },
  { id: 9,  text: 'Crear un compte a GitHub',                                      tag: 'Prereq', done: true  },
  { id: 10, text: 'Instal·lar Visual Studio Code',                                 tag: 'Prereq', done: true  },
];

function loadTasks() {
  const saved = localStorage.getItem('dawe-tasks');
  return saved ? JSON.parse(saved) : INITIAL_TASKS.map(t => ({ ...t }));
}

function saveTasks(tasks) {
  localStorage.setItem('dawe-tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.done ? 'done' : 'pending'}`;
  li.dataset.id = task.id;
  li.title = task.done ? 'Fes clic per marcar com a pendent' : 'Fes clic per marcar com a solucionada';

  const status = document.createElement('span');
  status.className = `task-status ${task.done ? 'done-icon' : 'pending-icon'}`;
  status.textContent = task.done ? '✓' : '○';

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const tag = document.createElement('span');
  tag.className = `task-tag${task.done ? ' done-tag' : ''}`;
  tag.textContent = task.done ? 'Fet' : task.tag;

  li.append(status, text, tag);
  li.addEventListener('click', () => toggleTask(task.id));
  return li;
}

function renderTasks(tasks) {
  const pendingList = document.getElementById('pending-list');
  const doneList    = document.getElementById('done-list');
  const pendingH2   = document.getElementById('heading-pending');
  const doneH2      = document.getElementById('heading-done');

  pendingList.innerHTML = '';
  doneList.innerHTML    = '';

  const pending = tasks.filter(t => !t.done);
  const done    = tasks.filter(t =>  t.done);

  pending.forEach(t => pendingList.appendChild(createTaskElement(t)));
  done.forEach(t    => doneList.appendChild(createTaskElement(t)));

  pendingH2.textContent = `Tasques pendents (${pending.length})`;
  doneH2.textContent    = `Tasques completades (${done.length})`;
}

function toggleTask(id) {
  const tasks = loadTasks();
  const task  = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks(tasks);
    renderTasks(tasks);
  }
}

function addTask(text, tag) {
  const tasks   = loadTasks();
  const newTask = { id: Date.now(), text: text.trim(), tag, done: false };
  tasks.unshift(newTask);
  saveTasks(tasks);
  renderTasks(tasks);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks(loadTasks());

  const form  = document.querySelector('.task-form');
  const input = document.querySelector('.task-input');
  const select = document.querySelector('.task-tag-select');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text, select.value);
    input.value = '';
    input.focus();
  });
});
