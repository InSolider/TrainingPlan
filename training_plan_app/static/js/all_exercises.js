document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-field');
    const exerciseList = document.getElementById('exercise-list');

    const loadingIndicator = document.createElement('p');
    loadingIndicator.textContent = 'Завантаження вправ...';
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
            if (!response.ok) throw new Error('Помилка мережі');
            exercisesCache = await response.json();
            localStorage.setItem('exercisesCache', JSON.stringify(exercisesCache));
            displayExercises(exercisesCache);
        } catch (error) {
            console.error('Помилка завантаження вправ:', error);
            displayError(`Помилка завантаження вправ: ${error.message}`);
        } finally {
            loadingIndicator.remove();
        }
    };

    const createExerciseItem = ({ name, link }) => {
        return `
            <div class="exercise-item">
                <a href="${link}">
                    <strong>${name}</strong>
                </a>
            </div>
        `;
    };

    const displayExercises = (exercises) => {
        exerciseList.innerHTML = exercises.length === 0 
            ? '<p>Немає доступних вправ.</p>' 
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
        const filteredExercises = exercisesCache.filter(({ name }) =>
            name.toLowerCase().includes(query)
        );
        displayExercises(filteredExercises);
    };

    loadExercises();
    searchInput.addEventListener('input', debounce(filterExercises, 300));
});
