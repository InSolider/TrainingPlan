// Search for an exercise by name
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-field');
    const exerciseList = document.getElementById('exercises-list');

    const loadingIndicator = document.createElement('p');
    loadingIndicator.textContent = 'Завантаження списку вправ...';
    exerciseList.appendChild(loadingIndicator);

    let exercisesCache = [];

    const loadExercises = async () => {
        try {
            const cachedData = localStorage.getItem('exercisesCache');
            if (cachedData) {
                try {
                    exercisesCache = JSON.parse(cachedData);
                } catch {
                    console.warn('Дані у localStorage несправні.');
                    exercisesCache = [];
                }
                displayExercises(exercisesCache);
            }

            const response = await fetch('/vpravy/', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Помилка мережі.');
            
            exercisesCache = await response.json();
            localStorage.setItem('exercisesCache', JSON.stringify(exercisesCache));
            displayExercises(exercisesCache);
        } catch (error) {
            console.error('Помилка завантаження списку вправ:', error);
            displayError(`Помилка завантаження списку вправ: ${error.message}`);
        } finally {
            loadingIndicator.remove();
        }
    };

    const createExerciseItem = ({ name_ukr, link }) => {
        return `
            <a href="${link}" class="list-group-item list-group-item-action">${name_ukr}</a>
        `;
    };

    const displayExercises = (exercises) => {
        exerciseList.innerHTML = exercises.length === 0 
            ? '<h5 style="text-align: center;">Вправ з такою назвою не знайдено.</h5>' 
            : exercises.map(createExerciseItem).join('');
    };

    const displayError = (message) => {
        exerciseList.innerHTML = `<p class="error">${message}</p>`;
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    const filterExercises = () => {
        const query = searchInput.value.toLowerCase();
        const filteredExercises = exercisesCache.filter(({ name_ukr }) =>
            name_ukr.toLowerCase().includes(query)
        );
        displayExercises(filteredExercises);
    };

    loadExercises();
    searchInput.addEventListener('input', debounce(filterExercises, 300));
});
