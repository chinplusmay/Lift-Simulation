let currLiftPositionArr = []
let noOfFloors
let noOfLifts
let liftCallsQueue = []
let intervalId
let allLiftInfo
let activeLiftsDestinations = []

document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    startVirtualSimulation ()
})

// main
function startVirtualSimulation () {
    clearInterval(intervalId)
    if (validateLiftAndFloorEntries()) {
        generateFloors(noOfFloors)
        generateLifts(noOfLifts)
        addButtonFunctionalities()
        intervalId = setInterval(fullfillLiftCallsQueue,1000)
    }
}

const validateLiftAndFloorEntries = ()=>{
    
    noOfFloors = document.getElementById('noOfFloors').value
    noOfLifts = document.getElementById('noOfLifts').value

  
    if ((noOfFloors == '0'))
    if ((noOfLifts == '0')) {
        alert('Enter a valid number of floors and lifts ')
        return false
    }
  
    if ((noOfFloors == '0')){
        alert('Enter a valid number of floors')
        return false
    }
 
    if ((noOfLifts == '0')) {
        alert('Enter a valid number of lifts')
        return false
    }
    if ((noOfFloors == ''))
    if ((noOfLifts == '')) {
        alert('Enter a valid number of floors and lifts')
        return false
    }    
  
    noOfLifts = document.getElementById('noOfLifts').value
    if ((noOfLifts == '')) {
        alert('Enter a valid number of lifts ')
        return false
    }   
    
    noOfFloors = document.getElementById('noOfFloors').value
    if ((noOfFloors == '')) {
        alert('Enter a valid number of floors ')
        return false
    }   
    if((noOfFloors< 0))
    if((noOfLifts< 0)){
        alert(' Negative values are not supported ')
    }
    noOfFloors = document.getElementById('noOfFloors').value
    if((noOfFloors< 0)){
        alert('Negative values are not supported ')
    return false   
    }
    if ((noOfFloors > 10)){
        alert('Only 10 floors are supported in the app currently')
        return false
    }
  noOfLifts = document.getElementById('noOfLifts').value
    if((noOfLifts< 0)){
        alert(' Negative values are not supported')
    return false
    }
    if (!noOfFloors || !noOfLifts) {
        alert("Enter Number of Floors/Lifts Greater than zero");
        return false;
      }
  
  return true
}




const generateFloors = (n)=> {
    document.getElementById('simulationArea').innerHTML = ''
    for (let i=0;i<n;i++) {
        let currLevel = `L${n-i-1}`
        let floorNo = `Floor ${n - i - 1}`
        let currFloor = document.createElement('div')
        currFloor.setAttribute('id',floorNo)
        currFloor.classList.add('floor')
        // for ground floor, only up button appear
        // for top floor, only down button appear
        if(i === 0){
            currFloor.innerHTML = `
            <p>${floorNo}</p>
            <div>
            <button id=down${currLevel} class="button-floor downBttn">DOWN</button>
            </div>
            `;
        }
        else if(i === n - 1){
            currFloor.innerHTML = `
            <p>${floorNo}</p>
            <div>
            <button id=up${currLevel} class="button-floor upBttn">UP</button>
            </div>
            `;
        }
        else{
        currFloor.innerHTML = `
        <p>${floorNo}</p>
        <div>
        <button id=up${currLevel} class="button-floor upBttn">UP</button>
        <button id=down${currLevel} class="button-floor downBttn">DOWN</button>
        </div>
        `;
        }
        document.getElementById('simulationArea').appendChild(currFloor);
    }
}

function addButtonFunctionalities () {
    const allButtons = document.querySelectorAll('.button-floor')
    allButtons.forEach(btn => {
        btn.addEventListener('click', ()=>{
            const targetFlr = parseInt(btn.id.slice(-1))
            if (!activeLiftsDestinations.includes(targetFlr)) {
                activeLiftsDestinations.push(targetFlr)
                liftCallsQueue.push(targetFlr)
            }
        })
    })
}

function disablebtn(){
    document.getElementById("up").disabled = true;
}



function translateLift(liftNo,targetLiftPosn) {
    const reqLift = document.getElementById(`Lift-${liftNo}`)
    let currLiftPosn = parseInt(currLiftPositionArr[liftNo])

    if (currLiftPosn != targetLiftPosn) {
        allLiftInfo[liftNo].inMotion = true
        let unitsToMove = parseInt(Math.abs(targetLiftPosn - currLiftPosn) + 1);
        let motionDis = -100 * parseInt(targetLiftPosn);

        reqLift.style.transform = `translateY(${motionDis}px)`;
        reqLift.style.transitionTimingFunction = 'linear';
        reqLift.style.transitionDuration = `${unitsToMove * 2}s`; // Change to 2 seconds per floor
        
        let timeInMs = unitsToMove * 2000;
        setTimeout(() => {
            currLiftPositionArr[liftNo] = targetLiftPosn;
            // After reaching the target, open the doors
            animateLiftsDoors(liftNo, targetLiftPosn);
        }, timeInMs);
    } else {
        allLiftInfo[liftNo].inMotion = true;
        animateLiftsDoors(liftNo, targetLiftPosn);
    }
}

function animateLiftsDoors(liftNo, targetLiftPosn) {
    const leftGate = document.getElementById(`L${liftNo}left_gate`);
    const rightGate = document.getElementById(`L${liftNo}right_gate`);
    
    // Open doors
    leftGate.classList.add('animateLiftsDoorsOnFloorStop');
    rightGate.classList.add('animateLiftsDoorsOnFloorStop');
    
    setTimeout(() => {
        // After 2.5 seconds, start closing the doors
        leftGate.classList.remove('animateLiftsDoorsOnFloorStop');
        rightGate.classList.remove('animateLiftsDoorsOnFloorStop');

        // Mark the lift as not in motion after doors close
        allLiftInfo[liftNo].inMotion = false;

        // Remove the destination after doors close
        activeLiftsDestinations = activeLiftsDestinations.filter((item) => item !== targetLiftPosn);
    }, 2500); // 2.5 seconds for doors to remain open
}   

function findNearestFreeLift(flrNo) {
    
    let prevDiff = Number.MAX_SAFE_INTEGER;
    let nearestAvailableLift = -1
    for (let i=0;i<currLiftPositionArr.length;i++) {
        if (allLiftInfo[i].inMotion == false)  {
            const currDiff = Math.abs(currLiftPositionArr[i] - flrNo)
            if (currDiff < prevDiff ) {
                prevDiff = currDiff
                nearestAvailableLift = i
            }
        }
    }
    return nearestAvailableLift
}

const generateLifts = (n)=> {
    allLiftInfo = []
    for (let i=0;i<n;i++) {
        let liftNo = `Lift-${i}`
        const currLift = document.createElement('div');
        currLift.setAttribute('id',liftNo)
        currLift.classList.add('lifts');
        currLift.innerHTML = `
            <p>Lift${i+1}</p>
            <div class="gate gateLeft" id="L${i}left_gate"></div>
            <div class="gate gateRight" id="L${i}right_gate"></div>
        `;
        currLift.style.left = `${(i+1)*90}px`;
        currLift.style.top = '0px'
        document.getElementById('Floor 0').appendChild(currLift);
        currLiftPositionArr[i] = 0
        
        const currliftDetail = {}
        currliftDetail.id = liftNo
        currliftDetail.inMotion = false
        allLiftInfo.push(currliftDetail)
    }
}



function fullfillLiftCallsQueue () {
    if (!(liftCallsQueue.length)) return;
    let targetFlr = liftCallsQueue[0]

    const liftToMove = findNearestFreeLift(targetFlr)   
    if (liftToMove != -1) {
        translateLift(liftToMove,targetFlr)
        liftCallsQueue.shift()
    }

}
