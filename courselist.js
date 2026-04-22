let allCourses = [];

function formatLastUpdated(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return '';
    const parts = isoDate.trim().split('-');
    if (parts.length !== 3) return isoDate;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return isoDate;
    const dt = new Date(y, m, d);
    return dt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function setLastUpdated(isoDate) {
    const el = document.getElementById('last-updated');
    if (!el) return;
    const label = formatLastUpdated(isoDate);
    if (label) {
        el.textContent = 'List last updated: ' + label;
    } else {
        el.textContent = '';
    }
}

function fetchCourses() {
    fetch('./courses.json')
        .then(response => response.json())
        .then(data => {
            allCourses = data.courses || [];
            setLastUpdated(data.lastUpdated);
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
        (a.courseNumber || '').localeCompare(b.courseNumber || '')
    );

    sortedCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = `course-card ${course.approved == 1 ? 'approved' : 'not-approved'}`;
        courseElement.innerHTML = `
            <div class="course-number">${formatCourseNumber(course.courseNumber || '')}</div>
            <div class="course-name">${course.courseName || 'Unknown Course Name'}</div>
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
        // Clean up search term: trim whitespace and collapse multiple spaces
        const searchString = searchTerm.toLowerCase().trim().replace(/\s+/g, ' ');
        
        // Clean up course number (remove all spaces) for matching
        const courseNum = (course.courseNumber || '').toLowerCase().replace(/\s+/g, '');
        const searchWithoutSpaces = searchString.replace(/\s+/g, '');
        
        // Clean up course name, handle missing courseName
        const courseName = (course.courseName || '').toLowerCase();
        
        return courseNum.includes(searchWithoutSpaces) ||
               courseName.includes(searchString);
    });
    displayCourses(filteredCourses);
}

document.getElementById('searchBox').addEventListener('input', (e) => {
    searchCourses(e.target.value);
});

// Fetch the courses when the page loads
fetchCourses(); 