//const Razorpay = require('razorpay');

//const { ServerConfig } = require('../../config');

document.getElementById('rzp-button1').onclick = function (e) {
    var bookingDetails = fetch("api/v1/bookings/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: '4',
            flightId: '6',
            noOfSeats: '10'
        }),
    });
   console.log(bookingDetails);
    var Pay = fetch("api/v1/bookings/verifyPayment", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: "rzp_test_w5qmsgC0CIfsVk",
            bookingId: bookingDetails.bookingId,
            amount:  bookingDetails.totalPrice,
            currency: "INR"
        }),
    })

    var options = {
        key: "rzp_test_w5qmsgC0CIfsVk",
        bookingId: bookingDetails.bookingId,
        amount: bookingDetails.totalPrice,
        currency: "INR"
    }

    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
}
