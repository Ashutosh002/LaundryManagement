const input = document.querySelectorAll('input')
const email= document.getElementById('email')
const password = document.getElementById('pass')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const tel = document.getElementById('tel')
const street = document.getElementById('street')
const city = document.getElementById('city')
const state = document.getElementById('state')
const zipcode = document.getElementById('zipcode')
const answer = document.getElementById('answer')

const newPassword = document.getElementById('new-password')

function mousedown(){
    password.setAttribute("type", "text")
}

function mouseup(){
    password.setAttribute("type", "password")
}

// ! - - - - - - - - - - - - - - - - - - - 

function validate(){

    const emailValidation = validateEmail()
    const passValidation = validatePassword()
    const fullValidation = validateFullname()
    const telValidation = validateTel()
    const adrValidation = validateAddress()
    const ansValidation = validateAnswer()

    if(emailValidation && passValidation && fullValidation && telValidation & adrValidation && ansValidation){
        input.forEach((element) => {
            element.style.borderColor = "#00c9f7"
        })
        return true;
    } return false;
}

// ! - - - - - - - - - - - - - - - - - - - 

function setErrorFor(input, message){
    input.style.borderColor = "#e74c3c";

    const formGroup = input.parentNode.parentNode;
    const small = formGroup.querySelector('small');

    small.innerText = message;

    formGroup.className = 'form-group error'
}

// ! - - - - - - - - - - - - - - - - - - - 


function validateEmail(){
    const emailValue = email.value.trim();

    const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const validEmailValue = validEmailRegex.test(emailValue)

    if(emailValue === ""){
        setErrorFor(email, "Email cannot be blank.")
        return false
        
    } else if(validEmailValue === false){
        setErrorFor(email, "Provide a valid email address.")
        return false
    } else return true;
}

function validatePassword(){
    const passwordValue = password.value.trim()
    const validPasswordRegex = /^.{6,}$/

    if(passwordValue === ""){
        setErrorFor(password, "Password cannot be blank.")
        return false;
    } else if(validPasswordRegex.test(passwordValue) == false){
        setErrorFor(password, "Password must have at least 6 characters.")
        return false;
    } else return true
}

function validateFullname(){
    const fNameValue = fname.value.trim()
    const lNameValue = lname.value.trim()

    if(fNameValue == "" && lNameValue == ""){
        lname.style.borderColor = "#e74c3c";
        setErrorFor(fname, "Full Name cannot be blank.")
        return false;
    } else if(fNameValue == ""){

        setErrorFor(fname, "Provide the firstname.")
        return false;
    } else if(lNameValue == ""){

        setErrorFor(lname, "Provide the lastname.")
        return false;
    } else return true;
}

function validateTel(){
    const telValue = tel.value.trim();
    const validateTelRegex = /^\d{10}$/

    if(telValue == ""){
        setErrorFor(tel, "Phone number cannot be blank.")
        return false;
    } else if(validateTelRegex.test(telValue) == false){
        setErrorFor(tel, "Phone number must be of 10 digit.")
        return false;
    } else return true;
}

function validateAddress(){
    const streetValue = street.value.trim();
    const cityValue = city.value.trim();
    const stateValue = state.value.trim();
    const zipValue = zipcode.value.trim();
    const validZipRegex = /^\d{6}$/

    const address = [streetValue, cityValue, stateValue, zipValue];

    //! If even one of the address field is empty some() will return true making setErrorFor(street) triggered, but if all the fields are filled some will return false and then it will go to else if() to check if zip is invalid. if we get false from test() then it will trigger setErrorFor(zipcode) if we get true from test() final return will be true.
    if(address.some(n => n.length == 0)){

        city.style.borderColor = "#e74c3c";
        state.style.borderColor = "#e74c3c";
        zipcode.style.borderColor = "#e74c3c";
        setErrorFor(street, "All address fields must be filled.")
        return false;
    } else if(validZipRegex.test(zipValue)){
        return true;
    } else {
        setErrorFor(zipcode, "Invalid zipcode")
    }
}

function validateAnswer(){
    const answerValue = answer.value.trim();

    if(answerValue == "") {
        setErrorFor(answer, "Answer cannot be blank.")
        return false;
    } else return true;
}

// ! - - - - - - - - - - - - - - - - - - - 

function passwordResetValidation(){

    const newPasswordValue = newPassword.value.trim()
    const validPasswordRegex = /^.{6,}$/

    if(validPasswordRegex.test(newPasswordValue)){
        return true
    } else {
        const small = newPassword.parentNode.querySelector('small');
        small.style.visibility = "visible"
        return false;
    }   
}
