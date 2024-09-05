const urlParams = new URLSearchParams(window.location.search);
const Numberof_FLoors = parseInt(urlParams.get('floors'));
const numberof_Lifts = parseInt(urlParams.get('lifts'));
console.log("Number of lifts : "+numberof_Lifts);

class Floor {
    constructor(floorNumber) {
      this.floorNumber = floorNumber;
      this.lift = null; 
     
    }
  }
  

  class Lift {
    constructor(liftId,liftElement) {
      this.liftId = liftId;
      this.currentFloor = null; 
      this.direction=null;
      this.element = liftElement; 
      this.moving = false;
    }


    moveToFloor(assignedLift, floorNumber, duration) {
      assignedLift.moving = true;
      console.log("Move to floor assigned lift is : " + assignedLift);
      console.log("Assigned lift floor " + assignedLift.currentFloor);
      const liftElement = assignedLift.element;
      
      const mainPageDiv = document.getElementById("mainpagediv");
      const allFloors = mainPageDiv.querySelectorAll('.subelements');
      const targetFloor = allFloors[floorNumber]; 
      
      const liftRect = liftElement.getBoundingClientRect();
      const targetFloorRect = targetFloor.getBoundingClientRect();
      const mainPageRect = mainPageDiv.getBoundingClientRect();
      
      
      const transformVal = targetFloorRect.top - mainPageRect.top;
  
      liftElement.style.transition = `transform ${duration}s linear`;
      liftElement.style.transform = `translateY(-${transformVal}px)`;
  
      setTimeout(() => {
          assignedLift.currentFloor = floorNumber;
          assignedLift.openDoors(assignedLift, duration);
      }, duration * 1000);
  }
    
    openDoors(assignedLift,duration) {
      console.log("Open doors being called");
       setTimeout(function(){
          console.log("Assigned lift is : "+assignedLift);
        const liftElement = assignedLift.element;
        console.log("Elemnent value is : "+liftElement);
        console.log("Lift floor in openDoors is : "+assignedLift.currentFloor);
    const leftDoor = liftElement.querySelector('.lift-door-left');
    const rightDoor = liftElement.querySelector('.lift-door-right');
    leftDoor.style.transition = `transform 2.5s linear`;
    rightDoor.style.transition = `transform 2.5s linear`;
    leftDoor.style.transform = 'translateX(-100%)';
    rightDoor.style.transform = 'translateX(100%)';
   
    setTimeout(function(){
        leftDoor.style.transform = 'translateX(0%)';
        rightDoor.style.transform = 'translateX(0%)';
        setTimeout(()=>{
          assignedLift.moving=false;
          console.log("Lift moving is set to false");
        if (RequestQueue.length > 0) {
          
          const nextRequest = RequestQueue.shift();
          assignLiftToFloor(nextRequest.floorNumber,nextRequest.buttondirection);}},2600)
        
    },2600)
    
  },duration);
     
    console.log("Checking lift animation working");
      }

     opendooranim(assignedLift,floorNumber)
      {
        assignedLift.moving = true;
        console.log("open door anim");
        console.log("Assigned lift is : "+assignedLift);
        const liftElement = assignedLift.element;
        console.log("Elemnent value is : "+liftElement);
        console.log("Lift floor in openDoors is : "+assignedLift.currentFloor);
    const leftDoor = liftElement.querySelector('.lift-door-left');
    const rightDoor = liftElement.querySelector('.lift-door-right');
    leftDoor.style.transition = `transform 2.5s linear`;
    rightDoor.style.transition = `transform 2.5s linear`;
    leftDoor.style.transform = 'translateX(-100%)';
    rightDoor.style.transform = 'translateX(100%)';

    setTimeout(function(){
        leftDoor.style.transform = 'translateX(0%)';
        rightDoor.style.transform = 'translateX(0%)';
        setTimeout(()=>{
          assignedLift.moving=false;
          console.log("Lift moving is set to false");
        if (RequestQueue.length > 0) {
          
          const nextRequest = RequestQueue.shift();
          assignLiftToFloor(nextRequest.floorNumber,nextRequest.buttondirection);}},2600)
    
    },2600)
      }
  }  
const floors = [];
const lifts = [];
const RequestQueue=[];

for(var i=Numberof_FLoors-1;i>=0;i--){
  if(i==0)
    {
      const newdiv=document.createElement("div");
      
      newdiv.className=`subelements`;
      newdiv.innerHTML=`
          <div class="floorname floor0">Floor ${i}</div>
          <div class="buttons">
              <button class="upbutton" onclick="assignLiftToFloor(${i},'up')">Up ▲</button> <br>
             
          </div>
      `
      for(var j=1;j<=numberof_Lifts;j++)
        {
            const liftdiv=document.createElement("div");
            const liftdoorleft=document.createElement("div");
            const liftdoorright=document.createElement("div");
            liftdiv.className="lift";
            liftdiv.id=`lift${i}`
            liftdoorleft.className="lift-door-left";
            liftdoorright.className="lift-door-right";
            liftdiv.appendChild(liftdoorleft);
            liftdiv.appendChild(liftdoorright);
            newdiv.appendChild(liftdiv);
            lifts.push(new Lift(`lift${i}`,liftdiv));
        }
      floors[i]=new Floor(i);
     
      document.getElementById("mainpagediv").appendChild(newdiv);
      
    }
  else if(i==Numberof_FLoors-1)
  {
    const newdiv=document.createElement("div");
    
    newdiv.className=`subelements`;
    newdiv.innerHTML=`
        <div class="floorname">Floor ${i}</div>
        <div class="buttons">
            <button class="downbutton" onclick="assignLiftToFloor(${i},'down')">Down ▼</button>
        </div>
    `
    floors[i]=new Floor(i);
    
    document.getElementById("mainpagediv").appendChild(newdiv);
  }
 
  else{
    const newdiv=document.createElement("div");
    
    newdiv.className=`subelements`;
    newdiv.innerHTML=`
        <div class="floorname">Floor ${i}</div>
        <div class="buttons">
            <button class="upbutton" onclick="assignLiftToFloor(${i},'up')">Up ▲</button> <br>
            <button class="downbutton" onclick="assignLiftToFloor(${i},'down')">Down ▼</button>
        </div>
    `

    floors[i]=new Floor(i);
 
    document.getElementById("mainpagediv").appendChild(newdiv);
  }
}

console.log("Floors array val : "+floors[Numberof_FLoors].floorNumber);

 

   function assignLiftToFloor(floorNumber, buttondirection) {
    let buttonSelector;
    console.log("Button direction inside is : "+buttondirection)
    if (buttondirection === 'up') {
      buttonSelector = `.upbutton[onclick*="assignLiftToFloor(${floorNumber},'up')"]`;
  } else if (buttondirection === 'down') {
      buttonSelector = `.downbutton[onclick*="assignLiftToFloor(${floorNumber},'down')"]`;
  }

    const button = document.querySelector(buttonSelector);

    console.log("Button is : "+button);
    

  
    console.log("Floor number is : " + floorNumber);
    let AvailableLift = lifts.find(lift => 
      lift.currentFloor === floorNumber && lift.direction === buttondirection);
    
    if (AvailableLift) {
        console.log("Inside the lift open door animation only");
        console.log("Lift direction is : " + AvailableLift.direction);
        console.log("Button direction is : " + buttondirection);
        button.disabled=true;

        setTimeout(()=>{button.disabled=false},5200)
        opendoorsonly(floorNumber, buttondirection,AvailableLift);
    } else {
        var availableLift = lifts.find(lift => (lift.currentFloor === null));
        
        if (availableLift) {
            console.log("Inside the available lift if part");
            const currentFloor = availableLift.currentFloor || 0;
            const floorDifference = Math.abs(currentFloor - floorNumber);
            const duration = floorDifference * 2;
            availableLift.currentFloor = floorNumber;
            availableLift.direction = buttondirection;
           
            floors[floorNumber].lift = availableLift;
            console.log("Floor number lift is : " + floors[floorNumber].floorNumber);
            button.disabled = true;

   
            setTimeout(() => {
                button.disabled = false;
            },(duration*1000)+5200);
            openliftdoor(floorNumber,duration);
        } else {
            console.log("Inside the else part of link door with lift");
            let nearestLiftDistance = Infinity;
            let nearestLift;

            for (const lift of lifts) {
                if (lift.currentFloor !== null && lift.moving===false) {
                    const distance = Math.abs(lift.currentFloor - floorNumber);
                    if (distance < nearestLiftDistance) {
                        nearestLiftDistance = distance;
                        nearestLift = lift;
                    }
                }
                
            }

            if (nearestLift) {
                availableLift = nearestLift; 
                const currentFloor = availableLift.currentFloor || 0;
                const floorDifference = Math.abs(currentFloor - floorNumber);
                const duration = floorDifference * 2;
                availableLift.currentFloor = floorNumber;
                availableLift.direction = buttondirection;
                floors[floorNumber].lift = availableLift;
               
                button.disabled = true;

   
                setTimeout(() => {
                    button.disabled = false;
                },(duration*1000)+5200);
                openliftdoor(floorNumber,duration);
            }
            else{
              button.disabled=true
              RequestQueue.push({floorNumber,buttondirection});
              RequestQueue.sort((a, b) => a.floorNumber - b.floorNumber);
              console.log("Request Queue is : "+RequestQueue[0].floorNumber)
              
            }
        }
    }
}
function openliftdoor(floorNumber,duration){
    console.log("open lift door being called");
    const assignedLift = floors[floorNumber].lift; 
    console.log(floors)
    console.log(lifts)
    console.log("Assigned lift is :"+assignedLift);
    console.log("Assigned lift element in openliftdoor function is : "+assignedLift.element);
    if (assignedLift) {
      assignedLift.moveToFloor(assignedLift,floorNumber,duration);
    }
   else {
    console.log("No lift assigned to floor", floorNumber);
  }
   
}

function opendoorsonly(floorNumber,buttondirection,availableLift)
{
    availableLift.opendooranim(availableLift,floorNumber);
}
 




