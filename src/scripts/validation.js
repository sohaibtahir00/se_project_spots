export const settings = {
    formSelector: ".modal__container-form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-button",
    inactiveButtonClass: "modal__container-form_error",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error",
    errorMsgSuffix: "-error"
  }

const showInputError = (formEl, inputEl, errorMsg, config) => {
    const errorMsgId = inputEl.id + settings.errorMsgSuffix;
    const errorMsgEl = formEl.querySelector("#" + errorMsgId);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
    const errorMsgId = inputEl.id + config.errorMsgSuffix;
    const errorMsgEl = formEl.querySelector("#" + errorMsgId);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
    console.log(inputEl.validationMessage);
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
        hideInputError(formEl, inputEl, config);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonEl, config) => {
    if (hasInvalidInput(inputList)) {
        disabledButton(buttonEl, config);
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(config.inactiveButtonClass);
    }
};

export const disabledButton = (buttonEl, config) => {
    buttonEl.disabled = true;
    buttonEl.classList.add(config.inactiveButtonClass);
};

export const resetValidation = (formEl, inputList, config) => {
    inputList.forEach((inputEl) => {
        hideInputError(formEl, inputEl, config);
    });
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonEl = formEl.querySelector(config.submitButtonSelector);
    
    toggleButtonState(inputList, buttonEl, config);
    inputList.forEach((inputEl) => {
        inputEl.addEventListener("input", function () {
            checkInputValidity(formEl, inputEl, config);
            toggleButtonState(inputList, buttonEl, config);
        });
    });
};

export const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl, config);
    });
};