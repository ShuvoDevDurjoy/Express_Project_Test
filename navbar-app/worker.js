let i = 0 ; 
let intervalId = setInterval(() => {
    i++ ; 
    if(i>10)
    {
        clearInterval(intervalId) ; 
        return ; 
    }
    postMessage('worker says '+i) ; 
}, 1000);