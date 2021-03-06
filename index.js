import fs from 'fs';

let data = JSON.parse(fs.readFileSync('./data.json'));
// var data = require('./data.json');

let courses = {
    1: {
        Name: "ECN-358: Machine Learning in Semiconductor Manufacturing",
        Seats: 35,
        AllotedTo: []
    },
    2: {
        Name: "ECN-359: Compound Semiconductor Devices and Circuits",
        Seats: 35,
        AllotedTo: []
    },
    3: {
        Name: "ECN-316  Digital Image Processing",
        Seats: 45,
        AllotedTo: []
    },
    4: {
        Name: "CSN-341: Computer Networks",
        Seats: 20,
        AllotedTo: []
    },
}

let allotStudents = []

const sortByCGPA = (arr) => {
    return arr.sort((a, b) => {

        var x = a['CGPA'];
        var y = b['CGPA'];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));

    }).reverse();


}

const allotCourses = (students) => {

    for (let i = 0; i < students.length; i++) {
        let student = students[i];

        let preferences = student['Preference'].split(' ').map((choice) => parseInt(choice, 10));

        for (let i = 0; i < preferences.length; i++) {
            let currChoice = courses[preferences[i]];
            if (currChoice.Seats > currChoice.AllotedTo.length) {

                currChoice.AllotedTo.push({
                    Name: student['Name'],
                    Enrollment: student['Enrollment'],
                    // CGPA: student['CGPA'],
                    preference: i + 1
                });
                break;
            }
        }
    }
}

const writeToFile = () => {
    fs.writeFile("ECE PEC Allotment Courses.json", JSON.stringify(courses), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("ECE PEC Allotment Courses.json ... DONE!")
    });
    fs.writeFile("ECE PEC Allotment Students.json", JSON.stringify(allotStudents), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("ECE PEC Allotment Students.json ... DONE!")
    });
}

const generateStudentWise = () => {
    for (let key in courses) {
        let course = courses[key];
        let alloted = course['AllotedTo']
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
    console.log("> Sorting students by CGPA...")
    let students = sortByCGPA(data);
    console.log(students.map((student, i) => {
        return ({ Rank: i+1, Name: student.Name, CGPA: student.CGPA })
    }))
    console.log("> Alloting Courses to students as per their CGPA and preference order...")
    allotCourses(students);
    console.log("> Generating the allotment list for each student...")
    generateStudentWise();
    console.log("> Generating the output files...")
    writeToFile();
}

main();

