const fs = require('fs');
var data = require('./data.json');

courses = {
    1: {
        Name: "ECN-358: Machine Learning in Semiconductor Manufacturing",
        Seats: 25,
        AllotedTo: []
    },
    2: {
        Name: "ECN-359: Compound Semiconductor Devices and Circuits",
        Seats: 25,
        AllotedTo: []
    },
    3: {
        Name: "ECN-316  Digital Image Processing",
        Seats: 25,
        AllotedTo: []
    },
    4: {
        Name: "CSN-341: Computer Networks",
        Seats: 20,
        AllotedTo: []
    },
    5: {
        Name: "CSN-521: Mobile and Pervasive computing",
        Seats: 25,
        AllotedTo: []
    },
    6: {
        Name: "CSN-510: Network Programming",
        Seats: 5,
        AllotedTo: []
    },
}

allotStudents = []

const sortByCGPA = (arr) => {
    return arr.sort((a, b) => {

        var x = a['CGPA(Fill upto 3 decimal places as given in acads portal)'];
        var y = b['CGPA(Fill upto 3 decimal places as given in acads portal)'];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));

    }).reverse();
}

const allotCourses = (students) => {

    for (let i = 0; i < students.length; i++) {
        let student = students[i];

        preferences = student['Preference order of electives'].split(' ').map((choice) => parseInt(choice, 10));

        for (let i = 0; i < preferences.length; i++) {
            let currChoice = courses[preferences[i]];
            if (currChoice.Seats > currChoice.AllotedTo.length) {

                currChoice.AllotedTo.push({
                    Name: student['Name'],
                    Enrollment: student['Enrollment Number'],
                    CGPA: student['CGPA(Fill upto 3 decimal places as given in acads portal)'],
                    preference: i + 1
                });
                break;
            }
        }
    }
}

const writeToFile = () => {
    let done = 0;
    fs.writeFile("ECE PEC Allotment Courses.json", JSON.stringify(courses), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }


    });
    fs.writeFile("ECE PEC Allotment Students.json", JSON.stringify(allotStudents), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

    });
}

const generateStudentWise = () => {
    for (let key in courses) {
        course = courses[key];
        alloted = course['AllotedTo']
        for (let i = 0; i < alloted.length; i++) {
            allotStudents.push({
                Name: alloted[i].Name,
                Enrollment: alloted[i].Enrollment,
                CGPA: alloted[i].CGPA,
                courseAlloted: course["Name"]
            })
        }
    }
}


const main = async () => {
    console.time('time taken');
    console.log("Sorting students by CGPA...")
    students = sortByCGPA(data);
    console.log("Alloting Courses to students as per their CGPA and preference order...")
    allotCourses(students);
    console.log("Generating the allotment list for each student...")
    generateStudentWise();
    console.log("Generating the output files...")
    await writeToFile();
    console.timeEnd('time taken');
}

main();

