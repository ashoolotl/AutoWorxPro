const addVehicle = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/vehicles',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
            },
            data,
        });

        if (res.data.status == 'success') {
            alert('Vehicle added');
            window.setTimeout(() => {
                location.assign('/dashboard');
            }, 1500);
        }
    } catch (err) {
        alert(err.response.data.message);
        console.log(data);
    }
};

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
        const vehicleData = {
            classification: document.getElementById('classType').value,
            brand: document.getElementById('carBrand').value,
            plateNumber: document.getElementById('plateNumber').value,
            owner: document.getElementById('userId').value,
        };

        addVehicle(vehicleData);
        // document.getElementById('successPopup').style.display = 'block';
    }); // when submitted, hide form popup then show success popup

document
    .getElementById('closeSuccessPopup')
    .addEventListener('click', function () {
        document.getElementById('successPopup').style.display = 'none';
    }); // closing of success popup through x button

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('successPopup').style.display = 'none';
}); // closing of success popup after clicking done button
