import "./index.css"
import { enableValidation, settings, resetValidation, disabledButton} from "../scripts/validation.js";

const initialCards = [
    {name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
    {name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
    {name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
    {name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
    {name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
    {name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
];

const editModalButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const editModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton = document.querySelector(".modal__close-button");
const closeProfileModal = document.querySelector("#close-modal-button");
const profileName = document.querySelector(".profile__name");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const profileDescription = document.querySelector(".profile__description");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");
const editForm = editModal.querySelector(".modal__container-form");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const modalSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardForm = cardModal.querySelector(".modal__container-form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-type-preview");
const modals = document.querySelectorAll(".modal");

modals.forEach(modal => {
    modal.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal_opened")) {
            closeModal(modal);
        }
    });
});


function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
}

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    disabledButton(modalSubmitButton, settings);
    closeModal(cardModal);
    cardNameInput.value = "";
    cardLinkInput.value = "";
}  

function openModal(modal, config) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal, config) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === "Escape") {
        modals.forEach(modal => {
            if (modal.classList.contains("modal_opened")) {
                closeModal(modal);
            }
        });
    }
}

editModalButton.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    resetValidation(editForm, [editModalNameInput, editModalDescriptionInput], settings);
    openModal(editModal);
});

editModalCloseButton.addEventListener("click", () => {
    closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
    openModal(cardModal);
});

cardModalCloseButton.addEventListener("click", () => {
    closeModal(cardModal);
});


previewModalCloseButton.addEventListener("click", () => {
    closeModal(previewModal);
});

editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);


function getCardElement(data) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardNameElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button")
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");

    cardNameElement.textContent = data.name;
    cardImageElement.alt = data.name;
    cardImageElement.src = data.link;
    cardLikeButton.addEventListener("click", () => {
        cardLikeButton.classList.toggle("card__like-button_liked");
    });

    cardImageElement.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageElement.src = data.link;
        previewModalImageElement.alt = data.name;
        previewModalCaptionElement.textContent = data.name;

    });

    cardDeleteButton.addEventListener("click", () => {
        cardElement.remove();
    });

    return cardElement;
}

initialCards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
});

enableValidation(settings);