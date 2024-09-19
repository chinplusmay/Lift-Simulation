const floors = document.getElementById("input-floors");
const lifts = document.getElementById("input-lifts");
const inputContainer = document.getElementById("input-container");
const btnGenerateLifts = document.getElementById("btn-generate");
const errorDisplay = document.querySelector(".error-display");

let noOfLifts;
let noOfFloors;

let liftQueue = [];
let haltedQueue = [];
var requestQueue = [];

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}// The function insertAfter is used to insert newNode directly after referenceNode (referenceNode.nextSibling)

floors.addEventListener("input", () => {
  noOfFloors = parseInt(floors.value);
});

lifts.addEventListener("input", () => {
  noOfLifts = parseInt(lifts.value);
});

function validateInputs() {
  if (!noOfFloors || !noOfLifts) {
    alert("Enter Number of Floors/Lifts Greater than zero");
    return false;
  }
  if (noOfFloors < 0 || noOfLifts < 0) {
    alert("Enter Number of Floors/Lifts Greater than zero");
    return false;
  }
  return true;
}

function fillLiftQueue() {
  liftQueue = [];
  haltedQueue = [];
  requestQueue = [];
  for (let i = 1; i <= noOfLifts; i++) {
    let lift = {};
    lift.number = i;
    lift.status = "idle";
    lift.currentFloor = 0;
    liftQueue.push(lift);
  }
}

function generateFloors() {
  const element = document?.querySelector(".floors");
  element?.remove();

  const floors = document.createElement("section");
  floors.classList.add("floors");
  insertAfter(inputContainer, floors);
  // (?.)optional chaining ensures that if document is null or undefined it does not through an error and ele=undefined


  for (let i = 0; i < noOfFloors; i++) {
    const floor = document.createElement("div");
    floor.setAttribute("class", "floor");
    floors.prepend(floor);   // insert floor at  begining of floors container
    const floorNumber = document.createElement("div");
    floorNumber.innerText = `Floor ${i}`;   // starts from floor 0
    floorNumber.setAttribute("class", "floor-number");
    floor.append(floorNumber);
    const liftController = generateLiftControllers(i);
    floor.append(liftController);

    if (i === 0) {   // all lift(s) initially at zero'th floor
      for (let i = 1; i <= noOfLifts; i++) {
        const lift = generateLift(i);
        floor.append(lift);
      }
    }
  }
}

function generateLiftControllers(index) {
  const liftCont = document.createElement("div");
  liftCont.setAttribute("class", "lift-controller");
  const UpButton = document.createElement("button");
  UpButton.innerText = "Up ▲";
  UpButton.setAttribute("class", "btn-up");
  UpButton.dataset.floor = index;
  const DownButton = document.createElement("btn-down");
  DownButton.innerText = "Down ▼";
  DownButton.setAttribute("class", "btn-down");
  DownButton.dataset.floor = index;
  liftCont.append(UpButton);
  liftCont.append(DownButton);

  // for ground floor, only up button appear
  // for top floor, only down button appear
  if(index === 0){
    DownButton.style.visibility = 'hidden'
  }
  if(index === noOfFloors-1){
    UpButton.style.visibility = 'hidden'
  }

  return liftCont;
}


function generateLift(index) {
  const lift = document.createElement("div");
  lift.setAttribute("class", "lift");
  lift.dataset.liftnumber = index;
  const leftLift = document.createElement("div");  // left door
  leftLift.setAttribute("class", "lift-left");
  const rightLift = document.createElement("div");  // right door
  rightLift.setAttribute("class", "lift-right");

  lift.append(leftLift);
  lift.append(rightLift);
  return lift;
}

function getNearestLift(floorNumber) {
  let minDistance = Infinity;
  let nearestLiftIndex;
  let currentLiftDistance;

  liftQueue.sort(
    ({ number: liftOnePosition }, { number: liftTwoPosition }) => liftOnePosition - liftTwoPosition
  );

  for (let index = liftQueue.length - 1; index >= 0; index--) {
    currentLiftDistance = Math.abs(liftQueue[index].currentFloor - floorNumber); // calculates the absolute distance between the current lift’s floor and the desired floor
    if (currentLiftDistance <= minDistance) {
      nearestLiftIndex = index;
      minDistance = currentLiftDistance;
    }
  }
  const deletedEle = liftQueue.splice(nearestLiftIndex, 1);  // Removes the lift at nearestLiftIndex from the liftQueue
  liftQueue.unshift(deletedEle[0]);
}

function getFloorsHeight(floorNumber) {
  const floors = document.querySelectorAll(".floor");
  let height = 0;

  for (let i = floors.length - 1; i > floors.length - floorNumber - 1; i--) {
    height += floors[i].offsetHeight;
  }

  return height;
}

function simulateLift() {
  let floorNumber = requestQueue[0];
  let allLifts = document.querySelectorAll(".lift");
  let heightFromGroundFloor = getFloorsHeight(floorNumber);
  getNearestLift(floorNumber);

  let lift = allLifts[liftQueue[0].number - 1];
  let transitionTime =
    Math.abs(Number(floorNumber) - Number(liftQueue[0].currentFloor)) * 2;

  lift.style.transform = `translateY(${-parseInt(heightFromGroundFloor)}px)`;
  lift.style.transitionDuration = `${transitionTime}s`;

  setLiftToMoving(transitionTime, floorNumber, lift);
  requestQueue.splice(0, 1);
}

function setLiftToMoving(delay, floorNumber, currLift) {
  liftQueue = liftQueue.map((lift, index) =>
    index === 0
      ? { ...lift, status: "moving", currentFloor: floorNumber }  //? :ternerary(conditional) operator,    ... spread op
      : lift    // if index != 0
  );
  const firstLiftInQueue = liftQueue.shift();

  haltedQueue.push(firstLiftInQueue);

  let timerId1 = setTimeout(() => {
    currLift.firstChild.classList.add("open-lift-left");
    currLift.lastChild.classList.add("open-lift-right");
  }, delay * 1000);

  let timerId2 = setTimeout(() => {
    currLift.firstChild.classList.remove("open-lift-left");
    currLift.lastChild.classList.remove("open-lift-right");
  }, delay * 1000 + 2500);   // 2.5sec delay

  let timerId3 = setTimeout(() => {
    haltedQueue[0].status = "idle";
    liftQueue.push(haltedQueue[0]);
    haltedQueue.shift();
    if (requestQueue.length > 0) {
      simulateLift();
    }
  }, delay * 1000 + 5000);
}


// on click
btnGenerateLifts.addEventListener("click", () => {
  if (validateInputs()) {
    generateFloors();
    fillLiftQueue();
  }
});

document.body.addEventListener("click", (e) => {
  console.log("running");
  if (e.target.parentNode.className === "lift-controller") {
    let floorNumber = parseInt(e.target.dataset.floor);
    requestQueue.push(floorNumber);
    if (liftQueue.length > 0) {
      simulateLift();
    }
  }
});
