"use strict"

const signUp = document.getElementById("signup-tab")
const loginTab = document.getElementById("login-tab")
const formButton = document.getElementById("form-button")
const form = document.getElementById("form")

signUp.addEventListener('click', () => {
    signUp.classList.add('active')
    loginTab.classList.remove('active')
    formButton.innerText = "Sign up"
    form.innerHTML = `<input type="text" name="" id="" placeholder="E-Mail">
            <input type="text" name="" id="" placeholder="Username"><input type="text" name="" id="" placeholder="Password">
            <input type="text" name="" id="" placeholder="Repeat Password">`
})

loginTab.addEventListener('click', () => {
    signUp.classList.remove('active')
    loginTab.classList.add('active')
    formButton.innerText = "Login"
    form.innerHTML = `<input type="text" name="" id="" placeholder="E-Mail">
            <input type="text" name="" id="" placeholder="Username">`
})