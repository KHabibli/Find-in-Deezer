console.log(document)

document.addEventListener('click', (e)=>{
    console.log(e.target)
    console.log(e.target.parentElement)
})