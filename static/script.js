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

/* <-----------------Attendance Timetable-----------------> */

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit-portal');
    const usernameInput = document.querySelector('.input-portal');
    const timetableDiv = document.querySelector('.cbit-table');
    const arrowDownDiv = document.querySelector('.arrow-down');
    const subjectwiseDiv = document.querySelector('.subjectwise-attendace');
    const loadingDiv = document.getElementById('loading');  // Get the loading div

    submitButton.addEventListener('click', function () {
        const inputValue = usernameInput.value;

        if (/^\d{12}$/.test(inputValue)) {
            // Show loading animation
            loadingDiv.style.display = 'block';
            // Hide the table initially
            timetableDiv.style.display = 'none';

            // Fetch the attendance data
            fetchAttendance(inputValue);
        } else {
            alert('Please enter exactly 12 digits.');
        }
    });

    // Function to fetch attendance data from the backend
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
                // Hide loading animation
                loadingDiv.style.display = 'none';

                // Display the timetable and other elements
                gsap.fromTo(timetableDiv, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, display: 'flex' });
                gsap.fromTo(arrowDownDiv, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, display: 'flex' });
                subjectwiseDiv.style.display = 'flex';

                // Populate the table with fetched data
                populateAttendanceTable(data);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
                loadingDiv.style.display = 'none'; // Hide loading animation in case of error
                alert('Failed to fetch attendance data. Please try again.');
            });
    }

    // Function to dynamically fill the table with the fetched JSON data
    function populateAttendanceTable(data) {
        const tableBody = document.getElementById('attendance-body');
        tableBody.innerHTML = "";  // Clear any existing rows
        console.log(data)

        let totalAttendancePercentage = 0;

        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach((row, index) => {
                const tr = document.createElement('tr');

                // Create and append table cells (td) for each value in the row
                tr.innerHTML = `
                    <td>${row["SlNo"] || index + 1}</td>  <!-- S.No -->
                    <td>${row["Subject"] || "N/A"}</td>  <!-- Subject Name -->
                    <td>${row["Classes Held"] || "0"}</td>  <!-- Classes Held -->
                    <td>${row["Classes Attended"] || "0"}</td>  <!-- Classes Attended -->
                    <td>${row["Att %"] || "0%"}</td>     <!-- Attendance Percentage -->
                `;

                tableBody.appendChild(tr);  // Append the row to the table body

                if (row["Faculty"] === "Total" && row["Att %"]) {
                    totalAttendancePercentage = row["Att %"];
                }
            });

            // Show the attendance table if there is data
            document.getElementById("attendanceTable").style.display = "table";

            document.querySelector('.att-percentage').textContent = totalAttendancePercentage + "%";
        } else {
            // If no data is returned, display a message
            document.getElementById("attendanceTable").style.display = "none";
            alert("No data found for the entered roll number.");
        }
    }

    // Helper function to update the attendance percentage
    function updatePercentage() {
        const attendedClasses = document.querySelector('.current-attendance input[type="number"]:nth-child(1)').value;
        const totalClasses = document.querySelector('.current-attendance input[type="number"]:nth-child(3)').value;
        const currentPercentage = (attendedClasses / totalClasses) * 100 || 0;
        document.querySelector('.Current-percentage').textContent = currentPercentage.toFixed(2) + "%";
    }

    // Helper function for subject dropdown (if needed)
    function filterAttendance() {
        const selectedSubject = document.getElementById("subjectDropdown").value;
        const rows = document.querySelectorAll("#attendance-body tr");

        rows.forEach(row => {
            const subjectCell = row.querySelector('td:nth-child(2)').textContent;
            if (selectedSubject === "all" || subjectCell === selectedSubject) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Update slider value for target percentage
    function updateSliderValue(slider) {
        document.getElementById("sliderValue").textContent = slider.value;
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

document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector(".subject-attendance table tbody");

    if (table) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const subjectCells = document.querySelectorAll(".subject-attendance table tbody tr td:nth-child(2)");

            if (subjectCells.length > 0) {
                initializeAttendance();
                observer.disconnect(); // Disconnect observer once the content is loaded
            }
        });
        observer.observe(table, { childList: true, subtree: true });
    } else {
        console.error("Table not found!");
    }

    function initializeAttendance() {
        const subjectDropdown = document.getElementById("subjectDropdown");
        const subjectSet = new Set();
        const subjectPercentage = document.querySelector('.subject-percentage');
        const totalPercentage = document.querySelector('.total-percentage');
        const attendedInput = document.querySelector('.attended-input input');

        const subjectCells = document.querySelectorAll(".subject-attendance table tbody tr td:nth-child(2)");

        console.log("Subject cells:", subjectCells);
        console.log("initialized");

        subjectCells.forEach(cell => {
            const subjectText = cell.textContent.trim();
            if (subjectText) {
                subjectSet.add(subjectText);
            }
        });

        console.log("Unique subjects set:", subjectSet);

        const allSubjectsOption = document.createElement("option");
        allSubjectsOption.value = "all";
        allSubjectsOption.textContent = "All Subjects";
        subjectDropdown.appendChild(allSubjectsOption);

        subjectSet.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = subject;
            subjectDropdown.appendChild(option);
        });

        subjectDropdown.value = "all";

        subjectDropdown.addEventListener('change', function () {
            filterAttendance(subjectDropdown.value);
            // updateAttendance();
        });

        // Event listener for input field change
        attendedInput.addEventListener('input', updateAttendance);

        // Function to update attendance based on the skipped classes input
        function updateAttendance() {
            const skippedClasses = parseInt(attendedInput.value, 10) || 0;
            const subjectDropdown = document.getElementById("subjectDropdown");
            const selectedSubject = subjectDropdown.value;
            const rows = document.querySelectorAll(".subject-attendance table tbody tr");

            let totalClassesHeld = 0;
            let totalClassesAttended = 0;
            let subjectClassesHeld = 0;
            let subjectClassesAttended = 0;

            rows.forEach(row => {
                const subjectCell = row.querySelector('td:nth-child(2)'); // Get the subject column cell
                if (!subjectCell) return; // Skip rows without subject column
                const subjectText = subjectCell.textContent.trim();

                // Extract classes held and classes attended for each row
                const classesHeldCell = row.querySelector('td:nth-child(3)');
                const classesAttendedCell = row.querySelector('td:nth-child(4)');

                const classesHeld = parseInt(classesHeldCell.textContent.trim()) || 0;
                const classesAttended = parseInt(classesAttendedCell.textContent.trim()) || 0;

                // If "All Subjects" is selected, update total classes
                if (selectedSubject === "all" || subjectText === selectedSubject) {
                    totalClassesHeld += classesHeld;
                    totalClassesAttended += classesAttended;

                    // If the selected subject matches, update the subject attendance as well
                    if (selectedSubject === subjectText) {
                        subjectClassesHeld = classesHeld;
                        subjectClassesAttended = classesAttended;
                    }
                }
            });

            // Calculate the subject attendance percentage
            const subjectTotalClasses = subjectClassesHeld + skippedClasses;
            const subjectAttendedClasses = subjectClassesAttended + skippedClasses;
            const subjectAttPercentage = ((subjectAttendedClasses / subjectTotalClasses) * 100).toFixed(2);
            subjectPercentage.textContent = `${subjectAttPercentage}%`;

            // Calculate the total attendance percentage
            const totalTotalClasses = totalClassesHeld + skippedClasses;
            const totalAttendedClasses = totalClassesAttended + skippedClasses;
            const totalAttPercentage = ((totalAttendedClasses / totalTotalClasses) * 100).toFixed(2);
            totalPercentage.textContent = `${totalAttPercentage}%`;
        }

        // Function to filter attendance by subject
        function filterAttendance() {
            const subjectDropdown = document.getElementById("subjectDropdown");
            const selectedSubject = subjectDropdown.value;
            const rows = document.querySelectorAll(".subject-attendance table tbody tr");
            const attendedInput = document.querySelector('.attended-input input');
            const subjectPercentage = document.querySelector('.subject-percentage');
            const totalPercentage = document.querySelector('.total-percentage');
            const skippedClasses = parseInt(attendedInput.value, 10) || 0;
            const lastRow = rows[rows.length - 1];
            const overallClassesHeld = lastRow.querySelectorAll("td")[2];
            const overallClassesAttended = lastRow.querySelectorAll("td")[3];


            let totalClassesHeld = 0;
            let totalClassesAttended = 0;

            rows.forEach(row => {
                const subjectCell = row.querySelector('td:nth-child(2)'); // Get the subject column cell
                if (!subjectCell) return; // Skip rows without subject column
                const subjectText = subjectCell.textContent.trim();

                // If the selected subject matches, calculate the attendance for that subject
                if (subjectText === selectedSubject) {
                    const classesHeldCell = row.querySelector('td:nth-child(3)');
                    const classesAttendedCell = row.querySelector('td:nth-child(4)');

                    const classesHeld = parseInt(classesHeldCell.textContent.trim()) || 0;
                    const classesAttended = parseInt(classesAttendedCell.textContent.trim()) || 0;

                    // Add to the total classes held and attended for calculating total attendance
                    totalClassesHeld += classesHeld + skippedClasses;
                    totalClassesAttended += classesAttended;

                    // Calculate the subject attendance percentage
                    const subjectAttendancePercentage = ((classesAttended / classesHeld) * 100).toFixed(2);
                    subjectPercentage.textContent = `${subjectAttendancePercentage}%`;


                    overallClassesHeld += skippedClasses;
                    const overallClassesPercentage = ((overallClassesAttended / overallClassesHeld) * 100).toFixed(2);
                    totalPercentage.textContent = `${overallClassesPercentage}%`;

                }
            });

            if (selectedSubject === "all") {
                const skippedClasses = parseInt(attendedInput.value, 10) || 0;
                const attendedClasses = overallClassesAttended;
                const totalClasses = overallClassesHeld + skippedClasses;
                const totalAttendancePercentage = ((attendedClasses / totalClasses) * 100).toFixed(2);
                totalPercentage.textContent = `${totalAttendancePercentage}%`;
                subjectPercentage.textContent = `${totalAttendancePercentage}%`;
            }

        }

        // updateAttendance();
    }
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

/* <-----------------Cbit Portal-----------------> */

// Fetch attendance data when the "Get Attendance" button is clicked
