function WelcomeUserLogoutLinks (cookie, res) {
    let tools = document.getElementById("tools")
    if (cookie) {
        tools.innerHTML = `WELCOME<a title="Click to open account management" href="/account/management">User</a> `
        tools.innerHTML += `<a title="Click to logout" href="/account/login">LOGOUT</a>`
      } else {
        tools.innerHTML = `<a title="Click to log in" href="/account/login">My Account</a>`
      }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }



WelcomeUserLogoutLinks(getCookie('jwt'));
console.log(document.cookie);