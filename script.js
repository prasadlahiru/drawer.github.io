const canvas = document.querySelector("canvas"),
canvasCursorPoint = document.querySelector(".drawing-board"),
toolBtns = document.querySelectorAll(".tool"),
tooClick = document.getElementsByClassName("tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
backColorBtns = document.querySelectorAll(".backColors .option"),
colorPicker = document.querySelector("#color-picker"),
backColorPicker = document.querySelector("#backcolor-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",

isMouseDown = false,
penWidth = 4,
pencilWidth= 2,
brushWidth = 5,
selectedBackColor ="#fff",
linesArray =[],
selectedColor = "#000";

const getMousePosition = (canvas,e) =>{
    const rect = canvas.getBoundingClientRect();
    return{
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}
const storeBrush=(x,y,s,c) =>{ //add drawn line to an array
    var line = {
        
        "x":x,
        "y":y,
        "size":s,
        "color":c
    }
    linesArray.push(line);
}
console.log(linesArray); //redraw
const redraw = (linesA) =>{
    for(var i = 1; i<linesA.length; i++){
        ctx.beginPath();
        ctx.moveTo(linesA[i-1].x,linesA[i-1].y);
        ctx.lineWidth = linesA[i].size;
        ctx.lineCap = "round";
        ctx.strokeStyle = linesA[i].color;
        ctx.lineTo(linesA[i].x,linesA[i].y)
        ctx.stroke();
        ctx.closePath();
        }
}



const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}
const canvasBackColor=()=>{
    ctx.fillStyle = selectedBackColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw(linesArray);
    ctx.fillStyle = selectedBackColor;
    

    
    
}
const drawingCursor = () =>{
    if(selectedTool==="brush"){
        canvasCursorPoint.style.cursor = "url(icons/brush.png), auto";
    }else if(selectedTool ==="eraser"){
        canvasCursorPoint.style.cursor = "url(icons/rounded-rectangle.png), auto";
    }else if(selectedTool ==="pencil"){
        canvasCursorPoint.style.cursor = "url(icons/pencil.png), auto";
    }else{
        canvasCursorPoint.style.cursor = "crosshair";
    }
}
window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
    drawingCursor();
    
});
const drawLine=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
}
const drawPath = (e) =>{
    
    ctx.lineWidth = brushWidth;
    ctx.fillStyle = selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.fill();
    
}
const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}
const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor;
     // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    const currentPosition = getMousePosition(canvas,e);
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
        drawingCursor();
        storeBrush(currentPosition.x, currentPosition.y, brushWidth, selectedColor);
        

    }else if(selectedTool ==="pen"){
        ctx.lineWidth = penWidth;
        ctx.strokeStyle =selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        drawingCursor();
        storeBrush(currentPosition.x, currentPosition.y, brushWidth, selectedColor);

    }else if(selectedTool ==="pencil"){
        ctx.lineWidth = pencilWidth;
        ctx.strokeStyle = selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); 
        drawingCursor();
        storeBrush(currentPosition.x, currentPosition.y, pencilWidth, selectedColor);
        
    } else if(selectedTool === "rectangle"){
        drawingCursor();
        drawRect(e);
        store(currentPosition.x, currentPosition.y, brushWidth, selectedColor);
        
    } else if(selectedTool === "circle"){
        drawingCursor();
        drawCircle(e);
        store(currentPosition.x, currentPosition.y, brushWidth, selectedColor);
        
    } else if(selectedTool ==="line"){
        drawingCursor();
        drawLine(e);
        s

    }else if(selectedTool === "path"){
        drawingCursor();
        drawPath(e);
        store(currentPosition.x, currentPosition.y, brushWidth, selectedColor);

    }else{
        drawingCursor();
        drawTriangle(e);
        store(currentPosition.x, currentPosition.y, brushWidth, selectedColor);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

//background-color

backColorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".back .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedBackColor value
        selectedBackColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        canvasBackColor();
    });
});


colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});


backColorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    backColorPicker.parentElement.style.background = backColorPicker.value;
    backColorPicker.parentElement.click();
    
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
    linesArray =[];
});

saveImg.addEventListener("click", () => {

    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
