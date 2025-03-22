document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.querySelector('.back');
    const rightButton = document.querySelector('.right');
    const cbitPortal = document.querySelector('.cbit-portal');
    const portalLogin = document.querySelector('.portal-login');
    const attendancePortal = document.querySelector('.attendance-portal');

    /* <-----------------Close Sidebar-----------------> */

    function showRight() {
        gsap.to(cbitPortal, {
            width: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: function () {
                cbitPortal.style.display = 'none';
                gsap.to(rightButton, {
                    display: 'flex',
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                });
            },
        });

        gsap.to(portalLogin, {
            scale: 0,
            opacity: 0,
            duration: 0.1,

        });

        gsap.to(attendancePortal, {
            width: '100vw',
            marginLeft: 0,
            duration: 0.8,
            ease: 'power2.out',
        });

    }

    /* <-----------------Show Sidebar-----------------> */

    function showBack() {
        cbitPortal.style.display = 'block';

        gsap.to(cbitPortal, {
            width: '20vw',
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        });

        gsap.to(portalLogin, {
            scale: 1,
            opacity: 1,
            duration: 0.8,

        });

        gsap.to(attendancePortal, {
            width: '80vw',
            marginLeft: '20vw',
            duration: 0.8,
            ease: 'power2.out',
        });

        gsap.to(rightButton, {
            opacity: 0,
            duration: 0.3,
            onComplete: function () {
                rightButton.style.display = 'none';
            },
        });
    }

    backButton.addEventListener('click', showRight);
    rightButton.addEventListener('click', showBack);
});

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit-portal');
    const usernameInput = document.querySelector('.input-portal');
    const timetableDiv = document.querySelector('.cbit-table');
    const arrowDownDiv = document.querySelector('.arrow-down');
    const subjectwiseDiv = document.querySelector('.subjectwise-attendace');

    /* <-----------------Attendance Timetable-----------------> */

    submitButton.addEventListener('click', function () {
        const inputValue = usernameInput.value;

        if (/^\d{12}$/.test(inputValue)) {
            gsap.fromTo(timetableDiv, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, display: 'flex' });
            gsap.fromTo(arrowDownDiv, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, display: 'flex' });
            subjectwiseDiv.style.display = 'flex'
        } else {
            alert('Please enter exactly 12 digits.');
        }
    });

});

/* <-----------------Attendance Calculator-----------------> */

document.querySelector('.arrow-down').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('attendance-container').scrollIntoView({
        behavior: 'smooth'
    });
});


const minusButtons = document.querySelectorAll('.minus-btn');
const plusButtons = document.querySelectorAll('.plus-btn');

/* <-----------------Decrement Input-----------------> */

minusButtons.forEach(button => {
    button.addEventListener('click', function () {
        const inputField = this.previousElementSibling;
        let currentValue = parseInt(inputField.value);
        if (currentValue > 0) {
            inputField.value = currentValue - 1;
            updateAttendancePercentage();
        }
    });
});

/* <-----------------Increment Input-----------------> */

plusButtons.forEach(button => {
    button.addEventListener('click', function () {
        const inputField = this.previousElementSibling.previousElementSibling;
        inputField.value = parseInt(inputField.value) + 1;
        updateAttendancePercentage();
    });
});

/* <-----------------Total Attendance-----------------> */

document.querySelectorAll('.attended-input input').forEach((inputField) => {
    inputField.addEventListener('input', function () {
        updateAttendancePercentage();
        autoUpdateSlider();
    });
});

/* <-----------------Subject Attendance-----------------> */

document.querySelectorAll('.attendance-input input').forEach((inputField) => {
    inputField.addEventListener('input', updateFutureAttendance);
});

const subjectDropdown = document.getElementById("subjectDropdown");
  const subjectSet = new Set(); // To store unique subjects
  
  // Select all the subject cells from the table
  const subjectCells = document.querySelectorAll(".subject-attendance table tr td:nth-child(2)");

  // Iterate through each subject cell and add unique subjects to the set
  subjectCells.forEach(cell => {
    subjectSet.add(cell.textContent.trim());
  });

  // Populate the dropdown with the unique subjects
  subjectSet.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectDropdown.appendChild(option);
  });

/* <-----------------Total Attendance-----------------> */

function updateAttendancePercentage() {
    const classesAttended = parseInt(document.querySelector('.classes-attended input').value);
    const totalClasses = parseInt(document.querySelector('.total-classes input').value);
    const percentageElement = document.querySelector('.Current-percentage');
    const totalPercentage = document.querySelector('.total-percentage');

    if (totalClasses > 0) {
        const percentage = ((classesAttended / totalClasses) * 100).toFixed(2);
        percentageElement.textContent = `${percentage}%`;
        totalPercentage.textContent = `${percentage}%`;
    } else {
        percentageElement.textContent = '0.00%';
    }
}

/* <-----------------Future Attendance-----------------> */

function updateFutureAttendance() {
    const currentAttended = parseInt(document.querySelector('.classes-attended input').value) || 0;
    const currentTotal = parseInt(document.querySelector('.total-classes input').value) || 0;

    const planningToAttend = parseInt(document.querySelector('.attend-plan input').value) || 0;
    const planningToSkip = parseInt(document.querySelector('.skip-plan input').value) || 0;

    const futureAttended = currentAttended + planningToAttend;
    const futureTotal = currentTotal + planningToAttend + planningToSkip;

    let futurePercentage = 0;
    if (futureTotal > 0) {
        futurePercentage = (futureAttended / futureTotal) * 100;
    }

    document.querySelector('.Future-percentage').textContent = futurePercentage.toFixed(2) + '%';

    const futurePercentageElement = document.querySelector('.Future-percentage');
    const planningAlertElement = document.querySelector('.planning-alert');

    if (planningToAttend > 0 || planningToSkip > 0) {
        futurePercentageElement.textContent = futurePercentage.toFixed(2) + '%';
        futurePercentageElement.style.display = 'block';
        planningAlertElement.style.display = 'none';
    } else {
        futurePercentageElement.style.display = 'none';
        planningAlertElement.style.display = 'block';
    }
}

/* <-----------------Target Attendance-----------------> */

function updateSliderValue(slider) {
    const sliderValueSpan = document.getElementById('sliderValue');
    const targetPercentage = parseInt(slider.value);
    sliderValueSpan.textContent = targetPercentage;

    // Update the slider background dynamically to change the red line length
    slider.style.background = `linear-gradient(to right, #ff4b4b ${targetPercentage}%, #2e2e2e ${targetPercentage}%)`;

    const currentAttended = parseInt(document.querySelector('.classes-attended input').value) || 0;
    const currentTotal = parseInt(document.querySelector('.total-classes input').value) || 0;

    if (currentTotal === 0) return;

    const currentPercentage = (currentAttended / currentTotal) * 100;
    const neededClassDiv = document.querySelector('.needed-class');
    const bunkClassDiv = document.querySelector('.bunk-class');
    const neededPercentage = document.querySelector('.needed-percentage');

    if (targetPercentage === 100 && currentPercentage < 100) {
        neededClassDiv.style.display = 'none';
        bunkClassDiv.style.display = 'block';
        bunkClassDiv.innerHTML = "Stop dreaming! Nobody reaches 100% attendance";
        neededPercentage.textContent = "Infinite";
    } else if (currentPercentage >= targetPercentage) {
        const maxBunkable = Math.floor((currentAttended - targetPercentage / 100 * currentTotal) / (targetPercentage / 100));
        neededClassDiv.style.display = 'none';
        bunkClassDiv.style.display = 'block';
        bunkClassDiv.innerHTML = `Classes you can bunk while staying above ${targetPercentage}%`;
        neededPercentage.textContent = `${maxBunkable}`;
    } else {
        const classesNeeded = Math.ceil((targetPercentage / 100 * currentTotal - currentAttended) / (1 - targetPercentage / 100));
        neededClassDiv.style.display = 'block';
        bunkClassDiv.style.display = 'none';
        neededClassDiv.innerHTML = `Classes Needed to reach ${targetPercentage}%`;
        neededPercentage.textContent = `${classesNeeded}`;
    }
}

// document.querySelector('.needed-class').style.display = 'none';
document.querySelector('.bunk-class').style.display = 'none';

function autoUpdateSlider() {
    const slider = document.getElementById('targetRange');
    updateSliderValue(slider);
}

document.getElementById('targetRange').addEventListener('input', function () {
    updateSliderValue(this);
});
