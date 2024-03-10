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
