// Variabler
const todoText = document.querySelector("#todo_input");
const amountField = document.querySelector("#amount_input");
const todoBtn = document.querySelector(".writetodobtn");
const todoContainer = document.querySelector(".todo_container");
const notdoneBtn = document.querySelector("#btntodo");
const doneBtn = document.querySelector("#btndone");
const doneContainer = document.querySelector(".done_container");
const todoList = document.querySelector("#todolist");
const doneList = document.querySelector("#donelist");
const todoArr = [];
const savedTodoArr = localStorage.getItem("todoArr");
if (savedTodoArr) {
  todoArr.push(...JSON.parse(savedTodoArr));
  showTaskArr(); // Vis opgaverne ved sidenes start
}

// Eventlisteners på knapper
todoBtn.addEventListener("click", submitToDo);
notdoneBtn.addEventListener("click", showNotDonelist);
doneBtn.addEventListener("click", showDonelist);

function showDonelist() {
  todoList.style.zIndex = "0";
  doneList.style.zIndex = "1";
  doneBtn.style.zIndex = "1";
  doneBtn.style.backgroundColor = "#f0ede4";
  notdoneBtn.style.backgroundColor = "#79744e";
  console.log("Knap er klikket", notdoneBtn);
}

function showNotDonelist() {
  todoList.style.zIndex = "1";
  doneList.style.zIndex = "0";
  doneBtn.style.zIndex = "0";
  notdoneBtn.style.backgroundColor = "#f0ede4";
  doneBtn.style.backgroundColor = "#79744e";
}

function submitToDo() {
  const todoObject = {
    text: todoText.value,
    amount: amountField.value,
    done: false,
    unchecked: true,
    star: true,
    delete: true,
    id: self.crypto.randomUUID(),
  };
  todoArr.push(todoObject);
  localStorage.setItem("todoArr", JSON.stringify(todoArr)); // Gem i localStorage
  todoText.value = ""; // nulstiller input felt med tekst
  amountField.value = ""; // nulstille input fellt med mængde
  console.log("todoArr", todoArr);
  filterAndSortTaskArr();
}

function filterAndSortTaskArr() {
  showTaskArr();
}

function showTaskArr() {
  todoContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  todoArr.forEach((elm) => {
    const li = document.createElement("li");
    // opdaterer HTML med skrevet to-do og ikoner
    li.innerHTML = `
  <img class="checkbox" src="img/${elm.unchecked ? "unchecked.webp" : "checkedoff.webp"}" alt="Circle to check and uncheck"/>
  <p class="textelement">${elm.text}</p>
    <p class="amountelement">${elm.amount}</p>
  <img class="star" src="img/${elm.star ? "star.webp" : "starfilled.webp"}" alt="Star icon"/>
  <img class="deleteimg" src="img/trashclosed.webp" ${elm.delete}></img>
`;

    // Tilføjer to-do's i de rigtige containers
    if (elm.unchecked) {
      todoContainer.appendChild(li);
    } else {
      doneContainer.appendChild(li);
    } // flytter to do tekst til done containeren

    // tilføjet klik-event på checkbox
    li.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("checkbox")) {
        console.log("vis ikon");
        elm.unchecked = !elm.unchecked;
        console.log("check boxed of ID", `${elm.id}`); // tjekker id i console log

        // opdaterer først ikonet, efter setTimeout går igang
        evt.target.src = `img/${elm.unchecked ? "unchecked.webp" : "checkedoff.webp"}`;
        localStorage.setItem("todoArr", JSON.stringify(todoArr)); // Gem i localStorage efter statusændring
        // setTimeout sørger for, at brugeren når at se, at to-do'en bliver klikket af, inden den rykkes til "done"-listen
        if (!elm.unchecked) {
          setTimeout(() => {
            showTaskArr();
          }, 500); // (flytter den færdige opgave til "done"-listen efter forsinkelse på halvt sekund.
        }
      } else if (evt.target.classList.contains("star")) {
        console.log("vis ikon");
        elm.star = !elm.star; // fylder stjerne ikon, hvis noget er vigtigt
        localStorage.setItem("todoArr", JSON.stringify(todoArr)); // Gemmer ændringen i localStorage
        showTaskArr(); // opdaterer visningen
        // hvis event indeholder delete billedet
      } else if (evt.target.classList.contains("deleteimg")) {
        // Skifter til billede af åben skraldespan ved klik:
        evt.target.src = "img/trashopen.webp";
        // sletter to-do'en efter halv sekund
        setTimeout(() => {
          const index = todoArr.findIndex(
            (targetArray) => targetArray.id === elm.id, // index finder indexet på det specifikke liste element.
          );
          todoArr.splice(index, 1); // hvis trykket på, så bliver elementet/to do teksten slettet.
          localStorage.setItem("todoArr", JSON.stringify(todoArr)); // Gem i localStorage efter sletning
          showTaskArr();
        }, 500);
      }
    });
  });
}
