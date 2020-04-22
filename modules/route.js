module.exports = (app,db) => {
    function log(text) {
        console.log(text);
    }
    
    async function getProducts() {
        const product = await db.get('products').value();
        return product;
    }
    
     function checkProduct(productId) {
        const product = db.get('products').find({ id: productId }).value();
        if(product === undefined)
        {
            return false;
        }
        else {
            return true;
        }
    }
    
     function checkBasket(productId) {
        const product = db.get('basket').find({ id: productId }).value();
        if(product === undefined)
        {
            return false;
        }
        else {
            return true;
        }
    }
    
    //adding product to basket
    function addToBasket(productId) {
        const product = db.get('products').find({ id: productId }).value();
        db.get('basket').push(product).write();
        return product;
    }
    
    //delete from basket
    async function deleteFromBasket(productId) {
        await db.get('basket').remove({ id: productId}).write();
    }
    
    async function getAllFromBasket() {
        const product = await db.get('basket').value();
        return product;
    }
    //getAll product
    app.get('/api/product/getAll', async(req, res) => {
    const allProducts = await getProducts();
    res.send(allProducts);
    });
    
    
    //adding to cart
    app.post('/api/basket/add', (req, res) => {
    const productId = req.query.id;
    const isProductExist = checkProduct(productId);
    let response = {};
    
    if(isProductExist) {
        const isInBasket = checkBasket(productId);
        
        if(isInBasket) {
            response = { 
                success :false,
                message :'The product is already in shopping cart!!!'
            }
        }
        else {
            const product = addToBasket(productId);
            response = {
                success: true,
                message: `product "${product.name}" added to shopping cart!`
            }
        }
    }
     else {
        response = {
            success: false,
            message: 'product doesn´t exist in our database!'
        }
    }
    
    res.send(response);
    })
    
    //deleting product from cart
    app.delete('/api/basket/delete', async(req, res) => {
        const productId = req.query.id;
        const isInBasket = await checkBasket(productId);
        let response = {};
    
        if(!isInBasket) {
            response = {
                success: false,
                message: 'product doesn´t find in shopping cart'
            }
        }
         else {
            deleteFromBasket(productId);
            response = {
                success: true,
                message: 'product deleted from shopping cart'
            }
        }
    
        res.send(response);
    });
    
    app.get('/api/basket/getAll', async(req, res) => {
    const allProducts = await getAllFromBasket();
    res.send(allProducts);
    });
}
