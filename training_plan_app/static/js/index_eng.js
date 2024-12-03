// Function for BMR calculation
function calculateBMR(weight, height, age, gender) {
    return Math.round(10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161));
}

// Function for save data after BMR calculation and predicting the individual effectiveness
function saveFormData() {
    const form = document.getElementById('BMR-calculation-form');
    localStorage.setItem('age', form.elements['age'].value);
    localStorage.setItem('height', form.elements['height'].value);
    localStorage.setItem('weight', form.elements['weight'].value);
    localStorage.setItem('gender', form.querySelector('input[name="gender"]:checked')?.value);
};

// Handler for BMR calculation
document.getElementById('BMR-calculation-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const BMRform = event.target;
    const age = parseInt(BMRform.elements['age'].value);
    const weight = parseInt(BMRform.elements['weight'].value);
    const height = parseInt(BMRform.elements['height'].value);
    const gender = BMRform.querySelector('input[name="gender"]:checked')?.value;

    const BMRresult = calculateBMR(weight, height, age, gender);

    saveFormData();

    document.getElementById('BMR-calculation-result').textContent = BMRresult;
});

// Handler for predicting the individual effectiveness of all exercises 
document.getElementById('individual-effectiveness-form').addEventListener('submit', (event) => {
    event.preventDefault();

    saveFormData();

    const formData = new FormData(document.getElementById('BMR-calculation-form'));
    const effectivenessForm = document.getElementById('individual-effectiveness-form');
    const fragment = document.createDocumentFragment();
    
    for (const [key, value] of formData) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        fragment.appendChild(input);
    }

    effectivenessForm.appendChild(fragment);

    effectivenessForm.submit();
});

// Handler for restoring data on page reload
document.addEventListener('DOMContentLoaded', () => {
    const loadFormData = () => {
        const age = localStorage.getItem('age');
        const height = localStorage.getItem('height');
        const weight = localStorage.getItem('weight');
        const gender = localStorage.getItem('gender');
        
        if (age) document.getElementById('age').value = age;
        if (height) document.getElementById('height').value = height;
        if (weight) document.getElementById('weight').value = weight;
        if (gender) {
            const genderInput = document.querySelector(`input[name="gender"][value="${gender}"]`);
            if (genderInput) genderInput.checked = true;
        }
        if (age && height && weight && gender) document.getElementById('BMR-calculation-result').textContent = calculateBMR(weight, height, age, gender);
    };

    loadFormData();
});

// Value for selected exercises data
let selectedExercisesData = [];

// Function for calorie recalculation when exercise duration changes
const recalculateCalories = (originalCalories, originalDuration, newDuration) => 
    (originalCalories * newDuration) / originalDuration;

// Function for working with the list of selected exercises 
const updateSelectedExercises = () => {
    const selectedExercises = document.querySelectorAll('.exercise-checkbox');
    const totalCaloriesElement = document.getElementById('total-calories');
    let totalCalories = 0;

    // Save a list of selected exercises in a variable
    const exercisesTable = document.getElementById('selected-exercises-list');

    // Delete an exercise from the list of selected exercises if the checkbox is unchecked
    selectedExercisesData = selectedExercisesData.filter(exercise => {
        const checkbox = document.querySelector(`.exercise-checkbox[value="${exercise.name}"]`);
        if (checkbox && !checkbox.checked) {
            const rowToRemove = exercisesTable.querySelector(`tr[data-name="${exercise.name}"]`);
            if (rowToRemove) rowToRemove.remove();
            return false;
        }
        return true;
    });

    // Add an exercise to the list of selected exercises if the checkbox is checked
    selectedExercises.forEach(({ checked, value: name, dataset }) => {
        if (checked) {
            const originalDuration = parseFloat(dataset.duration);
            const originalCalories = parseFloat(dataset.calories);

            let existingExercise = selectedExercisesData.find(ex => ex.name === name);
            if (!existingExercise) {
                const newExercise = { name, duration: originalDuration, calories: originalCalories };
                selectedExercisesData.push(newExercise);
                addExerciseRow(newExercise, originalCalories, originalDuration);
            }
        }
    });

    // Recalculation of total calories
    totalCalories = calculateTotalCalories();
    totalCaloriesElement.textContent = Math.round(totalCalories);

    // Update weekly calories and weight calculation
    updateWeeklyCaloriesDifference();
};

// Function for adding an exercise to the table of selected exercises 
function addExerciseRow(exercise, originalCalories, originalDuration) {
    const listContainer = document.getElementById('selected-exercises-list');
    
    // Create a new table row
    const exerciseRow = document.createElement('tr');
    exerciseRow.dataset.name = exercise.name;

    // Add the new row to the table
    exerciseRow.innerHTML = `
        <td>${exercise.name}</td>
        <td>
            <input 
                type="number" 
                class="form-control exercise-duration" 
                value="${exercise.duration}" 
                min="1"
            >
        </td>
        <td class="exercise-calories">${exercise.calories}</td>
    `;
    listContainer.appendChild(exerciseRow);

    // Save table elements in variables
    const timeInput = exerciseRow.querySelector('.exercise-duration');
    const caloriesCell = exerciseRow.querySelector('.exercise-calories');
    const totalCaloriesElement = document.getElementById('total-calories');

    // Change the counts of calories when the duration changes
    timeInput.addEventListener('input', () => {
        const newDuration = parseFloat(timeInput.value);

        if (isNaN(newDuration) || newDuration <= 0) {
            caloriesCell.textContent = '-';
            exercise.calories = '-';
        } else {
            const newCalories = recalculateCalories(originalCalories, originalDuration, newDuration);
            caloriesCell.textContent = Math.round(newCalories);
            exercise.calories = Math.round(newCalories);
        }

        exercise.duration = newDuration || 0;

        // Recalculation of total calories
        totalCaloriesElement.textContent = Math.round(calculateTotalCalories());

        // Update weekly calories and weight calculation
        updateWeeklyCaloriesDifference();
    }, { passive: true });
}

// Function for recalculation of total calories
function calculateTotalCalories() {
    const caloriesElements = document.querySelectorAll('.exercise-calories');
    
    return Array.from(caloriesElements).reduce((total, calories) => {
        const caloriesValue = parseFloat(calories.textContent);
        return isNaN(caloriesValue) ? total : total + caloriesValue;
    }, 0);
}

// Function for update weekly calories and weight calculation
function updateWeeklyCaloriesDifference() {
    const dailyCaloriesInput = document.getElementById('calories-quantity');
    const exerciseCountInput = document.getElementById('exercises-quantity');
    const caloriesDifferenceElement = document.getElementById('calories-difference');
    const weightDifferenceElement = document.getElementById('weight-difference');

    // Extract values from elements
    const dailyCalories = Number(dailyCaloriesInput?.value) || 0;
    const exerciseCount = Number(exerciseCountInput?.value) || 0;
    const totalCaloriesPerWorkout = calculateTotalCalories();

    // Get values for BMR calculation
    const age = Number(document.getElementById('age')?.value) || 0;
    const weight = Number(document.getElementById('weight')?.value) || 0;
    const height = Number(document.getElementById('height')?.value) || 0;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';

    // BMR calculation
    const BMR = calculateBMR(weight, height, age, gender);

    // Calculate the number of calories lost during week workout
    const totalWeeklyCaloriesLost = totalCaloriesPerWorkout * exerciseCount;

    // BMR for the week
    const totalWeeklyBMR = BMR * 7;

    // Calculate the difference between calories consumed and calories burned
    const totalCaloriesConsumedWeekly = dailyCalories * 7;
    const caloriesDifference = totalCaloriesConsumedWeekly - (totalWeeklyCaloriesLost + totalWeeklyBMR);

    // Format for calories and kilograms
    const formatDifference = value => (value > 0 ? `+${value}` : value);

    // Display the difference between calories consumed and calories burned
    const displayCaloriesDifference = formatDifference(Math.round(caloriesDifference));
    caloriesDifferenceElement.textContent = displayCaloriesDifference;

    // Calculate the difference between weight before and after
    const weightDifference = caloriesDifference / 7700;

    // Display the difference between weight before and after
    const displayWeightDifference = formatDifference(weightDifference.toFixed(2));
    weightDifferenceElement.textContent = displayWeightDifference;
}

// Handler for changing the state of checkboxes
document.querySelectorAll('.exercise-checkbox').forEach(checkbox => {
    if (checkbox) {
        checkbox.addEventListener('change', updateSelectedExercises);
    }
});

// Handlers for calorie and exercises values with item validation
const caloriesInput = document.getElementById('calories-quantity');
const exercisesInput = document.getElementById('exercises-quantity');

if (caloriesInput) {
    caloriesInput.addEventListener('input', updateWeeklyCaloriesDifference);
}

if (exercisesInput) {
    exercisesInput.addEventListener('input', updateWeeklyCaloriesDifference);
}

// Handler for BMR calculation when values change
const bmrForm = document.getElementById('BMR-calculation-form');
if (bmrForm) {
    bmrForm.addEventListener('submit', (event) => {
        event.preventDefault();
        updateWeeklyCaloriesDifference();
    });
}

// Save a screenshot of the training plan using html-to-image
document.getElementById("download-btn").addEventListener("click", async (event) => {
    const element = document.querySelector(".training-plan-screenshot");
    const target = event.target;
    const iconUrl = target.getAttribute("data-icon-url");

    // Get elements that need to be excluded
    const excludedElements = element.querySelectorAll(".exclude");

    // Save condition for the elements that need to be excluded and hide them
    excludedElements.forEach(el => (el.style.visibility = 'hidden'));

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '-');

    // Save the original header before modifying it
    const header = element.querySelector("h3");
    const originalText = header.textContent;

    try {
        // Modifying the header text
        header.textContent = `Training plan from ${formattedDate}`;

        // Create an image from HTML
        const canvas = await htmlToImage.toCanvas(element);
        const context = canvas.getContext('2d');

        // Download the site icon
        const response = await fetch(iconUrl);
        const blob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(blob);
        const icon = new Image();
        icon.src = imageObjectUrl;

        // Wait for the icon to finish downloading
        await icon.decode();

        // Icon size
        const iconSize = 75;

        // Draw the icon on the image
        context.drawImage(icon, canvas.width - iconSize - 10, 10, iconSize, iconSize);

        // Convert the canvas to a data URL
        const dataUrl = canvas.toDataURL("image/png");

        // Free memory by deleting the icon URL object
        URL.revokeObjectURL(iconUrl);

        // Creating a download link
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Training_plan_from_${formattedDate}.png`;
        link.click();
    } catch (error) {
        console.error("Error while saving an image:", error);
    } finally {
        // Restore the original state of the elements
        header.textContent = originalText;
        excludedElements.forEach(el => (el.style.visibility = ''));
    }
});
