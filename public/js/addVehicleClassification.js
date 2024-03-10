const addVehicle = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/vehicle-classifications',
            data,
        });

        console.log('ako si status');
        console.log(res.data.status);
        if (res.data.status == 'success') {
            document.getElementById('successPopup').style.display = 'block';
        }
    } catch (err) {
        alert(err.response.data.message);
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
        document.getElementById('addCarPopup').style.display = 'none';
        // code here call the function to add fcking image
        console.log(document.getElementById('vehicleClassification').value);
        console.log(document.getElementById('photo').files[0]);
        const form = new FormData();
        form.append(
            'name',
            document.getElementById('vehicleClassification').value
        );
        form.append('photo', document.getElementById('photo').files[0]);
        addVehicle(form);
    }); // when submitted, hide form popup then show success popup

document
    .getElementById('closeSuccessPopup')
    .addEventListener('click', function () {
        document.getElementById('successPopup').style.display = 'none';
    }); // closing of success popup through x button

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('successPopup').style.display = 'none';
    window.location.reload();
}); // closing of success popup after clicking done button
