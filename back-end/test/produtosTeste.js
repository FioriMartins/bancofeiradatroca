const axios = require(axios)

// await axios.put("http://localhost:3000/categories/edit/233", {
//     nome: "Roupa"
// })

await axios.post("http://localhost:3000/stock/box/post", {
    turmaID: "2ds"
})