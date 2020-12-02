const parse = require("node-html-parser").parse;
const URI =
  "https://www.zomato.com/cs/praha/profesn%C3%AD-d%C5%AFm-mal%C3%A1-strana-praha-1/denn%C3%AD-menu";

var axios = require("axios");

const getJsonMenu = () => {
  return axios
    .get(URI, {
      headers: {
        Referer: "http://www.sitepoint.com",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(function (response) {
      const root = parse(response.data);
      const menuDayNodes = root.querySelectorAll(".tmi-group");
      const jsonData = [];
      menuDayNodes.map((menuDayNode) => {
        const dayNameNode = menuDayNode.querySelector(".tmi-group-name");
        const today = new Date();
        const itemNodes = menuDayNode.querySelectorAll(".tmi-daily");
        const dayName = dayNameNode.childNodes[0].rawText.trim();
        jsonData.push({
          today: dayName.includes(today.getDate()),
          day: dayName,
          menuItems: itemNodes.map((itemNode) => {
            const name = itemNode.querySelector(".tmi-name");
            const price = itemNode.querySelector(".tmi-price .row");
            return {
              name: name.childNodes[0].rawText.trim(),
              price: price.childNodes[0].rawText.trim(),
            };
          }),
        });
      });
      return jsonData;
    });
};

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  getJsonMenu().then(data => res.send(data))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})