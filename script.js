const containers = document.querySelectorAll(".list-container");
const deleteDo = document.querySelector(".delete");
const input = document.querySelector("input");
const doTemplate = document.querySelector("template");
alert('This page will only work on desktop browsers');
document.body.addEventListener("dragover", function (e) {
  e.preventDefault();
});
function drag() {
  var draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      saveTasks();
    });
    var dragging;
    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        container.classList.add("active");
        dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
          container.appendChild(dragging);
        } else {
          container.insertBefore(dragging, afterElement);
        }
      });
    });
    function deleteThis(e) {
      e.preventDefault();
      deleteDo.classList.add("active");
      deleteDo.addEventListener("dragleave", () => {
        deleteDo.classList.remove("active");
      });
      deleteDo.addEventListener("mousemove", () => {
        deleteDo.classList.remove("active");
      });
      deleteDo.addEventListener("drop", function () {
        dragging.remove();
        saveTasks();
      });
    }
    deleteDo.addEventListener("dragenter", (e) => {
      deleteThis(e);
    });
    deleteDo.addEventListener("dragover", (e) => {
      deleteThis(e);
    });
  });
  saveTasks();
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
function addToDo() {
  if (input.value) {
    const toDo = JSON.parse(localStorage.toDo || "[]");
    if (toDo) {
      toDo.push(input.value);
      localStorage.setItem("toDo", JSON.stringify(toDo));
    } else {
      localStorage.toDo = JSON.stringify([input.value]);
    }
  }
  input.value = "";
  collectTasks();
}
function collectTasks() {
  const toDos = JSON.parse(localStorage.toDo || "[]");
  const completed = JSON.parse(localStorage.completed || "[]");
  containers.forEach((container) => {
    container.querySelectorAll("p").forEach((el) => {
      el.remove();
    });
  });
  toDos.forEach((task) => {
    const doTemplateClone = doTemplate.content.cloneNode(true).children[0];
    doTemplateClone.textContent = task;
    containers[0].append(doTemplateClone);
  });
  completed.forEach((task) => {
    const doTemplateClone = doTemplate.content.cloneNode(true).children[0];
    doTemplateClone.textContent = task;
    containers[1].append(doTemplateClone);
  });
  drag();
}
collectTasks();
function saveTasks() {
  const toDo = [];
  const completed = [];
  containers[0].querySelectorAll("p").forEach((el) => {
    toDo.push(el.textContent);
  });
  containers[1].querySelectorAll("p").forEach((el) => {
    completed.push(el.textContent);
  });
  localStorage.setItem("toDo", JSON.stringify(toDo));
  localStorage.setItem("completed", JSON.stringify(completed));
}
