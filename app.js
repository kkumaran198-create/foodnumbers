let currentCategory = 'all';
let currentFood = null;
let dailyLog = JSON.parse(localStorage.getItem('dailyLog')) || [];
let inputMode = 'quantity';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show splash screen for 3 seconds with fade effects
    setTimeout(() => {
        // Fade out splash screen
        document.getElementById('splashScreen').classList.add('fade-out');
        
        // After fade out completes (1 second), hide splash and fade in main content
        setTimeout(() => {
            document.getElementById('splashScreen').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            
            // Trigger reflow to enable transition
            setTimeout(() => {
                document.getElementById('mainContent').classList.add('fade-in');
            }, 50);
            
            renderFoodList();
            renderDailyLog();
            updateSummary();
        }, 1000);
    }, 3000);
});

// Filter foods by search term
function filterFoods() {
    const searchTerm = document.getElementById('foodSearch').value.toLowerCase();
    renderFoodList(searchTerm);
}

// Filter foods by category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderFoodList(document.getElementById('foodSearch').value.toLowerCase());
}

// Render food list
function renderFoodList(searchTerm = '') {
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';
    
    let filteredFoods = foodDatabase;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredFoods = filteredFoods.filter(food => food.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredFoods = filteredFoods.filter(food => 
            food.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredFoods.length === 0) {
        foodList.innerHTML = '<p class="empty-message">No foods found</p>';
        return;
    }
    
    filteredFoods.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.onclick = () => openModal(food);
        foodItem.innerHTML = `
            <div>
                <span class="food-name">${food.name}</span>
                <span class="food-category">${food.category}</span>
            </div>
            <span class="food-calories">${food.calories} kcal/100g</span>
        `;
        foodList.appendChild(foodItem);
    });
}

// Open modal for adding food
function openModal(food) {
    currentFood = food;
    document.getElementById('modalFoodName').textContent = food.name;
    document.getElementById('modalCalories').textContent = food.calories;
    document.getElementById('modalProtein').textContent = food.protein;
    document.getElementById('modalCarbs').textContent = food.carbs;
    document.getElementById('modalFat').textContent = food.fat;
    document.getElementById('modalServingSize').textContent = food.servingSize;
    document.getElementById('modalServingUnit').textContent = food.servingUnit;
    document.getElementById('quantity').value = 1;
    updateCalculatedCalories();
    document.getElementById('addFoodModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('addFoodModal').classList.remove('active');
    currentFood = null;
    // Reset input mode to quantity
    setInputMode('quantity');
}

// Set input mode
function setInputMode(mode) {
    inputMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    // Show/hide appropriate input controls
    document.getElementById('quantity-control').style.display = mode === 'quantity' ? 'block' : 'none';
    document.getElementById('grams-control').style.display = mode === 'grams' ? 'block' : 'none';
    document.getElementById('size-control').style.display = mode === 'size' ? 'block' : 'none';
    
    updateCalculatedCalories();
}

// Change quantity
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value) || 1;
    quantity += delta;
    if (quantity < 1) quantity = 1;
    if (quantity > 20) quantity = 20;
    quantityInput.value = quantity;
    updateCalculatedCalories();
}

// Get size multiplier
function getSizeMultiplier(size) {
    const multipliers = {
        small: 0.5,
        medium: 1,
        large: 1.5
    };
    return multipliers[size] || 1;
}

// Update calculated calories based on input mode
function updateCalculatedCalories() {
    if (!currentFood) return;
    
    let ratio = 1;
    
    if (inputMode === 'quantity') {
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        ratio = quantity;
    } else if (inputMode === 'grams') {
        const grams = parseFloat(document.getElementById('grams').value) || 100;
        ratio = grams / 100;
    } else if (inputMode === 'size') {
        const size = document.getElementById('size').value;
        ratio = getSizeMultiplier(size);
    }
    
    const calculatedCalories = Math.round(currentFood.calories * ratio);
    const calculatedProtein = (currentFood.protein * ratio).toFixed(1);
    const calculatedCarbs = (currentFood.carbs * ratio).toFixed(1);
    const calculatedFat = (currentFood.fat * ratio).toFixed(1);
    
    document.getElementById('calculatedCalories').textContent = calculatedCalories;
    document.getElementById('calculatedProtein').textContent = calculatedProtein;
    document.getElementById('calculatedCarbs').textContent = calculatedCarbs;
    document.getElementById('calculatedFat').textContent = calculatedFat;
}

// Add food to daily log
function addToDailyLog() {
    if (!currentFood) return;
    
    let ratio = 1;
    let portionDisplay = '';
    
    if (inputMode === 'quantity') {
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        ratio = quantity;
        portionDisplay = `${quantity} ${currentFood.servingUnit}${quantity > 1 ? 's' : ''}`;
    } else if (inputMode === 'grams') {
        const grams = parseFloat(document.getElementById('grams').value) || 100;
        ratio = grams / 100;
        portionDisplay = `${grams}g`;
    } else if (inputMode === 'size') {
        const size = document.getElementById('size').value;
        ratio = getSizeMultiplier(size);
        const sizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' };
        portionDisplay = `${sizeLabels[size]} (${currentFood.servingSize * ratio} ${currentFood.servingUnit})`;
    }
    
    const logEntry = {
        id: Date.now(),
        foodId: currentFood.id,
        name: currentFood.name,
        portionDisplay: portionDisplay,
        inputMode: inputMode,
        calories: Math.round(currentFood.calories * ratio),
        protein: parseFloat((currentFood.protein * ratio).toFixed(1)),
        carbs: parseFloat((currentFood.carbs * ratio).toFixed(1)),
        fat: parseFloat((currentFood.fat * ratio).toFixed(1)),
        timestamp: new Date().toISOString()
    };
    
    dailyLog.push(logEntry);
    saveDailyLog();
    renderDailyLog();
    updateSummary();
    closeModal();
}

// Render daily log
function renderDailyLog() {
    const dailyLogElement = document.getElementById('dailyLog');
    dailyLogElement.innerHTML = '';
    
    if (dailyLog.length === 0) {
        dailyLogElement.innerHTML = '<p class="empty-message">No items added yet</p>';
        return;
    }
    
    // Show most recent items first
    const reversedLog = [...dailyLog].reverse();
    
    reversedLog.forEach(entry => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div class="log-info">
                <span class="log-name">${entry.name}</span>
                <span class="log-portion">${entry.portionDisplay}</span>
            </div>
            <div>
                <span class="log-calories">${entry.calories} kcal</span>
                <button class="delete-btn" onclick="deleteFromLog(${entry.id})">Delete</button>
            </div>
        `;
        dailyLogElement.appendChild(logItem);
    });
}

// Delete item from daily log
function deleteFromLog(id) {
    dailyLog = dailyLog.filter(entry => entry.id !== id);
    saveDailyLog();
    renderDailyLog();
    updateSummary();
}

// Clear daily log
function clearDailyLog() {
    if (dailyLog.length === 0) return;
    
    if (confirm('Are you sure you want to clear the entire daily log?')) {
        dailyLog = [];
        saveDailyLog();
        renderDailyLog();
        updateSummary();
    }
}

// Update summary statistics
function updateSummary() {
    const totalCalories = dailyLog.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = dailyLog.reduce((sum, entry) => sum + entry.protein, 0).toFixed(1);
    const totalCarbs = dailyLog.reduce((sum, entry) => sum + entry.carbs, 0).toFixed(1);
    const totalFat = dailyLog.reduce((sum, entry) => sum + entry.fat, 0).toFixed(1);
    
    document.getElementById('totalCalories').textContent = totalCalories;
    document.getElementById('totalProtein').textContent = totalProtein;
    document.getElementById('totalCarbs').textContent = totalCarbs;
    document.getElementById('totalFat').textContent = totalFat;
}

// Save daily log to localStorage
function saveDailyLog() {
    localStorage.setItem('dailyLog', JSON.stringify(dailyLog));
}

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('addFoodModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Calculate BMI
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values.');
        return;
    }
    
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);
    
    // Determine BMI status
    let status = '';
    if (bmi < 18.5) {
        status = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Overweight';
    } else {
        status = 'Obese';
    }
    
    // Display results
    document.getElementById('bmiValue').textContent = bmiRounded;
    document.getElementById('bmiStatus').textContent = status;
    document.getElementById('bmiResult').style.display = 'block';
}
