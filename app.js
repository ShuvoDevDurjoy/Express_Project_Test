require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const { products, people } = require('./data.js');
const {readFile, readFileSync} = require('fs') ; 

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './navbar-app/index.html'));
});

app.get('/styles.css', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './navbar-app/styles.css'));
});

app.get('/logo.svg', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './navbar-app/logo.svg'));
});

app.get('/browser-app.js', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './navbar-app/browser-app.js'));
})

app.get('/worker.js',(req,res)=>{
    res.status(200).sendFile(path.resolve(__dirname,'./navbar-app/worker.js')) ; 
})

app.get('/api/products/:productId', (req, res) => {
    console.log(req.params);
    const { productId } = req.params;
    const singleProduct = products.find((product) => product.id === Number(productId))
    if (singleProduct) {
        res.json(singleProduct)
    } else {
        res.status(404).send('<h1>Page not found</h1>');
    }
})

function checkUser(apiKey) {
    const found = people.find((pe) => {
        return pe.name == apiKey;
    })
    console.log(found);
    if (found) return true;
    return false;
}

app.post('/authorization', (req, res) => {
    console.log(req.body.q);
    console.log(people);
    people.push({ id: 6, name: req.body.q });
    require('fs').writeFileSync('data.js', `products=${JSON.stringify(products)}\n`, { flag: 'w' });
    require('fs').writeFileSync('data.js', `people=${JSON.stringify(people)}\n`, { flag: 'a' });
    require('fs').writeFileSync('data.js', `module.exports = { products, people }`, { flag: 'a' });
    res.send('nothing');
})

app.get('/api/data/query', async (req, res) => {
    try {
        // Simulate asynchronous operation using setTimeout
        const worker = new Worker('./prec.js') ; 
        worker.onmessage = function (event)
        {
            console.log(event.data) ; 
        }
        if (!checkUser(req.headers['api-key'])) {
            res.send('<h1>You are not Authorized.</h1>');
            return;
        }

        const { search, limit } = req.query;
        let storedProduct;

        if (search) {
            storedProduct = products.filter((product) => product.name.startsWith(search));
        }

        let finalProduct;

        if (limit) {
            finalProduct = storedProduct.filter((product) => Number(limit) > Number(product.price));
        }
        if (finalProduct)
            res.json(finalProduct);
        else {
            res.send('nothing found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/res.txt', async(req,res)=>{
    let txt = readFileSync('res.txt',(err,res)=>{
        if(err)
        {
            txt = 'There is an error' ; 
        }
        else{
            txt = res ; 
        }
    }) 
    res.send(txt) ; 
})

app.get('*', (req, res) => {
    res.send('<h1>No content related to this found</h1>')
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port 5000..................`);
})