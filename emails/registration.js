const keys = require("../keys");
module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Account was created",
    html: `
    <h1>You are welcome in our shop</h1>
    <p>You have created an account successfully with email - ${email}</p>
    <hr />
    <a href='${keys.BASE_URL}'>Courses shop</a>
    `,
  };
};
