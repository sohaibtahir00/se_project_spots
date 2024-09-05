import "./index.css"
import { enableValidation, settings, resetValidation, disabledButton} from "../scripts/validation.js";
import Api from "../utils/Api.js"

// const initialCards = [
//     {name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
//     {name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
//     {name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
//     {name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
//     {name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
//     {name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
// ];

const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "f54cc228-1565-4d98-b6d9-1ca0cd800e7c",
      "Content-Type": "application/json"
    },
    userBaseUrl: 'https://around-api.en.tripleten-services.com/v1'
  });

  api.getAppInfo()
  .then(([userData, cards]) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.src = userData.avatar;
      cards.forEach((item) => {
          const cardElement = getCardElement(item);
          cardsList.prepend(cardElement);
      });
  })
  .catch(console.error);
        

// EditModal
const editModalButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton = document.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");
const editForm = editModal.querySelector(".modal__container-form");

//CardModal
const cardModalButton = document.querySelector(".profile__add-button");
const closeProfileModal = document.querySelector("#close-modal-button");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const modalSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardForm = cardModal.querySelector(".modal__container-form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//PreviewModal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-type-preview");
const modals = document.querySelectorAll(".modal");

//AvatarModal
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const avatarForm = avatarModal.querySelector(".modal__container-form");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatar = document.querySelector(".profile__avatar");

//DeleteModal
const deleteModal = document.querySelector("#delete-modal");
const deleteButtonsContainer = deleteModal.querySelector(".delete__buttons-container")
const deleteForm = document.querySelector(".modal__delete-form");
const closeDeleteModal = document.querySelector(".modal__delete-close-button-img")
const cancelDeleteModal = document.querySelector(".modal__cancel-button")
const deleteButton = deleteForm.querySelector("#modal__delete-button");

let selectedCard, selectedCardId;

modals.forEach(modal => {
    modal.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal_opened")) {
            closeModal(modal);
        }
    });
});

function handleDeleteSubmit(evt) {
    const deleteButton = evt.submitter;
    deleteButton.textContent = "Deleting...";
    evt.preventDefault();
    api.deleteCard(selectedCardId)
        .then(() => {
            selectedCard.remove(); 
            closeModal(deleteModal); 
        })
        .catch(console.error)
        .finally(() => {
            deleteButton.textContent = "Delete";
        });
}

function handleDeleteCard(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
}

function handleProfileFormSubmit(evt) {
    const modalSubmitButton = evt.submitter;
    modalSubmitButton.textContent = "Saving..."
    evt.preventDefault();
    api.editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
        .then((data) => {
            profileName.textContent = data.name;
            profileDescription.textContent = data.about;
            closeModal(editModal);
        })
        .catch(console.error)
        .finally(() => {
            modalSubmitButton.textContent = "Save";
        });
}

function handleAddCardSubmit(evt) {
        const modalSubmitButton = evt.submitter;
        modalSubmitButton.textContent = "Saving..."
        evt.preventDefault();
        const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
        api.addCard(inputValues)
            .then((data) => {
                const cardElement = getCardElement(data);
                cardsList.prepend(cardElement);
                disabledButton(modalSubmitButton, settings);
                closeModal(cardModal);
                cardNameInput.value = "";
                cardLinkInput.value = "";
            })
            .catch(console.error)
            .finally(() => {
                modalSubmitButton.textContent = "Save";
        });
    }
            
    function handleAvatarSubmit(evt) {
        const modalSubmitButton = evt.submitter;
        modalSubmitButton.textContent = "Saving...";
        evt.preventDefault();
        api.editAvatarInfo(avatarInput.value)
            .then((data) => {
                profileAvatar.src = data.avatar;
                closeModal(avatarModal);
                avatarInput.value = "";
            })
            .catch(console.error)
            .finally(() => {
                modalSubmitButton.textContent = "Save";
            });
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

avatarModalButton.addEventListener("click", () => {
    openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
    closeModal(avatarModal);
});

closeDeleteModal.addEventListener("click", () => {
    closeModal(deleteModal);
});

cancelDeleteModal.addEventListener("click", () => {
    closeModal(deleteModal);
});

editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleLike(evt, cardId) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-button_liked");

    api.changeLikeStatus(cardId, isLiked)
        .then((data) => {
            likeButton.classList.toggle("card__like-button_liked", !isLiked);
        })
        .catch(console.error);
}



function getCardElement(data) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardNameElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button");
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");

    cardNameElement.textContent = data.name;
    cardImageElement.alt = data.name;
    cardImageElement.src = data.link;

    
    if (data.isLiked) { 
        cardLikeButton.classList.add("card__like-button_liked");
    } else {
        cardLikeButton.classList.remove("card__like-button_liked");
    }

    cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

    cardImageElement.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageElement.src = data.link;
        previewModalImageElement.alt = data.name;
        previewModalCaptionElement.textContent = data.name;
    });

    cardDeleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data._id));

    deleteForm.addEventListener("submit", handleDeleteSubmit);

    return cardElement;
}



enableValidation(settings);