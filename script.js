$(document).ready(function(){
	var semester = 1;
			temp = $('.template').clone()
			template = $('.template').clone().attr('class', 'content');
			letter_grade = {"A":4.00, "A-":3.67, "B+":3.33, "B":3.00, "B-":2.67, "C+":2.33,
								"C":2.00, "C-":1.67, "D+":1.33, "D":1.00, "D-":0.67,"F":0.00 },
			acc_credits=0,
			acc_points=0,
			semester_credits= 0,
			semester_points = 0,
			overall = {sumOfCredits:0, sumOfGrades:0, average:0};

	init();
	
	function init(){
		// Create first semester using template, add event listeners
		template.insertBefore('button.add-semester');
		$('button.add').on('click', addCourse); // bug: event handlers never go off.
		$('.calculate').on('click', calculateGPA);
		$('button.add-semester').on('click', addSemester); 
	}

	function calculateGPA(){
		var	allClassGrades = [], 
				allClassCredits = [],
				rows = $('.content tbody tr').length, // row length
				col = $('.content tbody td').length / rows; // column length
		
		for (var i = 0; i < rows; i++) {
			
			var classGrade = {}; // table rows input
			var tr = $('.content tbody tr')[i] // table rows

			for(var k = 0; k < col; k++) {
				var input = $($(tr).children()).children()[k]; // retrieve one input from list of <td>
				// console.log($(input).attr('id'))
				var value = $(input).val();
				switch ($(input).attr('id')) {
					case "course":
						classGrade.course = value;
						break;
					case "credits":
						classGrade.credits = value;
						break;
					case "letter-grade":
						classGrade.letter = value;
						break;
					default:
						classGrade.pass_fail = $(input).prop('checked');
				}
			}
			var point  = getGradePoint(classGrade);
			classGrade.credits = (!classGrade.pass_fail) ? classGrade.credits : 0;
			if(!isNaN(point) && (Number.isInteger(parseInt(classGrade.credits))) && classGrade.letter != "") {
				allClassGrades.push(parseFloat(point));
				allClassCredits.push(parseInt(classGrade.credits));
			}
		}

		// Update Semester Gpa
		var result = getAverage(allClassGrades, allClassCredits);
		$('.content #gpa').text(result.average.toFixed(2));
		semester_credits = result.sumOfCredits;
		semester_points = parseFloat((result.sumOfGrades).toFixed(2));

		// Update Overall Gpa
		var avr = (acc_points + semester_points)/(acc_credits + semester_credits);
		$('#overall').text((isNaN(avr) ? 0 : avr).toFixed(2));
	}

	function getGradePoint(grade) {
		// calculate points gained for specific class
		var point;
		var classLetterGrade = grade.letter;
		var credits = grade.credits;
		point = (!grade.pass_fail) ? (letter_grade[classLetterGrade] * credits) : 0; // pass or fail classes dont affect your gpa
		return point;
	}

	function getAverage(grades, credits) {
		var gpa = {sumOfCredits:0, sumOfGrades:0, average:0};
		if(grades.length > 0) {
			for(var i = 0; i < grades.length; i++) {
				gpa.sumOfGrades += grades[i];
				gpa.sumOfCredits += credits[i];
			}
			var average = (gpa.sumOfGrades / gpa.sumOfCredits);
			gpa.average = !isNaN(average) ? average : 0; // incase 
			return gpa;
		}
		return gpa;
	}

	function addCourse(){
		var row = $('.template tbody tr:first-of-type').clone()
		row.appendTo('.content tbody');
	}

	function addSemester(){
		// Turn off event handler
		$('button.add').off();
		$('.content button.add').attr('class', 'null');
		$('.calculate').off();
		$('.content button.calculate').attr('class', 'null');
		
		// insert template before the add semester button
		// archive previous semester
		temp.clone().insertBefore('button.add-semester');
		$('.content').attr('class', 'archive' + semester);
		$($('.template')[1]).attr('class', 'content');

		// Update new semester data and event handlers
		semester++;
		$('.content data').text(semester);
		$('.content button.add').on('click', addCourse)
		$('.content .calculate').on('click', calculateGPA)

		// Update accumulated grades and points
		acc_points += semester_points;
		acc_credits += semester_credits;
	}

})