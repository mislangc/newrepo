/*const passwordButton = document.querySelector("#show-password");
    passwordButton.addEventListener("click", function() {
        const passwordInput = document.getElementById("account-password");
        const type = passwordButton.getAttribute("type");
        if (type == "password") {
            passwordInput.setAttribute("type", "text");
            passwordButton.innerHTML = "Hide Password";
        } else {
            passwordInput.setAttribute("type", "password");
            passwordButton.innerHTML = "Show Password";
        }
    });*/

const passwordButton = document.querySelector("#show_password");   
passwordButton.addEventListener("click", function showPassword() {
    var passwordInput = document.getElementById("account_password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
  }) 