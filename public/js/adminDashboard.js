async function showMoreInformation(
    serviceBookingId,
    ownerId,
    bookingReferenceNumber,
    serviceName
) {
    const userInformation = await getUserInformation(ownerId);
    console.log(userInformation);

    document.getElementById('first-name').textContent =
        userInformation.data.user.firstName;
    document.getElementById('last-name').textContent =
        userInformation.data.user.lastName;
    document.getElementById('user-email').textContent =
        userInformation.data.user.email;
    document.getElementById('booking-reference-number').textContent =
        bookingReferenceNumber;
    document.getElementById('wash-type').textContent = serviceName;

    document.getElementById('showMoreInfoPopup').style.display = 'block';
}
function closeMoreInfoPopup() {
    document.getElementById('showMoreInfoPopup').style.display = 'none';
}

const getUserInformation = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/users/${id}`,
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};

async function showUpdateServicePopup(serviceBookingId, ownerId) {
    document.getElementById(`status-form`).style.display = 'block';
    document.getElementById('statusFormHiddenId').value = serviceBookingId;
    document.getElementById('statusFormHiddenOwnerId').value = ownerId;
}
function closeStatusForm() {
    document.getElementById(`status-form`).style.display = 'none';
}
// // function to update service booking
const updateBooking = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
    }
};
// // functiom to update vehicle status by user view
document
    .getElementById('status-change-form')
    .addEventListener('submit', async function (event) {
        event.preventDefault();
        const serviceBookingToUpdateId =
            document.getElementById('statusFormHiddenId').value;
        const serviceOwner = document.getElementById(
            'statusFormHiddenOwnerId'
        ).value;

        var selectElement = document.getElementById('status-select');

        var selectedIndex = selectElement.selectedIndex;
        var selectedValue = selectElement.options[selectedIndex].value;
        var options = selectElement.options;

        // set the text to reflect fast
        document.getElementById(
            `displayBookingStatus${serviceBookingToUpdateId}`
        ).textContent = selectedValue;

        // check if last subscription

        // hide the form

        // update

        var buttonElement = document.getElementById('changeButton');
        buttonElement.disabled = true;

        // update user and the service
        const bookingData = {
            status: selectedValue,
        };

        if (selectedIndex === selectElement.options.length - 1) {
            // if done update the vehicle status to not available
            // remove them from availed services
            const bookingData = {
                status: 'Completed',
            };
            const serviceAvailedData = {
                status: 'Not Available',
            };
            await updateBooking(bookingData, serviceBookingToUpdateId);
            await updateVehicleStatusByPlateNumber(
                serviceAvailedData,
                serviceOwner
            );
            // remove it from users availed service
            console.log(serviceBookingToUpdateId);
            removeBookingFromVehiclesAvailed(serviceBookingToUpdateId);
        } else {
            await updateBooking(bookingData, serviceBookingToUpdateId);

            await updateVehicleStatusByPlateNumber(bookingData, serviceOwner);
        }
    });

const removeBookingFromVehiclesAvailed = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/servicesAvailed/${id}`,
        });
        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
};
const updateVehicleStatusByPlateNumber = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicles/unit/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
    }
};
function checkStatusChange() {
    var buttonElement = document.getElementById('changeButton');
    buttonElement.disabled = false;
}
