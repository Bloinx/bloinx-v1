const validateEmail = (value, intl) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? `${intl.formatMessage({
        id: "login.form.validation.email",
      })}`
    : null;

export default validateEmail;
