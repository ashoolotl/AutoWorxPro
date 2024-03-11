document.getElementById('add').addEventListener('click', function () {
    document.getElementById('addCarPopup').style.display = 'block';
}); // opening of add car popup

document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('addCarPopup').style.display = 'none';
}); // closing of add car popup through x button

document
    .getElementById('addCarForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('addCarPopup').style.display = 'none';
        document.getElementById('successPopup').style.display = 'block';
    }); // when submitted, hide form popup then show success popup

document
    .getElementById('closeSuccessPopup')
    .addEventListener('click', function () {
        document.getElementById('successPopup').style.display = 'none';
    }); // closing of success popup through x button

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('successPopup').style.display = 'none';
}); // closing of success popup after clicking done button
