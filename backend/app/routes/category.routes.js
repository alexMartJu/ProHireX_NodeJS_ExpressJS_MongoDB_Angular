module.exports = (app) => {
    const categories = require('../controllers/category.controller.js');

    // Create a new category
    app.post('/categories', categories.create);

    // Retrieve all categories
    app.get('/categories', categories.findAll);

    // Retrieve a single category
    app.get('/categories/:slug', categories.findOne);

    // Delete a category
    app.delete('/categories/:slug', categories.delete_category);

    // Filtro Todas las Categorias
    app.get('/categories_select_filter', categories.findCategoriesSelect);
}