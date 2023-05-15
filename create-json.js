const fs = require("fs")
const fse = require("fs-extra")

const jsdom = require("jsdom")
const { JSDOM } = jsdom

const htmlJSON = fse.readFileSync("./index.html")
const dom = new JSDOM(htmlJSON, { includeNodeLocations: true })

const document = dom.window.document
const bodyEl = document.body // implicitly created

console.log(bodyEl.querySelectorAll("div").length)
const divs = bodyEl.querySelectorAll("div")

divs.forEach((el, index) => {
  const title = el.querySelector("h1")
  const auth = el.querySelector("h2")
  const type = el.querySelector("h3")
  const content = el.querySelector("content")
  const desc = el.querySelector("desc")
  const json = {
    title: trim(title.innerHTML),
    auth: trim(auth.innerHTML),
    type: trim(type.innerHTML),
    content: getContent(trim(content.innerHTML)),
    // text: trim(content.innerHTML),
    desc: trim(desc.innerHTML),
  }
  if (content.innerHTML.includes("strong")) {
    console.log(json)
  }

  fs.writeFileSync(`./json/${index + 1}.json`, JSON.stringify(json, null, 2))
  // console.log(json)
})

// 去除前后空格 和换行符
function trim(str = "") {
  return str.replace(/(^\s*)|(\s*$)/g, "").replace(/\n/g, "")
}

function getContent(str = "") {
  return str
    .replace(/<br>/g, "，")
    .replace(/\。/g, "，")
    .replace(/\！/g, "")
    .split("，")
    .filter(
      (item) => item && trim(item.replace(/<p>/g, "").replace(/<\/p>/g, ""))
    )
}
