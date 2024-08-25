
const floor = document.getElementById('floor')

function onSubmit(){
    event.preventDefault()
    console.log(floor.value)

    const floorDiv = document.createElement("div");
    floorDiv.classList.add("floor");
}
