export const Patterns = {
  usernamePattern: "^[a-zA-Z0-9_.\\-~!#$%^&*+=`|\\(){}[\\]:;'<>,.?]*$",
  passwordPattern: "^[a-zA-Z0-9_.\\-~!@#$%^&*+=`|\\(){}[\\]:;'<>,.?]*$",
  emailPattern: "^([a-zA-Z0-9_\\.\\-]+)@([a-zA-Z0-9_\\.-]+)\\.([a-zA-Z]{2,5})$",
  emptyEditorPattern: /^[<p>(&nbsp;\s)+(&nbsp;)+<\/p>]+$/g,
};
