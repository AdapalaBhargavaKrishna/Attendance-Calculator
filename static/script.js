document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.querySelector('.back');
    const rightButton = document.querySelector('.right');
    const cbitPortal = document.querySelector('.cbit-portal');
    const portalLogin = document.querySelector('.portal-login');
    const attendancePortal = document.querySelector('.attendance-portal');

    /* <-----------------Close Sidebar-----------------> */

    function showRight() {
        if (window.innerWidth > 768) {
            // For larger screens (desktop)
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

        } else {
            // For smaller screens (mobile/tablets)
            console.log("Mobile view triggered for showRight");  // Debugging log
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

            gsap.to(rightButton, {
                opacity: 1,
                duration: 0.3,
                onComplete: function () {
                    rightButton.style.visibility = 'visible'; // Hide the right button
                },
            });

        }
    }


    function showBack() {
        if (window.innerWidth > 768) {
            // For larger screens (desktop)
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

        } else {
            console.log("Mobile view triggered");

            cbitPortal.style.display = 'block';
            cbitPortal.style.visibility = 'visible';

            gsap.to(cbitPortal, {
                width: '100vw',
                opacity: 1,
                duration: 0.8,
                zIndex: 1000,
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
    }

    // Event listeners for showing/hiding the sidebar
    backButton.addEventListener('click', showRight);
    rightButton.addEventListener('click', showBack);


});

/* <-----------------Attendance Table-----------------> */

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit-portal');
    const usernameInput = document.querySelector('.input-portal');
    const cbitTableDiv = document.querySelector('.cbit-table');
    const arrowDownDiv = document.querySelector('.arrow-down');
    const subjectwiseDiv = document.querySelector('.subjectwise-attendace');
    const loadingDiv = document.getElementById('loading');

    submitButton.addEventListener('click', function () {
        const inputValue = usernameInput.value;

        if (/^\d{12}$/.test(inputValue)) {

            loadingDiv.style.display = 'block';
            cbitTableDiv.style.display = 'none';

            fetchAttendance(inputValue);
        } else {
            alert('Please enter exactly 12 digits.');
        }
    });

    /* <-----------------Fetch Table-----------------> */

    function fetchAttendance(rollNumber) {
        fetch('/get_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: rollNumber })
        })
            .then(response => response.json())
            .then(data => {

                loadingDiv.style.display = 'none';

                gsap.fromTo(cbitTableDiv, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, display: 'flex' });
                gsap.fromTo(arrowDownDiv, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, display: 'flex' });
                subjectwiseDiv.style.display = 'flex';

                GetAttendanceTable(data);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
                loadingDiv.style.display = 'none';
                alert('Failed to fetch attendance data. Please try again.');
            });
    }

    /* <-----------------Fill Table-----------------> */

    function GetAttendanceTable(data) {
        const tableBody = document.getElementById('attendance-body');
        tableBody.innerHTML = "";
        console.log(data)

        let totalAttendancePercentage = 0;

        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach((row, index) => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${row["SlNo"] || index + 1}</td>  <!-- S.No -->
                    <td>${row["Subject"] || "N/A"}</td>  <!-- Subject Name -->
                    <td>${row["Classes Held"] || "0"}</td>  <!-- Classes Held -->
                    <td>${row["Classes Attended"] || "0"}</td>  <!-- Classes Attended -->
                    <td>${row["Att %"] || "0%"}</td>     <!-- Attendance Percentage -->
                `;

                tableBody.appendChild(tr);

                if (row["Faculty"] === "Total" && row["Att %"]) {
                    totalAttendancePercentage = row["Att %"];
                }
            });

            document.getElementById("attendanceTable").style.display = "table";
            document.querySelector('.att-percentage').textContent = totalAttendancePercentage + "%";
        } else {
            document.getElementById("attendanceTable").style.display = "none";
            alert("No data found for the entered roll number.");
        }
    }
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
            updateFutureAttendance();
            autoUpdateSlider();
            subjectAttendance();
        }
    });
});

/* <-----------------Increment Input-----------------> */

plusButtons.forEach(button => {
    button.addEventListener('click', function () {
        const inputField = this.previousElementSibling.previousElementSibling;
        inputField.value = parseInt(inputField.value) + 1;
        updateAttendancePercentage();
        updateFutureAttendance();
        autoUpdateSlider();
        subjectAttendance();
    });
});

/* <-----------------Input Attendance-----------------> */

document.querySelectorAll('.attended-input input').forEach((inputField) => {
    inputField.addEventListener('input', function () {
        updateAttendancePercentage();
        updateFutureAttendance()
        autoUpdateSlider();
        subjectAttendance();
    });
});

document.querySelectorAll('.attendance-input input').forEach((inputField) => {
    inputField.addEventListener('input', function () {
        updateFutureAttendance();
    });
});

/* <-----------------Total Attendance-----------------> */

function updateAttendancePercentage() {
    const classesAttended = parseInt(document.querySelector('.classes-attended input').value);
    const totalClasses = parseInt(document.querySelector('.total-classes input').value);
    const percentageElement = document.querySelector('.Current-percentage');

    if (totalClasses > 0) {
        const percentage = ((classesAttended / totalClasses) * 100).toFixed(2);
        percentageElement.textContent = `${percentage}%`;
    } else {
        percentageElement.textContent = '0.00%';
    }
}

/* <-----------------Current Attendance-----------------> */

document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector(".subject-attendance table tbody");

    if (table) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const subjectCells = document.querySelectorAll(".subject-attendance table tbody tr td:nth-child(2)");

            if (subjectCells.length > 0) {
                initializeCurrentAttendance();
                observer.disconnect();
            }
        });
        observer.observe(table, { childList: true, subtree: true });
    } else {
        console.error("Table not found!");
    }

    function initializeCurrentAttendance() {
        const lastRow = table.querySelector("tr:last-child");
        const attendedInput = document.querySelector('.current-attendance .classes-attended input');
        const totalClassesInput = document.querySelector('.current-attendance .total-classes input');

        const classesAttended = parseInt(lastRow.querySelector('td:nth-child(4)').textContent.trim(), 10) || 0;
        const totalClasses = parseInt(lastRow.querySelector('td:nth-child(3)').textContent.trim(), 10) || 0;

        attendedInput.value = classesAttended;
        totalClassesInput.value = totalClasses;

        updateCurrentAttendancePercentage(classesAttended, totalClasses);
    }

    function updateCurrentAttendancePercentage(classesAttended, totalClasses) {
        const percentage = (totalClasses > 0) ? ((classesAttended / totalClasses) * 100).toFixed(2) : 0;
        const percentageElement = document.querySelector('.current-attendance .Current-percentage');
        percentageElement.textContent = `${percentage}%`;
        autoUpdateSlider();

    }
});

/* <-----------------Subject Attendance-----------------> */

document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector(".subject-attendance table tbody");

    if (table) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const subjectCells = document.querySelectorAll(".subject-attendance table tbody tr td:nth-child(2)");

            if (subjectCells.length > 0) {
                initializeAttendance();
                observer.disconnect();
            }
        });
        observer.observe(table, { childList: true, subtree: true });
    } else {
        console.error("Table not found!");
    }

    function initializeAttendance() {
        const subjectDropdown = document.getElementById("subjectDropdown");
        const subjectSet = new Set();
        const subjectwiseInput = document.querySelector('.subjectwise-input input');

        const subjectCells = document.querySelectorAll(".subject-attendance table tbody tr td:nth-child(2)");

        subjectCells.forEach(cell => {
            const subjectText = cell.textContent.trim();
            if (subjectText) {
                subjectSet.add(subjectText);
            }
        });

        subjectSet.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = subject;
            subjectDropdown.appendChild(option);
        });

        subjectDropdown.addEventListener('change', function () {
            subjectAttendance();
        });

        subjectwiseInput.addEventListener('input', function () {
            subjectAttendance();
        });

        /* <-----------------Decrement Input-----------------> */

        const minusButtons = document.querySelectorAll('.minus');
        minusButtons.forEach(button => {
            button.addEventListener('click', function () {
                const inputField = this.closest('.subjectwise-input').querySelector('input');
                let currentValue = parseInt(inputField.value);
                if (currentValue > 0) {
                    inputField.value = currentValue - 1;
                    subjectAttendance();
                }
            });
        });

        /* <-----------------Increment Input-----------------> */
        const plusButtons = document.querySelectorAll('.plus');
        plusButtons.forEach(button => {
            button.addEventListener('click', function () {
                const inputField = this.closest('.subjectwise-input').querySelector('input');
                inputField.value = parseInt(inputField.value) + 1;
                subjectAttendance();
            });
        });

        subjectAttendance();
    }

    /* <-----------------Subject Attendance Predict-----------------> */

    function subjectAttendance() {
        const skippedClasses = parseInt(document.querySelector('.subjectwise-input input').value, 10) || 0;
        const subjectDropdown = document.getElementById("subjectDropdown");
        const selectedSubject = subjectDropdown.value;

        const rows = document.querySelectorAll(".subject-attendance table tbody tr");
        const subjectPercentage = document.querySelector('.subject-percentage');

        let subjectClassesHeld = 0;
        let subjectClassesAttended = 0;

        rows.forEach(row => {
            const subjectCell = row.querySelector('td:nth-child(2)');
            if (!subjectCell) return;
            const subjectText = subjectCell.textContent.trim();

            const classesHeldCell = row.querySelector('td:nth-child(3)');
            const classesAttendedCell = row.querySelector('td:nth-child(4)');

            const classesHeld = parseInt(classesHeldCell.textContent.trim()) || 0;
            const classesAttended = parseInt(classesAttendedCell.textContent.trim()) || 0;

            if (selectedSubject === "select" || subjectText === selectedSubject) {
                subjectClassesHeld += classesHeld;
                subjectClassesAttended += classesAttended;
            }
        });

        const subjectTotalClasses = subjectClassesHeld + skippedClasses;
        const subjectAttPercentage = ((subjectClassesAttended / subjectTotalClasses) * 100).toFixed(2);
        subjectPercentage.textContent = `${subjectAttPercentage}%`;
    }

});

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

    // Update the position of the slider value span
    const sliderWidth = slider.offsetWidth;
    const valuePosition = (targetPercentage / 100) * sliderWidth;
    sliderValueSpan.style.left = `${valuePosition}px`;

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

document.querySelector('.bunk-class').style.display = 'none';

function autoUpdateSlider() {
    const slider = document.getElementById('targetRange');
    updateSliderValue(slider);
}

document.getElementById('targetRange').addEventListener('input', function () {
    updateSliderValue(this);
});