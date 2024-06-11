
const navToggle = document.querySelector('.nav-toggle')
const links = document.querySelector('.links')

navToggle.addEventListener('click', function () {
  links.classList.toggle('show-links')
})

const input = document.querySelector('.demo');
const worker = new Worker('worker.js');

worker.onmessage = function (event) {
  let text = event.data;
  if (text == 'worker says 10') {
    input.innerHTML = 'worker terminates';
    worker.terminate();
  }
  else {
    input.innerHTML = text;
  }  // Access event.data to get the message from the worker
};

const xhttp = new XMLHttpRequest();
xhttp.onload = function () {
  window.alert(this) ; 
  document.querySelector(".data").innerHTML = this.responseText;
}

document.querySelector('.clicking').addEventListener('click',()=>{
  xhttp.open('GET','res.txt',true) ; 
  xhttp.send() ; 
})
localStorage.setItem('name','shuvo dev durjoy') ; 