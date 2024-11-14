let allCourses = [];

function fetchCourses() {
    fetch('./courses.json')
        .then(response => response.json())
        .then(data => {
            allCourses = data.courses;
            document.getElementById('loading').style.display = 'none';
            displayCourses(allCourses);
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
            document.getElementById('loading').textContent = 
                'Error loading courses. Please try again later.';
        });
}

function displayCourses(courses) {
    const approvedDiv = document.getElementById('approved-courses');
    const notApprovedDiv = document.getElementById('not-approved-courses');
    
    approvedDiv.innerHTML = '';
    notApprovedDiv.innerHTML = '';

    // Sort courses by course number
    const sortedCourses = [...courses].sort((a, b) => 
        a.courseNumber.localeCompare(b.courseNumber)
    );

    sortedCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = `course-card ${course.approved == 1 ? 'approved' : 'not-approved'}`;
        courseElement.innerHTML = `
            <div class="course-number">${formatCourseNumber(course.courseNumber)}</div>
            <div class="course-name">${course.courseName}</div>
        `;

        if (course.approved == 1) {
            approvedDiv.appendChild(courseElement);
        } else {
            notApprovedDiv.appendChild(courseElement);
        }
    });
}

function formatCourseNumber(number) {
    return number.substring(0, 4) + ' ' + number.substring(4);
}

function searchCourses(searchTerm) {
    const filteredCourses = allCourses.filter(course => {
        const searchString = searchTerm.toLowerCase();
        return course.courseNumber.toLowerCase().includes(searchString) ||
               course.courseName.toLowerCase().includes(searchString);
    });
    displayCourses(filteredCourses);
}

document.getElementById('searchBox').addEventListener('input', (e) => {
    searchCourses(e.target.value);
});

// Fetch the courses when the page loads
fetchCourses(); 