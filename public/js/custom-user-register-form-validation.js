const user_registration_form = document.getElementById('user-registration')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password_confirmation = document.getElementById('password_confirmation')
const inputs = document.getElementsByTagName('input')

function setErrorFor(input, message) {
    input.parentElement.lastElementChild.classList.add("invalid-feedback")
    input.parentElement.lastElementChild.classList.remove("valid-feedback")
    input.parentElement.lastElementChild.innerHTML = message
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
}

function setSuccessrFor(input, message = "Looks good!") {
    input.parentElement.lastElementChild.classList.remove("invalid-feedback")
    input.parentElement.lastElementChild.classList.add("valid-feedback")
    input.parentElement.lastElementChild.innerHTML = message
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function validateUsername() {
    if (username.value.trim() == "") {
        setErrorFor(username, "Username can not be blank.")
    } else if (username.value.trim().length < 3) {
        setErrorFor(username, "Username must not be less than 3 characters.")
    } else {
        setSuccessrFor(username)
    }
}

function validateEmail() {
    if (email.value.trim() == "") {
        setErrorFor(email, "Email address can not be blank.")
    } else if (!isEmail(email.value.trim())) {
        setErrorFor(email, "Not a valid email address.")
    } else {
        setSuccessrFor(email)
    }
}

function validatePassword() {
    const passwordValue = password.value.trim()
    if (passwordValue.match(/[a-z]/g) && passwordValue.match(
            /[A-Z]/g) && passwordValue.match(
            /[0-9]/g) && passwordValue.match(
            /[^a-zA-Z\d]/g) && passwordValue.length >= 8) {
        setSuccessrFor(password)
    } else {
        setErrorFor(password, `Password must contain: 
                            <ul>
                                <li>At least 1 uppercase character</li>
                                <li>At least 1 lowercase character</li>
                                <li>At least 1 digit</li>
                                <li>At least 1 special character</li>
                                <li>Minimum 8 characters</li>
                            </ul>
                            `)
    }
}

function validatePassword_confirmation() {
    if (password.value.trim() !== password_confirmation.value.trim()) {
        setErrorFor(password_confirmation, "Passwords do not match.")
    } else {
        setSuccessrFor(password_confirmation)
    }
}

username.addEventListener('change', e => {
    validateUsername()
});
email.addEventListener('change', e => {
    validateEmail()
});
password.addEventListener('change', e => {
    validatePassword()
});
password_confirmation.addEventListener('change', e => {
    validatePassword_confirmation()
})