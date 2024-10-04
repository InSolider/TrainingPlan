function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

function calculateTDEE(BMR, activityLevel) {
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        superActive: 1.9
    };

    // Using a user-selected activity factor 
    const activityFactor = activityFactors[activityLevel];

    return BMR * activityFactor;
}

document.getElementById('calorieForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    // Getting the value of the selected gender
    const genderRadios = document.getElementsByName('gender');
    const gender = [...genderRadios].find(radio => radio.checked)?.value;

    // Getting the value of the selected activity level
    const activityRadios = document.getElementsByName('activityLevel');
    const activityLevel = [...activityRadios].find(radio => radio.checked)?.value;

    const BMR = calculateBMR(weight, height, age, gender);
    const TDEE = calculateTDEE(BMR, activityLevel);

    document.getElementById('result').innerHTML = `
        <h4>Результати:</h4>
        <p>BMR: ${BMR.toFixed(2)} калорій на день</p>
        <p>TDEE: ${TDEE.toFixed(2)} калорій на день</p>
    `;
});
