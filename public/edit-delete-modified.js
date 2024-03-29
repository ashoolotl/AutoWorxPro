function showEditPopup() {
    closePopups();
    showOverlay();
    document.getElementById("editPopup").style.display = "block";
}

function showEditConfirmPopup() {
    closePopups();
    showOverlay();
    document.getElementById("successEditPopup").style.display = "block";
}

function showDeletePopup() {
    closePopups();
    showOverlay();
    document.getElementById("deletePopup").style.display = "block";
}

function showDeleteConfirmPopup() {
    closePopups();
    showOverlay();
    document.getElementById("successDeletePopup").style.display = "block";
}

function closeEditPopup() {
    hideOverlay();
    document.getElementById("editPopup").style.display = "none";
}

function closeEditConfirmPopup() {
    hideOverlay();
    document.getElementById("successEditPopup").style.display = "none";
}

function closeDeletePopup() {
    hideOverlay();
    document.getElementById("deletePopup").style.display = "none";
}

function closeDeleteConfirmPopup() {
    hideOverlay();
    document.getElementById("successDeletePopup").style.display = "none";
}

function closePopups() {
    closeEditPopup();
    closeDeletePopup();
    closeDeleteConfirmPopup();
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".edit-form");
    const confirmBtn = document.querySelector(".confirm-edit-btn");

    form.addEventListener("input", function () {
        const inputs = form.querySelectorAll("input[required]");
        const textarea = form.querySelector("textarea[required]");

        let allFilled = true;

        inputs.forEach(function (input) {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (textarea.value.trim() === "") {
            allFilled = false;
        }

        if (allFilled) {
            confirmBtn.removeAttribute("disabled");
        } else {
            confirmBtn.setAttribute("disabled", "disabled");
        }
    });
});


function showOverlay() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
  }