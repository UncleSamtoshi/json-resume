const Handlebars = require("handlebars")
const fs = require('fs')
require('dotenv').config()
const { exec } = require("child_process")

// Config for resumes
const baseResumeTemplatePath = "./resume-base.json"
const resumeDefinitions = [
    {
        name: "BitcoinResume",
        theme: "",
        filters: [(resume => ({ ...resume, work: resume.work.filter(experience => experience.company != "Flock") }))]
    },
    {
        name: "NormieResume",
        theme: "",
        filters: []
    }
]
const templateParameters = {
    email: process.env.email
}

// Apply Handlebars template parameters
const baseResumeTemplate = fs.readFileSync(baseResumeTemplatePath, "utf8")
var template = Handlebars.compile(baseResumeTemplate)
const baseResumePostTemplate = template(templateParameters)
const baseResumeObject = JSON.parse(baseResumePostTemplate)

// Create resumes base on individual definitions
const filterResume = (resume, filters) => {
    var newResume = {...baseResumeObject}
    filters.forEach(singleFilter => newResume = singleFilter(resume))
    return newResume
}
const resumes = resumeDefinitions.map(def => ({...def,resumeJson:filterResume(baseResumeObject,def.filters)}))

// Create json files, PDF's, and HTML
resumes.forEach(resume => {
    fs.writeFileSync("/out/",JSON.stringify(resume.resumeJson))
})

// Create PDF's and html from resumes
exec("resume export -r ./resume-updated.json ./bitcoinresume.pdf -t ./node_modules/jsonresume-theme-stackoverflow", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});