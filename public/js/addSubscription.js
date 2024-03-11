const addSubscription = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/subscriptions',
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
document.addEventListener('DOMContentLoaded', function () {
    const bottomContainer = document.querySelector('.bottom-container');

    bottomContainer.addEventListener('click', function (event) {
        if (event.target.matches('#subscriptionEdit')) {
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
    document.getElementById('addSubPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function () {
    hideOverlay();
    document.getElementById('addSubPopup').style.display = 'none';
});

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    const prices = [];

    // Get all selected checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');

    checkboxes.forEach((checkbox) => {
        const serviceName = checkbox.value;
        const priceInput = checkbox.parentElement.querySelector(
            'input[name="price"]'
        );
        const tokenInput = checkbox.parentElement.querySelector(
            'input[name="token"]'
        );

        // Convert price and tokensAmount to numbers
        const price = parseInt(priceInput.value);
        const tokensAmount = parseInt(tokenInput.value);
        prices.push({
            service: serviceName,
            price: price,
            tokensAmount: tokensAmount,
        });
    });
    prices.forEach((price, index) => {
        formData.append(`prices[${index}][service]`, price.service);
        formData.append(`prices[${index}][price]`, price.price);
        formData.append(`prices[${index}][tokensAmount]`, price.tokensAmount);
    });

    // Append the prices array to formData under prices field
    addSubscription(formData);
    console.log(prices);
    hideOverlay();
    document.getElementById('addSubPopup').style.display = 'none';

    // write the code here
});

// Functions to show and hide the overlay
function showOverlay() {
    document.getElementById('overlay').style.display = 'block';
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}
