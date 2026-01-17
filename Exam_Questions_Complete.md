# ĐỀ THI WEB PROGRAMMING - HANOI UNIVERSITY
## Faculty of Information Technology

---

## PART I - MULTIPLE-CHOICE QUESTIONS (6.0 pt)

### HTML & CSS Questions (Q1-Q12)

**Q1. Inline elements are normally displayed without starting a new line.**
- A. True
- B. False

**Q2. What is the correct HTML for inserting an image?**
- A. `<img href="image.gif" alt="My Image">`
- B. `<image src="image.gif" alt="My Image">`
- C. `<img alt="My Image">image.gif</img>`
- D. `<img src="image.gif" alt="My Image">`

**Q3. In HTML, which attribute is used to specify that an input field must be filled out?**
- A. placeholder
- B. validate
- C. formvalidate
- D. required

**Q4. Which HTML tag is used to define an internal style sheet?**
- A. `<style>`
- B. `<css>`
- C. `<sheet type="text/css">`
- D. `<script>`

**Q5. Which tag pair is used to link web pages to each other?**
- A. `<link></link>`
- B. `<url></url>`
- C. `<a></a>`
- D. `<hyperlink></hyperlink>`

**Q6. What is the correct HTML for creating a hyperlink?**
- A. `<a url="http://fit.hanu.vn">fit.hanu.vn</a>`
- B. `<a address="http://fit.hanu.vn">HANU FIT</a>`
- C. `<a href="http://fit.hanu.vn">FIT</a>`
- D. `<a src="http://fit.hanu.vn">http://fit.hanu.vn</a>`

**Q7. What is the correct HTML for making a text input field?**
- A. `<input type="textfield">`
- B. `<textfield>`
- C. `<input type="text">`
- D. `<textinput type="text">`

**Q8. Which type of CSS is coded in the body of the web page as an attribute of an HTML tag?**
- A. inline
- B. embedded
- C. external
- D. imported

**Q9. How do you select an element with id "demo"?**
- A. `.demo`
- B. `:demo`
- C. `#demo`
- D. `demo`

**Q10. Which CSS property is used to change the text color of an element?**
- A. foreground-color
- B. text-color
- C. color
- D. fgcolor

**Q11. How can you created rounded corners using CSS3?**
- A. `border-radius: 8px;`
- B. `border[round]: 8px;`
- C. `corner-effect: round;`
- D. `alpha-effect: round-corner;`

**Q12. Which of the following is not a property of Flex box?**
- A. `align-items`
- B. `justify-spacing`
- C. `justify-content`
- D. `flex-direction`

---

### JavaScript Questions (Q13-Q22)

**Q13. How do you call a function named myFunction?**
- A. call function myFunction()
- B. call myFunction()
- C. myFunction()
- D. myFunction.run()

**Q14. Which of the following will assign the value 5 to the variable productCost?**
- A. productCost <= 5;
- B. productCost = 5;
- C. productCost == 5;
- D. productCost => 5;

**Q15. What is the correct way to write a JavaScript array?**
- A. let colors = "red", "green", "blue"
- B. let colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")
- C. let colors = ["red", "green", "blue"]
- D. let colors = (1:"red", 2:"green", 3:"blue")

**Q16. Inside which HTML element do we put the JavaScript?**
- A. <javascript>
- B. <script>
- C. <js>
- D. <scripting>

**Q17. Which method of the window object can be used to display a message to the user?**
- A. alert()
- B. display()
- C. message()
- D. status()

**Q18. When the user moves the mouse pointer away from a link it had been hovering over, the browser detects which one of these events?**
- A. mouseup
- B. mouseaway
- C. mouseoff
- D. mouseout

**Q19. What is the function to stop an interval timer?**
- A. stopTimer
- B. clearInterval
- C. clearTimer
- D. shutdownTimer

**Q20. What is the output of the code below?**
```javascript
function job() {
    return new Promise(function (resolve, reject) {
        reject();
    });
}
job().then(function() {
    console.log('Success 1');
})
.then(function() {
    console.log('Success 2');
})
.catch(function() {
    console.log('Error');
})
```
- A. Success 1
  Success 2
- B. Success 1
  Success 2
  Error
- C. Success 1
  Error
- D. Error

**Q21. What is the default HTTP method used by the fetch function?**
- A. GET
- B. Request
- C. FormData
- D. POST

**Q22. Which of the following best describes x?**
`let x = await fetch(URL);`
- A. A Promise object
- B. An object which was parsed from a JSON string sent by the server
- C. The response text
- D. An object which contains the meta data of the response

---

### Node.js & Express Questions (Q23-Q35)

**Q23. What is Node.js?**
- A. A Java-based framework
- B. A network application framework
- C. A web server
- D. A JavaScript-based framework

**Q24. How do you install global packages with npm?**
- A. npm install -1 <package-name>
- B. npm global <package-name>
- C. npm install -g <package-name>
- D. npm install -global <package-name>

**Q25. Node.js runs on?**
- A. Client
- B. Server
- C. Both Client and Server
- D. Browser

**Q26. What is callback?**
- A. A function that is passed as an argument to another function.
- B. A backend endpoint's URL.
- C. An API call to the backend.
- D. An asynchronous equivalent for a function.

**Q27. Which of these is not a core feature of Express?**
- A. Templating
- B. Routing
- C. ORM
- D. Middleware

**Q28. Where can you access the capture values of URL parameters?**
- A. From the req.query object
- B. From the req.params object
- C. From the req.data object
- D. From the req.body object

**Q29. To serve static files like images, CSS files, and JavaScript files in Express, you use:**
- A. res.sendFile()
- B. express.static()
- C. res.sendStatic()
- D. app.static()

**Q30. Which middleware in Express.js helps in handling JSON data from POST requests?**
- A. express.data()
- B. express.json()
- C. express.urlencoded()
- D. express.parse()

**Q31. How do you retrieve the value of a specific cookie sent in a request in Express.js?**
- A. req.cookie.value
- B. req.values.cookieName
- C. req.get('cookieName')
- D. req.cookies [cookieName]

**Q32. In Express, if you want a middleware function to be executed for every request, where would you place it?**
- A. Inside each route definition
- B. Inside the app's main file
- C. Before all route definitions
- D. At the end of all route definitions

**Q33. What is the method that allows you to write content to a file?**
- A. fs.write
- B. fs.output
- C. fs.writeFile
- D. fs.writeOut

**Q34. Which of the following Node modules is required for working with files and directories on the server?**
- A. os
- B. fs
- C. files
- D. system

**Q35. Which of the following is not a valid HTTP method?**
- A. HEADER
- B. PUT
- C. GET
- D. POST

---

### React Questions (Q36-Q40)

**Q36. JSX stands for?**
- A. JavaScript eXecutable
- B. JavaScript XML
- C. JointScript XML
- D. JavaScreenXML

**Q37. React separates the user interface into components. How are components combined to create a user interface?**
- A. By putting them in a folder structure
- B. By nesting components
- C. With webpack
- D. With code splitting

**Q38. What is a hook in React?**
- A. A hook helps you use state and lifecycle methods behavior in functional components
- B. A hook helps you customize a component
- C. A hook lets you hook up components to events
- D. A hook helps you create component's lifecycle

**Q39. What is the <></> tag called in React?**
- A. Grouper
- B. Empty
- C. Fragment
- D. Shard

**Q40. React can only render elements in the root document element.**
- A. True
- B. False

---

## PART II - SHORT-ANSWER QUESTIONS (7.0 pt)

### Q1. (1.0 pt) HTML & CSS - Card Container with Images

Use HTML and CSS to build a web page displaying four cards showing number images.

**Requirements for "Main card container":**
- Represented by a `<div class="card-container">`.
- The card should be 500px wide and 200px tall.
- It should have a solid border: `#698733` color, 0.5em thick, with a border-radius of 1em.

**Requirements for "Images inside the card":**
- Add 4 `<img>` tags inside the main card container, each representing a number (example image URLs: `/images/number-image0.png`, `/images/number-image1.png`, etc., for numbers 0 to 3).
- Images should take up 70% of the card's height.
- Images should be centered vertically and spaced evenly horizontally.

---

### Q2. (1.5 pt) JavaScript - Linear Equation Solver

Enhance the functionality of a provided web page to solve linear equations.

**Equation format:** `ax + b = 0`

**Provided HTML structure:**
```html
<head>
    <script src="linearEquations.js"></script>
</head>
<body>
    <h1>Linear Equation Solver</h1>
    <p>Equation format: ax + b = 0</p>
    <form id="equation-form">
        <label for="a">a:</label>
        <input type="number" id="a" name="a" required><br>
        <label for="b">b:</label>
        <input type="number" id="b" name="b" required><br>
        <button type="button" onclick="solveLinearEquation()">Solve</button>
    </form>
    <p id="result"></p>
</body>
```

**Instructions for `linearEquations.js`:**
- Write code for `linearEquations.js` to handle and display results of solving a linear equation.
- Do not change the contents of `index.html`.
- Use the `solveLinearEquation()` function to retrieve values from input fields `a` and `b`.
- Calculate the solution for the linear equation `ax + b = 0`.
- Display the result in the element with `id="result"`.

---

### Q3. (2.0 pt) Node.js Server and Frontend Implementation

Create a simple Node.js server that responds to HTTP requests using both GET and POST methods, along with a corresponding frontend.

**Server-side tasks:**

**Implement a GET endpoint:**
- It should respond with the text "Welcome, [name]!" when a user visits `http://localhost:8888/greet?name=Jack`.
- It must work with any name provided in the query string.

**Implement a POST endpoint:**
- It should take a JSON object with a key "number".
- It should respond with the square of that number.
- The endpoint should be `http://localhost:8080/square`.

**Provided Node.js/Express code snippet with TODOs:**
```javascript
const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

//(1) Implement GET Endpoint for greeting
// (2) implement POST endpoint for calculating square

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
```

**Frontend tasks:**
- The frontend should allow users to input their name and a number, displaying the corresponding results from the server.

**Provided HTML/JavaScript code snippet (within `<head><script>` tags) with TODOs:**
```html
<head>
<script>
(function () {
    window.addEventListener("load", init);
    //Function to fetch greeting
    function init() {
        document.getElementById('greetButton').addEventListener('click', function () {
            // (3) Implement fetch greeting
        });
        // Function to fetch square of a number
        document.getElementById('squareButton').addEventListener('click', function () {
            const number = parseFloat(document.getElementById('numberInput').value);
            // (4) Implement fetch square of a number
        });
    }
})();
</script>
</head>
```

**Provided HTML body structure:**
```html
<body>
    <h1>Greeting App</h1>
    <input type="text" id="nameInput" placeholder="Enter your name">
    <button id="greetButton">Greet</button>
    <h2 id="greetResult"></h2>
    
    <h1>Square Calculator</h1>
    <input type="number" id="numberInput" placeholder="Enter a number">
    <button id="squareButton">Get Square</button>
    <h2 id="squareResult"></h2>
</body>
```

---

### Q4. (1.5 pt) Node.js Express Application Tasks

**Given Node program skeleton:**
```javascript
const express = require('express');
const app = express();
// write your code here
app.listen(8080);
```

**Complete the following tasks:**
- a) Show the text "Welcome, Jack!" if a user visits `http://localhost:8080/greet?name=Jack` (must work with other names, too).
- b) Show the square of 2 when a user visits `http://localhost:8080/square/2` (must work with any other number).

---

### Q5. (1.5 pt) MySQL Database and Express API Task

**Given the following `games` table from the test database:**
```sql
CREATE TABLE `games` (
    `id` int(11) NOT NULL,
    `name` varchar(106) DEFAULT NULL,
    `platform` varchar(32) NOT NULL,
    `release_year` int(11) NOT NULL,
    `publisher` varchar(50) NOT NULL
);
```

**Complete the TODOs (1), (2), (3) in the following code:**
```javascript
const express = require('express');
const mysql = require('mysql2');
// (1) connect to the database with 'root' user and empty password
const app = express();
app.get('/getgame/:id', async (req, res) => {
    // (2) retrieve the game with the id from the URL
    // (3) response with a JSON object containing
    //     the game's id, name, and release_year
});
```

---

### Q6. (1.0 pt) React Components Task

Use React to create two function components:

**MyButton component:**
- Should be a function component.
- Should display a button with the label "Click me".

**MyApp component:**
- Should be a function component.
- Should display a counter value (integer) that starts at 0.
- Should include the `MyButton` component.
- The code should ensure that whenever a user clicks on `MyButton`, the counter value in `MyApp` is increased by 1.

---

## TỔNG KẾT

- **PART I:** 40 câu hỏi trắc nghiệm (6.0 điểm)
  - Q1-Q12: HTML & CSS
  - Q13-Q22: JavaScript
  - Q23-Q35: Node.js & Express
  - Q36-Q40: React

- **PART II:** 6 câu hỏi tự luận (7.0 điểm)
  - Q1: HTML & CSS (1.0 pt)
  - Q2: JavaScript (1.5 pt)
  - Q3: Node.js Server & Frontend (2.0 pt)
  - Q4: Node.js Express (1.5 pt)
  - Q5: MySQL & Express API (1.5 pt)
  - Q6: React Components (1.0 pt)

**Tổng điểm:** 13.0 điểm

