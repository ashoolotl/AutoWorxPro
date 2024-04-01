const getAvailedSubscription = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/subscriptionsAvailed/${id}`,
        });
        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
let allService = [];
async function showPopupSubscription(subscriptionId) {
    const availedSubscription = await getAvailedSubscription(subscriptionId);
    console.log(availedSubscription);

    document.getElementById(
        `subscriptionPopupPlateNumber`
    ).textContent = `Subscription for vehicle: ${availedSubscription.data.subscriptionUserAvailed.plateNumber}`;
    document.getElementById(`subscriptionPopup`).style.display = 'block';

    const servicesInsideSubscription =
        availedSubscription.data.subscriptionUserAvailed.subscriptionDetails;

    allService = servicesInsideSubscription;
    console.log(servicesInsideSubscription);
    generateSubscriptionPopup(servicesInsideSubscription);
}
function closePopupSubscription() {
    document.getElementById(`subscriptionPopup`).style.display = 'none';
}

function generateSubscriptionPopup(services) {
    // Step 1: Find the h2#subscriptionPopupPlateNumber element
    const subscriptionPlateNumber = document.getElementById(
        'subscriptionPopupPlateNumber'
    );

    // Clear existing elements next to subscriptionPlateNumber
    let nextElement = subscriptionPlateNumber.nextElementSibling;
    while (nextElement) {
        const siblingToRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        siblingToRemove.remove();
    }
    let counter = 0;
    // Step 2: Create subscription content dynamically

    for (service of services) {
        const subscriptionPopupServiceName = document.createElement('h2');
        subscriptionPopupServiceName.id = 'subscriptionPopupServiceName';
        subscriptionPopupServiceName.textContent = `${service.service
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            )} Token Remaining Tokens: ${service.tokensAmount}`;

        const hrElement1 = document.createElement('hr');

        const popupContent = document.createElement('div');
        popupContent.classList.add('popupContent');
        popupContent.setAttribute('data-service-id', counter);

        const plateNumberSpan = document.createElement('span');
        plateNumberSpan.classList.add('bookingPopupPlateNumber');

        const strongElement = document.createElement('strong');
        strongElement.textContent = `Price: 1 ${service.service
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())} Token`;

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('contentWrapper', 'Tokens');

        const imageSelectDiv = document.createElement('div');
        imageSelectDiv.classList.add('image-select');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.checked = false;
        radioButton.name = 'subscriptionSelected';
        radioButton.value = counter;

        const image = document.createElement('img');
        image.id = 'subscriptionPopupImg';
        image.src = `/images/services/${service.service}.jpeg`;
        image.alt = `Image for ${service.service}`;

        const hiddenInput = document.createElement('input');
        hiddenInput.id = 'subscriptionBookingId';
        hiddenInput.type = 'hidden';

        // Step 3: Append subscription content to the subscriptionPlateNumber element

        plateNumberSpan.appendChild(strongElement);
        contentWrapper.appendChild(imageSelectDiv);
        contentWrapper.appendChild(hiddenInput);
        imageSelectDiv.appendChild(radioButton);
        imageSelectDiv.appendChild(image);
        popupContent.appendChild(plateNumberSpan);
        popupContent.appendChild(contentWrapper);

        subscriptionPlateNumber.insertAdjacentElement('afterend', popupContent);
        subscriptionPlateNumber.insertAdjacentElement('afterend', hrElement1);
        subscriptionPlateNumber.insertAdjacentElement(
            'afterend',
            subscriptionPopupServiceName
        );

        counter++;
    }
    const lastPopupContent = document.querySelector(
        '.popupContent[data-service-id="0"]'
    );

    console.log(lastPopupContent);

    // Create the button
    const bookingButton = document.createElement('button');
    bookingButton.classList.add('booking');
    bookingButton.textContent = 'Proceed to Booking';
    bookingButton.onclick = showDateTimePopupSubscription; // Assuming showDateTimePopup is your function name
    // Insert the button after the last popupContent div
    lastPopupContent.insertAdjacentElement('afterend', bookingButton);
    // Query all radio buttons with the name "subscriptionRadio"
    const radioButtons = document.querySelectorAll(
        'input[type="radio"][name="subscriptionSelected"]'
    );
    radioButtons[0].checked = true;

    // listen to radio buttons

    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', function () {
            // Your event handling code here
            console.log('Radio button changed:', radioButton.value);
            console.log(allService[radioButton.value]);
            selectedRadioButton = radioButton.value;
        });
    });
}

function showDateTimePopupSubscription() {}
