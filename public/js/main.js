var slide = document.getElementById("slide").children;
var index = 0;

//init
slide[0].style.zIndex = "4";
for(var i = 1; i < slide.length; i++){
    slide[i].style.left = "-100%";
}

//slidei right function
function next(){
    slide[index].style.animationName = "slide-to-right"; 
    index++;
    if(index>slide.length-1) index = 0;
    slide[index].style.animationName = "slide-to-middle"; 
}

setInterval(next,7000);