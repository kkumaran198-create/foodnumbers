# Food Calorie Calculator

A modern, responsive web application to track your daily calorie intake. Built with vanilla HTML, CSS, and JavaScript - no build tools required!

## Features

- **Comprehensive Food Database**: 60 food items across 6 categories (Fruits, Vegetables, Proteins, Grains, Dairy, Snacks)
- **Search Functionality**: Quickly find foods by name
- **Category Filtering**: Filter foods by category for easier browsing
- **Portion Size Adjustment**: Customize portion sizes (in grams) for accurate calorie calculations
- **Daily Tracking**: Track your daily food intake with automatic calorie calculation
- **Nutritional Information**: View calories, protein, carbs, and fat for each food item
- **Persistent Storage**: Your daily log is saved in localStorage and persists across browser sessions
- **Responsive Design**: Works beautifully on desktop and mobile devices

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser (no server required)

2. **Search for Food**: Use the search box to find specific foods, or browse by category

3. **Add Food to Your Log**:
   - Click on any food item to open the portion size modal
   - Adjust the portion size (in grams)
   - View the calculated calories and nutritional information
   - Click "Add to Log" to add it to your daily log

4. **Track Your Daily Intake**:
   - View your daily summary at the top (total calories, protein, carbs, fat)
   - See all items you've added in the "Today's Log" section
   - Delete individual items by clicking the "Delete" button
   - Clear the entire log by clicking "Clear Daily Log"

## Food Categories

- **Fruits**: Apple, Banana, Orange, Grapes, Strawberries, Blueberries, Mango, Pineapple, Watermelon, Peach, Pear, Cherries
- **Vegetables**: Broccoli, Carrot, Spinach, Tomato, Cucumber, Bell Pepper, Lettuce, Cauliflower, Zucchini, Mushrooms, Onion, Garlic
- **Proteins**: Chicken Breast, Salmon, Tuna, Egg, Beef, Turkey Breast, Shrimp, Tofu, Lentils, Black Beans
- **Grains**: White Rice, Brown Rice, Quinoa, Oats, Whole Wheat Bread, Pasta, Sweet Potato, Corn
- **Dairy**: Milk (whole & skim), Greek Yogurt, Cheddar Cheese, Mozzarella Cheese, Cottage Cheese, Butter, Cream Cheese
- **Snacks**: Almonds, Walnuts, Peanuts, Dark Chocolate, Potato Chips, Popcorn, Granola Bar, Crackers, Pretzels, Dried Apricots

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **LocalStorage**: Data persists in your browser
- **Responsive**: Mobile-friendly design
- **Modern UI**: Beautiful gradient design with smooth animations

## File Structure

```
food-calorie-calculator/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── foodData.js     # Food database with nutritional information
├── app.js          # Application logic and interactivity
└── README.md       # This file
```

## Browser Compatibility

Works in all modern web browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Customization

To add more foods to the database, edit `foodData.js` and add new objects following the format:

```javascript
{
    id: 61,
    name: "Food Name",
    category: "category",
    calories: 100,
    protein: 5,
    carbs: 10,
    fat: 2
}
```

All nutritional values are per 100 grams.
