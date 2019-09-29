const password2 = document.querySelector('#password2')
const password1 = document.querySelector('#password1')

password2.addEventListener('keyup', () => {
    if(password1.value !== password2.value){
        password2.classList = 'form-control is-invalid'
    }else{
        password2.classList = 'form-control is-valid'
        password1.classList = 'form-control is-valid'
    }
})