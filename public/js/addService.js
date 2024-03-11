const addService = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/services',
            data,
        });
        console.log(res.data.status);
        if (res.data.status == 'success') {
            alert('success');
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// EDIT AND DELETE BUTTON
document.addEventListener('DOMContentLoaded', function () {
    const bottomContainer = document.querySelector('.bottom-container');

    bottomContainer.addEventListener('click', function (event) {
        if (event.target.matches('#serviceEdit')) {
            const editButton = event.target;
            const bottomItem = editButton.closest('.bottom-item');
            const serviceName = bottomItem.querySelector('h2').textContent;
            alert(serviceName);
            // Add your logic for editing here
        }
    });
});
document.getElementById('add').addEventListener('click', function () {
    showOverlay();
    document.getElementById('addServicePopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function () {
    hideOverlay();
    document.getElementById('addServicePopup').style.display = 'none';
});

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append(
        'description',
        document.getElementById('description').value
    );
    formData.append('duration', document.getElementById('duration').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    const prices = [];
    const checkboxes = form.querySelectorAll(
        'input[name="selectedItems"]:checked'
    );

    checkboxes.forEach((checkbox) => {
        const priceInput = checkbox.nextElementSibling;
        const tokenInput = priceInput.nextElementSibling;
        const price = Number(priceInput.value);
        const token = Number(tokenInput.value);
        prices.push({ service: checkbox.value, price: price, token: token });
    });

    prices.forEach((price, index) => {
        formData.append(`prices[${index}][service]`, price.service);
        formData.append(`prices[${index}][price]`, price.price);
        formData.append(`prices[${index}][token]`, price.tokensAmount);
    });
    console.log(prices);
    addService(formData);

    hideOverlay();
    document.getElementById('addServicePopup').style.display = 'none';
});

// Functions to show and hide the overlay
function showOverlay() {
    document.getElementById('overlay').style.display = 'block';
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}
