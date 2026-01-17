# ĐÁP ÁN ĐỀ THI WEB PROGRAMMING

## PART I - TRẮC NGHIỆM

**Q1.** A  
**Q2.** D  
**Q3.** D  
**Q4.** A  
**Q5.** C  
**Q6.** C  
**Q7.** C  
**Q8.** A  
**Q9.** C  
**Q10.** C  
**Q11.** A  
**Q12.** B  
**Q13.** C  
**Q14.** B  
**Q15.** C  
**Q16.** B  
**Q17.** A  
**Q18.** D  
**Q19.** B  
**Q20.** D  
**Q21.** A  
**Q22.** D  
**Q23.** D  
**Q24.** C  
**Q25.** B  
**Q26.** A  
**Q27.** C  
**Q28.** B  
**Q29.** B  
**Q30.** B  
**Q31.** D  
**Q32.** C  
**Q33.** C  
**Q34.** B  
**Q35.** A  
**Q36.** B  
**Q37.** B  
**Q38.** A  
**Q39.** C  
**Q40.** B  

---

## PART II - TỰ LUẬN

### Q1. HTML & CSS

```html
<style>
.card-container {
    width: 500px;
    height: 200px;
    border: 0.5em solid #698733;
    border-radius: 1em;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.card-container img {
    height: 70%;
}
</style>

<div class="card-container">
    <img src="/images/number-image0.png" alt="0">
    <img src="/images/number-image1.png" alt="1">
    <img src="/images/number-image2.png" alt="2">
    <img src="/images/number-image3.png" alt="3">
</div>
```

---

### Q2. JavaScript - Linear Equation Solver

```javascript
function solveLinearEquation() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const resultElement = document.getElementById('result');
    
    if (a === 0) {
        if (b === 0) {
            resultElement.textContent = 'Infinite solutions';
        } else {
            resultElement.textContent = 'No solution';
        }
    } else {
        const x = -b / a;
        resultElement.textContent = `x = ${x}`;
    }
}
```

---

### Q3. Node.js Server & Frontend

**Server (1) & (2):**
```javascript
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`Welcome, ${name}!`);
});

app.post('/square', (req, res) => {
    const number = req.body.number;
    const square = number * number;
    res.json({ result: square });
});
```

**Frontend (3) & (4):**
```javascript
document.getElementById('greetButton').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value;
    fetch(`http://localhost:8080/greet?name=${name}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('greetResult').textContent = data;
        });
});

document.getElementById('squareButton').addEventListener('click', function () {
    const number = parseFloat(document.getElementById('numberInput').value);
    fetch('http://localhost:8080/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: number })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('squareResult').textContent = data.result;
    });
});
```

---

### Q4. Node.js Express

```javascript
const express = require('express');
const app = express();

app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`Welcome, ${name}!`);
});

app.get('/square/:number', (req, res) => {
    const number = parseInt(req.params.number);
    const square = number * number;
    res.send(square.toString());
});

app.listen(8080);
```

---

### Q5. MySQL & Express API

```javascript
const express = require('express');
const mysql = require('mysql2');

// (1)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

const app = express();

app.get('/getgame/:id', async (req, res) => {
    // (2)
    const [rows] = await connection.promise().query(
        'SELECT id, name, release_year FROM games WHERE id = ?',
        [req.params.id]
    );
    
    // (3)
    if (rows.length > 0) {
        res.json({
            id: rows[0].id,
            name: rows[0].name,
            release_year: rows[0].release_year
        });
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});
```

---

### Q6. React Components

```javascript
function MyButton({ onClick }) {
    return <button onClick={onClick}>Click me</button>;
}

function MyApp() {
    const [counter, setCounter] = React.useState(0);
    
    const handleClick = () => {
        setCounter(counter + 1);
    };
    
    return (
        <div>
            <p>Counter: {counter}</p>
            <MyButton onClick={handleClick} />
        </div>
    );
}
```

