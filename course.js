
document.addEventListener("DOMContentLoaded", function () {
    const jsonUrl = "db.json";
    const pillsTab = document.getElementById("pills-tab");
    const pillsTabContent = document.getElementById("pills-tabContent");

    // Clear initial content
    if (pillsTab) pillsTab.innerHTML = "";
    if (pillsTabContent) pillsTabContent.innerHTML = "";

    const courseCategories = {
        "All Courses": [],
        "Software Development": ["Java", "DotNet", "Python", "PHP", "AngularJS", "React", "NodeJS", "WebDesign", "Android", "C# .Net", "ASP.Net", "ADO.Net", "MVC", "Struts", "Hibernate", "Spring"],
        "Data & Analytics": ["DA", "Hadoop", "SQL", "Excel", "PowerBI", "Tableau", "Data Analytics"],
        "Cyber Security": ["CPTE", "CPEH", "CEH", "CISSP", "Cyber Security"],
        "Cloud & Infrastructure": ["AWS", "Azure", "IMS", "Virtualization", "Open Stack", "VMWARE-NSX", "VMWARE-ESXI"],
        "Networking (Cisco)": ["CCNA", "CCNARoutingSwitching", "CCNA Security", "CCNA Colabration", "CCNE", "CCIE"],
        "Linux & RedHat": ["RHCSA", "RHCE", "RHCVA", "Linux"],
        "Microsoft Server/Admin": ["MCSA", "MCSE", "SCCM", "SCCOM", "MicrosoftHardware", "MicrosoftSoftware"],
        "Testing": ["Manual Testing", "Selenium Ide", "Selenium Webdriver", "Testing"],
        "Others": ["DigitalMarketing", "DSE", "FMS"]
    };

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const courses = data.AllCourseDetails;
            const courseKeys = Object.keys(courses);

            if (!courseKeys || courseKeys.length === 0) {
                if (pillsTabContent) pillsTabContent.innerHTML = "<p>No courses found.</p>";
                return;
            }

            // 1. Populate "All Courses" category first
            courseCategories["All Courses"] = courseKeys;

            let isFirst = true;

            // 2. Iterate categories and build UI
            for (const [categoryName, keywords] of Object.entries(courseCategories)) {

                // Filter keys
                const matchedKeys = [];
                if (categoryName === "All Courses") {
                    matchedKeys.push(...keywords);
                } else {
                    courseKeys.forEach(dbKey => {
                        const matches = keywords.some(keyword =>
                            dbKey.toLowerCase() === keyword.toLowerCase() ||
                            dbKey.toLowerCase().includes(keyword.toLowerCase().replace(/\s/g, ''))
                        );
                        if (matches && !matchedKeys.includes(dbKey)) {
                            matchedKeys.push(dbKey);
                        }
                    });
                }

                if (matchedKeys.length === 0) continue;

                // Identifiers
                const safeName = categoryName.replace(/[^a-zA-Z0-9]/g, "");
                const tabId = `${safeName}-tab`;
                const paneId = safeName;

                // Create Tab Item (using <a> to match original HTML structure)
                const li = document.createElement("li");
                li.className = "nav-item";
                li.innerHTML = `
                    <a class="nav-link ${isFirst ? 'active' : ''}" 
                       id="${tabId}" 
                       data-bs-toggle="pill" 
                       href="#${paneId}" 
                       role="tab" 
                       aria-controls="${paneId}" 
                       aria-selected="${isFirst}">
                        ${categoryName}
                    </a>
                `;
                pillsTab.appendChild(li);

                // Create Content Pane
                const pane = document.createElement("div");
                pane.className = `tab-pane fade ${isFirst ? 'show active' : ''}`;
                pane.id = paneId;
                pane.setAttribute("role", "tabpanel");
                pane.setAttribute("aria-labelledby", tabId);

                // Build Cards
                // NOTE: REMOVED data-aos attributes to resolve visibility issue
                let cardsHtml = "";
                matchedKeys.forEach(key => {
                    if (courses.hasOwnProperty(key)) {
                        const course = courses[key];
                        const displayName = course.CourseName || course.courseName || key;

                        cardsHtml += `
                            <div class="Portfolio">
                                <img alt="${displayName}" class="img-fluid dynamic-img" src="assets/images/course_1.png">
                                <div class="course-desc py-4 px-3">
                                    <h5 class="fw-bold" style="height: 45px;">${displayName}</h5>
                                    <p></p>
                                    <a class="btn theme-blue " href="./CoursesDetails.html?course=${key}">Course Detail
                                        <i class="fa fa-angle-double-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        `;
                    }
                });

                pane.innerHTML = cardsHtml;
                pillsTabContent.appendChild(pane);

                isFirst = false;
            }
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
            if (pillsTabContent) pillsTabContent.innerHTML = `<p style="color:red; padding:20px;">Error loading courses: ${error.message}</p>`;
        });
});
