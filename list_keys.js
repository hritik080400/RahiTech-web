
const fs = require('fs');

try {
    const data = fs.readFileSync('db.json', 'utf8');
    const json = JSON.parse(data);
    const keys = Object.keys(json.AllCourseDetails);
    console.log("Course Keys:", keys);
} catch (err) {
    console.error("Error:", err.message);
}
