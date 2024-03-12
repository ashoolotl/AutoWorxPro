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
    const serviceAddToCartNoUserButton = document.getElementById(
        'serviceAddToCartNoUser'
    );

    // Check if the button element exists
    if (serviceAddToCartNoUserButton) {
        // Add click event listener to the button
        serviceAddToCartNoUserButton.addEventListener(
            'click',
            function (event) {
                // Perform the desired action when the button is clicked
                // For example, you can display a message or perform a redirect
                alert(
                    'You must be logged in to be able to add a service to the cart.'
                );
                window.location.href = '/login';

                // Add your logic here for what should happen when the button is clicked
            }
        );
    }
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

    // Append form fields to FormData
    formData.append('name', document.getElementById('name').value);
    formData.append(
        'description',
        document.getElementById('description').value
    );
    formData.append('duration', document.getElementById('duration').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    // Get selected checkboxes and prepare prices data
    const prices = [];
    const checkboxes = document.querySelectorAll(
        'input[name="selectedItems"]:checked'
    );
    checkboxes.forEach(function (checkbox) {
        const priceInput = checkbox.nextElementSibling;
        const price = Number(priceInput.value);
        prices.push({ vehicleClassification: checkbox.value, price: price });
    });

    // Append prices data to FormData as individual fields
    prices.forEach((price, index) => {
        formData.append(
            `prices[${index}][vehicleClassification]`,
            price.vehicleClassification
        );
        formData.append(`prices[${index}][price]`, price.price);
    });

    // Call addService with the FormData object
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
